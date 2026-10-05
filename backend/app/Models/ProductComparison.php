<?php

namespace App\Models;

use App\Core\Database;

class ProductComparison {
    public static function all(): array {
        return Database::fetchAll("SELECT pc.*, p.name as target_product_name, c.name as competitor_name, u.name as creator_name,
                                  (SELECT COUNT(*) FROM `product_comparison_attributes` pca WHERE pca.comparison_id = pc.id) as attributes_count
                                  FROM `product_comparisons` pc
                                  LEFT JOIN `products` p ON pc.target_product_id = p.id
                                  LEFT JOIN `competitors` c ON p.competitor_id = c.id
                                  LEFT JOIN `users` u ON pc.created_by = u.id
                                  ORDER BY pc.created_at DESC");
    }

    public static function find(int $id): ?array {
        return Database::fetchOne("SELECT pc.*, p.name as target_product_name, p.pricing_tier, p.pricing_model, 
                                  c.name as competitor_name, c.tier as competitor_tier, u.name as creator_name
                                  FROM `product_comparisons` pc
                                  LEFT JOIN `products` p ON pc.target_product_id = p.id
                                  LEFT JOIN `competitors` c ON p.competitor_id = c.id
                                  LEFT JOIN `users` u ON pc.created_by = u.id
                                  WHERE pc.id = :id LIMIT 1", [':id' => $id]);
    }

    public static function create(array $data, array $attributes = [], ?int $userId = null): int {
        $data['created_by'] = $userId;
        $id = Database::insert('product_comparisons', $data);

        foreach ($attributes as $attr) {
            if (!empty($attr['attribute_name'])) {
                Database::insert('product_comparison_attributes', [
                    'comparison_id'     => $id,
                    'attribute_name'    => $attr['attribute_name'],
                    'marvean_metric'    => $attr['marvean_metric'] ?? 'Superior SLA / Real-time',
                    'competitor_metric' => $attr['competitor_metric'] ?? 'Standard / Batch',
                    'advantage'         => $attr['advantage'] ?? 'Marvean',
                    'audit_note'        => $attr['audit_note'] ?? null
                ]);
            }
        }

        Database::insert('comparison_history', [
            'comparison_id' => $id,
            'user_id'       => $userId,
            'action'        => 'Comparison Initialized',
            'notes'         => "Initialized matrix: {$data['title']}"
        ]);

        Database::logActivity($userId, 'CREATE', 'ProductComparison', $id, "Created product comparison: {$data['title']}");
        return $id;
    }

    public static function update(int $id, array $data, ?int $userId = null, string $changeNotes = 'Updated comparison matrix'): int {
        $comp = self::find($id);
        $rowCount = Database::update('product_comparisons', $data, '`id` = :id', [':id' => $id]);

        Database::insert('comparison_history', [
            'comparison_id' => $id,
            'user_id'       => $userId,
            'action'        => 'Matrix Updated',
            'notes'         => $changeNotes
        ]);

        Database::logActivity($userId, 'UPDATE', 'ProductComparison', $id, "Updated comparison: " . ($comp['title'] ?? "#$id"));
        return $rowCount;
    }

    public static function delete(int $id, ?int $userId = null): int {
        $comp = self::find($id);
        $title = $comp['title'] ?? "#$id";
        $rowCount = Database::delete('product_comparisons', '`id` = :id', [':id' => $id]);
        Database::logActivity($userId, 'DELETE', 'ProductComparison', $id, "Deleted comparison: {$title}");
        return $rowCount;
    }

    public static function attributes(int $comparisonId): array {
        return Database::fetchAll("SELECT * FROM `product_comparison_attributes` WHERE comparison_id = :id ORDER BY id ASC", [':id' => $comparisonId]);
    }

    public static function addAttribute(int $comparisonId, array $attr, ?int $userId = null): int {
        $attr['comparison_id'] = $comparisonId;
        $id = Database::insert('product_comparison_attributes', $attr);

        Database::insert('comparison_history', [
            'comparison_id' => $comparisonId,
            'user_id'       => $userId,
            'action'        => 'Attribute Added',
            'notes'         => "Added comparison attribute: {$attr['attribute_name']}"
        ]);

        return $id;
    }

    public static function deleteAttribute(int $attrId, ?int $userId = null): int {
        $attr = Database::fetchOne("SELECT * FROM `product_comparison_attributes` WHERE id = :id", [':id' => $attrId]);
        if (!$attr) return 0;

        $rowCount = Database::delete('product_comparison_attributes', '`id` = :id', [':id' => $attrId]);
        Database::insert('comparison_history', [
            'comparison_id' => $attr['comparison_id'],
            'user_id'       => $userId,
            'action'        => 'Attribute Removed',
            'notes'         => "Removed attribute: {$attr['attribute_name']}"
        ]);
        return $rowCount;
    }

    public static function history(int $comparisonId): array {
        return Database::fetchAll("SELECT ch.*, u.name as user_name 
                                  FROM `comparison_history` ch 
                                  LEFT JOIN `users` u ON ch.user_id = u.id 
                                  WHERE ch.comparison_id = :id 
                                  ORDER BY ch.created_at DESC", [':id' => $comparisonId]);
    }

    public static function count(): int {
        $res = Database::fetchOne("SELECT COUNT(*) as c FROM `product_comparisons`");
        return (int)($res['c'] ?? 0);
    }
}
