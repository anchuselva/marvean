<?php
// ============================================================================
// Application Configuration
// ============================================================================

require_once __DIR__ . '/database.php'; // ensure env() helper is available

return [
    'name'     => env('APP_NAME', 'MARVEAN Intelligence Engine'),
    'env'      => env('APP_ENV', 'local'),
    'debug'    => env('APP_DEBUG', true),
    'url'      => env('APP_URL', 'http://localhost:8000'),
    'timezone' => 'UTC',
];
