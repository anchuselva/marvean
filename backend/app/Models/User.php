<?php

namespace App\Models;

use App\Core\Database;

class User {
    public static function all(): array {
        return Database::fetchAll("SELECT `id`, `name`, `email`, `role`, `status`, `last_login_at`, `created_at` FROM `users` ORDER BY `id` DESC");
    }

    public static function find(int $id): ?array {
        return Database::fetchOne("SELECT * FROM `users` WHERE `id` = :id LIMIT 1", [':id' => $id]);
    }

    public static function create(array $data): int {
        $data['password'] = password_hash($data['password'], PASSWORD_BCRYPT);
        $data['email'] = strtolower(trim($data['email']));
        return Database::insert('users', $data);
    }

    public static function update(int $id, array $data): int {
        if (!empty($data['password'])) {
            $data['password'] = password_hash($data['password'], PASSWORD_BCRYPT);
        } else {
            unset($data['password']);
        }
        if (isset($data['email'])) {
            $data['email'] = strtolower(trim($data['email']));
        }
        return Database::update('users', $data, '`id` = :id', [':id' => $id]);
    }

    public static function delete(int $id): int {
        return Database::delete('users', '`id` = :id', [':id' => $id]);
    }

    public static function count(): int {
        $res = Database::fetchOne("SELECT COUNT(*) as c FROM `users`");
        return (int)($res['c'] ?? 0);
    }
}
