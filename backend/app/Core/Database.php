<?php

namespace App\Core;

use PDO;
use PDOException;

class Database {
    private static ?PDO $instance = null;

    public static function getConnection(): PDO {
        if (self::$instance === null) {
            $config = require dirname(__DIR__, 2) . '/config/database.php';
            $dsn = "{$config['driver']}:host={$config['host']};port={$config['port']};dbname={$config['database']};charset={$config['charset']}";

            try {
                self::$instance = new PDO($dsn, $config['username'], $config['password'], $config['options']);
            } catch (PDOException $e) {
                throw new PDOException('Database connection failed.', (int)$e->getCode(), $e);
            }
        }
        return self::$instance;
    }

    public static function query(string $sql, array $params = []): \PDOStatement {
        $stmt = self::getConnection()->prepare($sql);
        $stmt->execute($params);
        return $stmt;
    }

    public static function fetchAll(string $sql, array $params = []): array {
        return self::query($sql, $params)->fetchAll();
    }

    public static function fetchOne(string $sql, array $params = []): ?array {
        $res = self::query($sql, $params)->fetch();
        return $res ?: null;
    }

    public static function fetchValue(string $sql, array $params = []): mixed {
        $stmt = self::query($sql, $params);
        $val = $stmt->fetchColumn();
        return $val !== false ? $val : null;
    }

    public static function insert(string $table, array $data): int {
        $fields = array_keys($data);
        $placeholders = array_map(fn($f) => ":$f", $fields);
        $sql = "INSERT INTO `{$table}` (`" . implode('`, `', $fields) . "`) VALUES (" . implode(', ', $placeholders) . ")";
        
        $params = [];
        foreach ($data as $k => $v) {
            $params[":$k"] = $v;
        }

        self::query($sql, $params);
        return (int) self::getConnection()->lastInsertId();
    }

    public static function update(string $table, array $data, string $where, array $whereParams = []): int {
        $setClauses = [];
        $params = [];
        foreach ($data as $k => $v) {
            $setClauses[] = "`{$k}` = :set_{$k}";
            $params[":set_{$k}"] = $v;
        }

        foreach ($whereParams as $k => $v) {
            $params[$k] = $v;
        }

        $sql = "UPDATE `{$table}` SET " . implode(', ', $setClauses) . " WHERE {$where}";
        $stmt = self::query($sql, $params);
        return $stmt->rowCount();
    }

    public static function delete(string $table, string $where, array $params = []): int {
        $sql = "DELETE FROM `{$table}` WHERE {$where}";
        $stmt = self::query($sql, $params);
        return $stmt->rowCount();
    }

    public static function logActivity(?int $userId, string $action, string $entityType, int $entityId, string $description): void {
        try {
            self::insert('activity_logs', [
                'user_id'     => $userId,
                'action'      => $action,
                'entity_type' => $entityType,
                'entity_id'   => $entityId,
                'description' => $description,
                'ip_address'  => $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1'
            ]);
        } catch (\Exception $e) {
            // silent fail for activity log
        }
    }
}
