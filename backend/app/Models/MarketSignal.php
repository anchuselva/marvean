<?php

namespace App\Models;

use App\Core\Database;

class MarketSignal {
    public static function all(?string $category = null, ?string $severity = null, ?string $status = null, ?int $competitorId = null, ?string $search = null): array {
        $sql = "SELECT ms.*, c.name as competitor_name, c.tier as competitor_tier, u.name as creator_name,
                (SELECT COUNT(*) FROM `signal_history` sh WHERE sh.signal_id = ms.id) as history_count
                FROM `market_signals` ms
                LEFT JOIN `competitors` c ON ms.competitor_id = c.id
                LEFT JOIN `users` u ON ms.created_by = u.id
                WHERE 1=1";
        $params = [];

        if (!empty($category)) {
            $sql .= " AND ms.category = :category";
            $params[':category'] = $category;
        }

        if (!empty($severity)) {
            $sql .= " AND ms.severity = :severity";
            $params[':severity'] = $severity;
        }

        if (!empty($status)) {
            $sql .= " AND ms.status = :status";
            $params[':status'] = $status;
        }

        if (!empty($competitorId)) {
            $sql .= " AND ms.competitor_id = :competitorId";
            $params[':competitorId'] = $competitorId;
        }

        if (!empty($search)) {
            $sql .= " AND (ms.title LIKE :search OR ms.details LIKE :search)";
            $params[':search'] = "%{$search}%";
        }

        $sql .= " ORDER BY CASE ms.severity WHEN 'Critical' THEN 1 WHEN 'High' THEN 2 WHEN 'Medium' THEN 3 ELSE 4 END, ms.created_at DESC";
        return Database::fetchAll($sql, $params);
    }

    public static function find(int $id): ?array {
        return Database::fetchOne("SELECT ms.*, c.name as competitor_name, c.tier as competitor_tier, u.name as creator_name 
                                  FROM `market_signals` ms 
                                  LEFT JOIN `competitors` c ON ms.competitor_id = c.id 
                                  LEFT JOIN `users` u ON ms.created_by = u.id 
                                  WHERE ms.id = :id LIMIT 1", [':id' => $id]);
    }

    public static function create(array $data, ?int $userId = null): int {
        $data['created_by'] = $userId;
        $id = Database::insert('market_signals', $data);

        Database::insert('signal_history', [
            'signal_id'       => $id,
            'user_id'         => $userId,
            'previous_status' => 'Ingested',
            'new_status'      => $data['status'] ?? 'Active Alert',
            'notes'           => "Signal ingested with {$data['severity']} severity rating via {$data['source_tag']}."
        ]);

        Database::logActivity($userId, 'CREATE', 'MarketSignal', $id, "Ingested market signal: {$data['title']}");
        return $id;
    }

    public static function update(int $id, array $data, ?int $userId = null): int {
        $sig = self::find($id);
        $rowCount = Database::update('market_signals', $data, '`id` = :id', [':id' => $id]);
        Database::logActivity($userId, 'UPDATE', 'MarketSignal', $id, "Updated signal: " . ($sig['title'] ?? "#$id"));
        return $rowCount;
    }

    public static function updateStatus(int $id, string $newStatus, string $notes, ?int $userId = null): bool {
        $sig = self::find($id);
        if (!$sig) return false;

        $oldStatus = $sig['status'];
        Database::update('market_signals', ['status' => $newStatus], '`id` = :id', [':id' => $id]);

        Database::insert('signal_history', [
            'signal_id'       => $id,
            'user_id'         => $userId,
            'previous_status' => $oldStatus,
            'new_status'      => $newStatus,
            'notes'           => $notes ?: "Status transition from {$oldStatus} to {$newStatus}"
        ]);

        Database::logActivity($userId, 'STATUS_CHANGE', 'MarketSignal', $id, "Signal #{$id} status changed: {$oldStatus} -> {$newStatus}");
        return true;
    }

    public static function delete(int $id, ?int $userId = null): int {
        $sig = self::find($id);
        $title = $sig['title'] ?? "#$id";
        $rowCount = Database::delete('market_signals', '`id` = :id', [':id' => $id]);
        Database::logActivity($userId, 'DELETE', 'MarketSignal', $id, "Deleted signal: {$title}");
        return $rowCount;
    }

    public static function history(int $signalId): array {
        return Database::fetchAll("SELECT sh.*, u.name as user_name 
                                  FROM `signal_history` sh 
                                  LEFT JOIN `users` u ON sh.user_id = u.id 
                                  WHERE sh.signal_id = :id 
                                  ORDER BY sh.created_at DESC", [':id' => $signalId]);
    }

    public static function count(?string $status = null): int {
        $sql = "SELECT COUNT(*) as c FROM `market_signals`";
        $params = [];
        if ($status) {
            $sql .= " WHERE `status` = :status";
            $params[':status'] = $status;
        }
        $res = Database::fetchOne($sql, $params);
        return (int)($res['c'] ?? 0);
    }

    public static function criticalCount(): int {
        $res = Database::fetchOne("SELECT COUNT(*) as c FROM `market_signals` WHERE `severity` = 'Critical' AND `status` != 'Archived'");
        return (int)($res['c'] ?? 0);
    }
}
