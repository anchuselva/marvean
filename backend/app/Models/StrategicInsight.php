<?php

namespace App\Models;

use App\Core\Database;

class StrategicInsight {
    public static function all(?string $horizon = null, ?string $impact = null, ?int $competitorId = null, ?string $search = null): array {
        $sql = "SELECT si.*, c.name as competitor_name, c.tier as competitor_tier,
                e.title as evidence_title, e.evidence_type, e.verification_hash,
                u.name as creator_name
                FROM `strategic_insights` si
                LEFT JOIN `competitors` c ON si.competitor_id = c.id
                LEFT JOIN `evidence_items` e ON si.evidence_id = e.id
                LEFT JOIN `users` u ON si.created_by = u.id
                WHERE 1=1";
        $params = [];

        if (!empty($horizon)) {
            $sql .= " AND si.strategic_horizon = :horizon";
            $params[':horizon'] = $horizon;
        }

        if (!empty($impact)) {
            $sql .= " AND si.impact_rating = :impact";
            $params[':impact'] = $impact;
        }

        if (!empty($competitorId)) {
            $sql .= " AND si.competitor_id = :competitorId";
            $params[':competitorId'] = $competitorId;
        }

        if (!empty($search)) {
            $sql .= " AND (si.title LIKE :search OR si.recommendation LIKE :search)";
            $params[':search'] = "%{$search}%";
        }

        $sql .= " ORDER BY si.created_at DESC";
        return Database::fetchAll($sql, $params);
    }

    public static function find(int $id): ?array {
        return Database::fetchOne("SELECT si.*, c.name as competitor_name, c.tier as competitor_tier,
                                  e.title as evidence_title, e.evidence_type, e.verification_hash, e.document_reference,
                                  u.name as creator_name 
                                  FROM `strategic_insights` si 
                                  LEFT JOIN `competitors` c ON si.competitor_id = c.id 
                                  LEFT JOIN `evidence_items` e ON si.evidence_id = e.id 
                                  LEFT JOIN `users` u ON si.created_by = u.id 
                                  WHERE si.id = :id LIMIT 1", [':id' => $id]);
    }

    public static function create(array $data, ?int $userId = null): int {
        $data['created_by'] = $userId;
        $id = Database::insert('strategic_insights', $data);
        Database::logActivity($userId, 'CREATE', 'StrategicInsight', $id, "Formulated strategic insight: {$data['title']}");
        return $id;
    }

    public static function update(int $id, array $data, ?int $userId = null): int {
        $ins = self::find($id);
        $rowCount = Database::update('strategic_insights', $data, '`id` = :id', [':id' => $id]);
        Database::logActivity($userId, 'UPDATE', 'StrategicInsight', $id, "Updated strategic insight: " . ($ins['title'] ?? "#$id"));
        return $rowCount;
    }

    public static function delete(int $id, ?int $userId = null): int {
        $ins = self::find($id);
        $title = $ins['title'] ?? "#$id";
        $rowCount = Database::delete('strategic_insights', '`id` = :id', [':id' => $id]);
        Database::logActivity($userId, 'DELETE', 'StrategicInsight', $id, "Deleted strategic insight: {$title}");
        return $rowCount;
    }

    public static function count(): int {
        $res = Database::fetchOne("SELECT COUNT(*) as c FROM `strategic_insights`");
        return (int)($res['c'] ?? 0);
    }
}
