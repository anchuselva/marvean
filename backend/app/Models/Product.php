<?php

namespace App\Models;

use App\Core\Database;

class Product {
    public static function all(?int $competitorId = null): array {
        $sql = "SELECT p.*, c.name as competitor_name, c.tier as competitor_tier 
                FROM `products` p 
                JOIN `competitors` c ON p.competitor_id = c.id";
        $params = [];
        if ($competitorId) {
            $sql .= " WHERE p.competitor_id = :cid";
            $params[':cid'] = $competitorId;
        }
        $sql .= " ORDER BY c.name ASC, p.name ASC";
        return Database::fetchAll($sql, $params);
    }

    public static function find(int $id): ?array {
        return Database::fetchOne("SELECT p.*, c.name as competitor_name 
                                  FROM `products` p 
                                  JOIN `competitors` c ON p.competitor_id = c.id 
                                  WHERE p.id = :id LIMIT 1", [':id' => $id]);
    }

    public static function create(array $data, ?int $userId = null): int {
        $id = Database::insert('products', $data);
        Database::logActivity($userId, 'CREATE', 'Product', $id, "Added product {$data['name']} for competitor #{$data['competitor_id']}");
        return $id;
    }

    public static function update(int $id, array $data, ?int $userId = null): int {
        $rowCount = Database::update('products', $data, '`id` = :id', [':id' => $id]);
        Database::logActivity($userId, 'UPDATE', 'Product', $id, "Updated product #{$id}");
        return $rowCount;
    }

    public static function delete(int $id, ?int $userId = null): int {
        $prod = self::find($id);
        $name = $prod['name'] ?? "#$id";
        $rowCount = Database::delete('products', '`id` = :id', [':id' => $id]);
        Database::logActivity($userId, 'DELETE', 'Product', $id, "Deleted product {$name}");
        return $rowCount;
    }
}
