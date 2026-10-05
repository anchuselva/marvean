<?php

namespace App\Core;

class View {
    public static function render(string $viewPath, array $data = [], string $layout = 'layouts/main'): void {
        Auth::init();

        // Flash message helpers
        $flashSuccess = $_SESSION['flash_success'] ?? null;
        $flashError = $_SESSION['flash_error'] ?? null;
        unset($_SESSION['flash_success'], $_SESSION['flash_error']);

        // CSRF Token
        if (empty($_SESSION['csrf_token'])) {
            $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
        }
        $csrfToken = $_SESSION['csrf_token'];

        // Current authenticated user
        $currentUser = Auth::user();

        // Extract passed data
        extract($data);

        // Capture view content
        ob_start();
        $fullViewFile = dirname(__DIR__, 2) . "/views/{$viewPath}.php";
        if (file_exists($fullViewFile)) {
            require $fullViewFile;
        } else {
            echo "<div class='alert alert-danger'>View file not found: {$viewPath}</div>";
        }
        $content = ob_get_clean();

        // Render layout
        if ($layout) {
            $fullLayoutFile = dirname(__DIR__, 2) . "/views/{$layout}.php";
            if (file_exists($fullLayoutFile)) {
                require $fullLayoutFile;
                return;
            }
        }

        echo $content;
    }

    public static function setFlash(string $type, string $message): void {
        Auth::init();
        $_SESSION["flash_{$type}"] = $message;
    }

    public static function redirect(string $url): void {
        header("Location: {$url}");
        exit;
    }

    public static function json(array $data, int $status = 200): void {
        http_response_code($status);
        header('Content-Type: application/json');
        echo json_encode($data);
        exit;
    }

    public static function csrfField(): string {
        Auth::init();
        $token = $_SESSION['csrf_token'] ?? '';
        return '<input type="hidden" name="_token" value="' . htmlspecialchars($token, ENT_QUOTES) . '">';
    }

    public static function verifyCsrf(): bool {
        Auth::init();
        $token = $_POST['_token'] ?? $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
        return !empty($token) && hash_equals($_SESSION['csrf_token'] ?? '', $token);
    }
}
