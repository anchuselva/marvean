<?php

namespace App\Models;

use App\Core\Database;

class MarketRecord {
    public static function all(?string $industry = null, ?string $classification = null, ?string $search = null): array {
        $sql = "SELECT mr.*, u.name as creator_name,
                (SELECT COUNT(*) FROM `market_sources` ms WHERE ms.market_record_id = mr.id) as sources_count
                FROM `market_records` mr
                LEFT JOIN `users` u ON mr.created_by = u.id
                WHERE 1=1";
        $params = [];

        if (!empty($industry)) {
            $sql .= " AND mr.industry = :industry";
            $params[':industry'] = $industry;
        }

        if (!empty($classification)) {
            $sql .= " AND mr.classification = :classification";
            $params[':classification'] = $classification;
        }

        if (!empty($search)) {
            $sql .= " AND (mr.title LIKE :search OR mr.executive_summary LIKE :search)";
            $params[':search'] = "%{$search}%";
        }

        $sql .= " ORDER BY mr.created_at DESC";
        return Database::fetchAll($sql, $params);
    }

    public static function find(int $id): ?array {
        return Database::fetchOne("SELECT mr.*, u.name as creator_name 
                                  FROM `market_records` mr 
                                  LEFT JOIN `users` u ON mr.created_by = u.id 
                                  WHERE mr.id = :id LIMIT 1", [':id' => $id]);
    }

    public static function create(array $data, array $sources = [], ?int $userId = null): int {
        $data['created_by'] = $userId;
        $id = Database::insert('market_records', $data);

        // Insert initial sources
        foreach ($sources as $s) {
            if (!empty($s['source_name'])) {
                Database::insert('market_sources', [
                    'market_record_id'  => $id,
                    'source_name'       => $s['source_name'],
                    'source_type'       => $s['source_type'] ?? 'Regulatory Filing',
                    'source_url'        => $s['source_url'] ?? null,
                    'citation_key'      => $s['citation_key'] ?? ('SRC-' . rand(1000, 9999)),
                    'verification_date' => $s['verification_date'] ?? date('Y-m-d')
                ]);
            }
        }

        // Record history
        Database::insert('market_record_history', [
            'market_record_id' => $id,
            'user_id'          => $userId,
            'revision_number'  => 1,
            'change_summary'   => "Initial publication of market intelligence record: {$data['title']}"
        ]);

        Database::logActivity($userId, 'CREATE', 'MarketRecord', $id, "Created market record: {$data['title']}");
        return $id;
    }

    public static function update(int $id, array $data, array $newSources = [], ?int $userId = null, string $changeSummary = 'Updated market record intelligence'): int {
        $record = self::find($id);
        $rowCount = Database::update('market_records', $data, '`id` = :id', [':id' => $id]);

        // Insert additional sources if provided
        foreach ($newSources as $s) {
            if (!empty($s['source_name'])) {
                Database::insert('market_sources', [
                    'market_record_id'  => $id,
                    'source_name'       => $s['source_name'],
                    'source_type'       => $s['source_type'] ?? 'Industry Citation',
                    'source_url'        => $s['source_url'] ?? null,
                    'citation_key'      => $s['citation_key'] ?? ('SRC-' . rand(1000, 9999)),
                    'verification_date' => date('Y-m-d')
                ]);
            }
        }

        // Determine revision number
        $lastRev = Database::fetchOne("SELECT MAX(revision_number) as max_rev FROM `market_record_history` WHERE market_record_id = :id", [':id' => $id]);
        $nextRev = (int)($lastRev['max_rev'] ?? 1) + 1;

        Database::insert('market_record_history', [
            'market_record_id' => $id,
            'user_id'          => $userId,
            'revision_number'  => $nextRev,
            'change_summary'   => $changeSummary
        ]);

        Database::logActivity($userId, 'UPDATE', 'MarketRecord', $id, "Updated market record: " . ($record['title'] ?? "#$id"));
        return $rowCount;
    }

    public static function delete(int $id, ?int $userId = null): int {
        $rec = self::find($id);
        $title = $rec['title'] ?? "#$id";
        $rowCount = Database::delete('market_records', '`id` = :id', [':id' => $id]);
        Database::logActivity($userId, 'DELETE', 'MarketRecord', $id, "Deleted market record: {$title}");
        return $rowCount;
    }

    public static function sources(int $recordId): array {
        return Database::fetchAll("SELECT * FROM `market_sources` WHERE market_record_id = :id ORDER BY id ASC", [':id' => $recordId]);
    }

    public static function history(int $recordId): array {
        return Database::fetchAll("SELECT mrh.*, u.name as user_name 
                                  FROM `market_record_history` mrh 
                                  LEFT JOIN `users` u ON mrh.user_id = u.id 
                                  WHERE mrh.market_record_id = :id 
                                  ORDER BY mrh.created_at DESC", [':id' => $recordId]);
    }

    public static function count(): int {
        $res = Database::fetchOne("SELECT COUNT(*) as c FROM `market_records`");
        return (int)($res['c'] ?? 0);
    }
}
