<?php

namespace App\Models;

use App\Core\Database;

class Competitor {
    public static function all(?string $category = null, ?string $tier = null, ?string $search = null): array {
        $sql = "SELECT c.*, u.name as creator_name,
                (SELECT COUNT(*) FROM `market_signals` s WHERE s.competitor_id = c.id) as signals_count,
                (SELECT COUNT(*) FROM `products` p WHERE p.competitor_id = c.id) as products_count
                FROM `competitors` c
                LEFT JOIN `users` u ON c.created_by = u.id
                WHERE 1=1";
        $params = [];

        if (!empty($category)) {
            $sql .= " AND c.category = :category";
            $params[':category'] = $category;
        }

        if (!empty($tier)) {
            $sql .= " AND c.tier = :tier";
            $params[':tier'] = $tier;
        }

        if (!empty($search)) {
            $sql .= " AND (c.name LIKE :search OR c.overview LIKE :search OR c.ticker LIKE :search)";
            $params[':search'] = "%{$search}%";
        }

        $sql .= " ORDER BY c.tier ASC, c.name ASC";
        return Database::fetchAll($sql, $params);
    }

    public static function find(int $id): ?array {
        return Database::fetchOne("SELECT c.*, u.name as creator_name 
                                  FROM `competitors` c 
                                  LEFT JOIN `users` u ON c.created_by = u.id 
                                  WHERE c.id = :id LIMIT 1", [':id' => $id]);
    }

    public static function create(array $data, ?int $userId = null): int {
        $data['created_by'] = $userId;
        $id = Database::insert('competitors', $data);

        // Record initial profile creation update
        Database::insert('competitor_updates', [
            'competitor_id' => $id,
            'user_id'       => $userId,
            'update_type'   => 'Profile Created',
            'change_field'  => 'Initial Registration',
            'summary'       => "Profile initialized for {$data['name']} in category {$data['category']} with {$data['tier']} tier."
        ]);

        Database::logActivity($userId, 'CREATE', 'Competitor', $id, "Added competitor profile: {$data['name']}");
        return $id;
    }

    public static function update(int $id, array $data, ?int $userId = null, string $changeSummary = 'Profile attributes updated'): int {
        $comp = self::find($id);
        $rowCount = Database::update('competitors', $data, '`id` = :id', [':id' => $id]);

        // Record update history
        Database::insert('competitor_updates', [
            'competitor_id' => $id,
            'user_id'       => $userId,
            'update_type'   => 'Profile Modification',
            'change_field'  => 'Profile Attributes',
            'summary'       => $changeSummary
        ]);

        Database::logActivity($userId, 'UPDATE', 'Competitor', $id, "Updated competitor profile: " . ($comp['name'] ?? "#$id"));
        return $rowCount;
    }

    public static function delete(int $id, ?int $userId = null): int {
        $comp = self::find($id);
        $name = $comp['name'] ?? "#$id";
        $rowCount = Database::delete('competitors', '`id` = :id', [':id' => $id]);
        Database::logActivity($userId, 'DELETE', 'Competitor', $id, "Deleted competitor: {$name}");
        return $rowCount;
    }

    public static function updates(int $competitorId): array {
        return Database::fetchAll("SELECT cu.*, u.name as user_name 
                                  FROM `competitor_updates` cu 
                                  LEFT JOIN `users` u ON cu.user_id = u.id 
                                  WHERE cu.competitor_id = :id 
                                  ORDER BY cu.created_at DESC", [':id' => $competitorId]);
    }

    public static function products(int $competitorId): array {
        return Database::fetchAll("SELECT * FROM `products` WHERE competitor_id = :id ORDER BY name ASC", [':id' => $competitorId]);
    }

    public static function signals(int $competitorId): array {
        return Database::fetchAll("SELECT * FROM `market_signals` WHERE competitor_id = :id ORDER BY created_at DESC", [':id' => $competitorId]);
    }

    public static function insights(int $competitorId): array {
        return Database::fetchAll("SELECT * FROM `strategic_insights` WHERE competitor_id = :id ORDER BY created_at DESC", [':id' => $competitorId]);
    }

    public static function count(): int {
        $res = Database::fetchOne("SELECT COUNT(*) as c FROM `competitors`");
        return (int)($res['c'] ?? 0);
    }

    public static function categories(): array {
        return Database::fetchAll("SELECT DISTINCT `category` FROM `competitors` ORDER BY `category` ASC");
    }
}
