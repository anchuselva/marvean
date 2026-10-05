<?php

namespace App\Core;

class Auth {
    public static function init(): void {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
    }

    public static function attempt(string $email, string $password): bool {
        self::init();
        $user = Database::fetchOne("SELECT * FROM `users` WHERE `email` = :email AND `status` = 'active' LIMIT 1", [
            ':email' => strtolower(trim($email))
        ]);

        if ($user && password_verify($password, $user['password'])) {
            // Update last login
            Database::update('users', ['last_login_at' => date('Y-m-d H:i:s')], '`id` = :id', [':id' => $user['id']]);

            $_SESSION['user_id'] = $user['id'];
            $_SESSION['user'] = [
                'id'    => $user['id'],
                'name'  => $user['name'],
                'email' => $user['email'],
                'role'  => $user['role']
            ];

            Database::logActivity($user['id'], 'LOGIN', 'User', $user['id'], "User {$user['name']} logged in successfully.");
            return true;
        }

        return false;
    }

    public static function check(): bool {
        self::init();
        return !empty($_SESSION['user_id']);
    }

    public static function user(): ?array {
        self::init();
        return $_SESSION['user'] ?? null;
    }

    public static function id(): ?int {
        self::init();
        return $_SESSION['user_id'] ?? null;
    }

    public static function role(): string {
        $u = self::user();
        return $u['role'] ?? 'guest';
    }

    public static function hasRole(array|string $roles): bool {
        $current = self::role();
        if ($current === 'admin') return true; // admin has all capabilities
        if (is_string($roles)) return $current === $roles;
        return in_array($current, $roles);
    }

    public static function logout(): void {
        self::init();
        if (isset($_SESSION['user_id'])) {
            Database::logActivity($_SESSION['user_id'], 'LOGOUT', 'User', $_SESSION['user_id'], "User logged out.");
        }
        unset($_SESSION['user_id'], $_SESSION['user']);
        session_destroy();
    }
}
