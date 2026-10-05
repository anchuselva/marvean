<?php
// ============================================================================
// Database Configuration: logicstrand_marvean
// ============================================================================

if (!function_exists('env')) {
    function env($key, $default = null) {
        static $env = null;
        if ($env === null) {
            $env = [];
            $envPath = dirname(__DIR__) . '/.env';
            if (file_exists($envPath)) {
                $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
                foreach ($lines as $line) {
                    $line = trim($line);
                    if (empty($line) || str_starts_with($line, '#')) continue;
                    if (str_contains($line, '=')) {
                        list($k, $v) = explode('=', $line, 2);
                        $k = trim($k);
                        $v = trim($v, " \t\n\r\0\x0B\"'");
                        $env[$k] = $v;
                    }
                }
            }
        }
        return $env[$key] ?? getenv($key) ?: $default;
    }
}

return [
    'driver'    => env('DB_CONNECTION', 'mysql'),
    'host'      => env('DB_HOST', '127.0.0.1'),
    'port'      => env('DB_PORT', '3306'),
    'database'  => env('DB_DATABASE', 'logicstrand_marvean'),
    'username'  => env('DB_USERNAME', 'logicstrand_marvean'),
    'password'  => env('DB_PASSWORD', 'ph##$sEP=&6Q*52J'),
    'charset'   => 'utf8mb4',
    'collation' => 'utf8mb4_unicode_ci',
    'options'   => [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ],
];
