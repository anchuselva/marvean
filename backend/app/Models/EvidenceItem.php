<?php

namespace App\Models;

use App\Core\Database;

class EvidenceItem {
    public static function all(?string $evidenceType = null, ?string $search = null): array {
        $sql = "SELECT e.*, u.name as creator_name,
                (SELECT COUNT(*) FROM `strategic_insights` si WHERE si.evidence_id = e.id) as insights_count
                FROM `evidence_items` e
                LEFT JOIN `users` u ON e.created_by = u.id
                WHERE 1=1";
        $params = [];

        if (!empty($evidenceType)) {
            $sql .= " AND e.evidence_type = :evidenceType";
            $params[':evidenceType'] = $evidenceType;
        }

        if (!empty($search)) {
            $sql .= " AND (e.title LIKE :search OR e.document_reference LIKE :search OR e.summary LIKE :search)";
            $params[':search'] = "%{$search}%";
        }

        $sql .= " ORDER BY e.verified_at DESC";
        return Database::fetchAll($sql, $params);
    }

    public static function find(int $id): ?array {
        return Database::fetchOne("SELECT e.*, u.name as creator_name 
                                  FROM `evidence_items` e 
                                  LEFT JOIN `users` u ON e.created_by = u.id 
                                  WHERE e.id = :id LIMIT 1", [':id' => $id]);
    }

    public static function create(array $data, ?int $userId = null): int {
        $data['created_by'] = $userId;
        if (empty($data['verification_hash'])) {
            $data['verification_hash'] = hash('sha256', $data['title'] . ($data['document_reference'] ?? '') . time());
        }
        if (empty($data['verified_at'])) {
            $data['verified_at'] = date('Y-m-d H:i:s');
        }

        $id = Database::insert('evidence_items', $data);
        Database::logActivity($userId, 'CREATE', 'EvidenceItem', $id, "Registered evidence document: {$data['title']}");
        return $id;
    }

    public static function update(int $id, array $data, ?int $userId = null): int {
        $evi = self::find($id);
        $rowCount = Database::update('evidence_items', $data, '`id` = :id', [':id' => $id]);
        Database::logActivity($userId, 'UPDATE', 'EvidenceItem', $id, "Updated evidence record: " . ($evi['title'] ?? "#$id"));
        return $rowCount;
    }

    public static function delete(int $id, ?int $userId = null): int {
        $evi = self::find($id);
        $title = $evi['title'] ?? "#$id";
        $rowCount = Database::delete('evidence_items', '`id` = :id', [':id' => $id]);
        Database::logActivity($userId, 'DELETE', 'EvidenceItem', $id, "Deleted evidence record: {$title}");
        return $rowCount;
    }

    public static function insights(int $evidenceId): array {
        return Database::fetchAll("SELECT si.*, c.name as competitor_name 
                                  FROM `strategic_insights` si 
                                  LEFT JOIN `competitors` c ON si.competitor_id = c.id 
                                  WHERE si.evidence_id = :id 
                                  ORDER BY si.created_at DESC", [':id' => $evidenceId]);
    }

    public static function count(): int {
        $res = Database::fetchOne("SELECT COUNT(*) as c FROM `evidence_items`");
        return (int)($res['c'] ?? 0);
    }
}
