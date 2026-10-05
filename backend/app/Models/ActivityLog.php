<?php

namespace App\Models;

use App\Core\Database;

class ActivityLog {
    public static function recent(int $limit = 20): array {
        return Database::fetchAll("SELECT al.*, u.name as user_name, u.role as user_role 
                                  FROM `activity_logs` al 
                                  LEFT JOIN `users` u ON al.user_id = u.id 
                                  ORDER BY al.created_at DESC LIMIT :limit", [':limit' => $limit]);
    }

    public static function forEntity(string $entityType, int $entityId): array {
        return Database::fetchAll("SELECT al.*, u.name as user_name 
                                  FROM `activity_logs` al 
                                  LEFT JOIN `users` u ON al.user_id = u.id 
                                  WHERE al.entity_type = :entityType AND al.entity_id = :entityId 
                                  ORDER BY al.created_at DESC", [
            ':entityType' => $entityType,
            ':entityId'   => $entityId
        ]);
    }
}
