<?php
// ============================================================================
// MARVEAN Backend - Front Controller & Routing Gateway
// ============================================================================

declare(strict_types=1);

// Built-in PHP web server static file bypass
if (php_sapi_name() === 'cli-server') {
    $path = parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH) ?? '';
    $filePath = __DIR__ . $path;
    if ($path !== '/' && file_exists($filePath) && !is_dir($filePath)) {
        return false;
    }
}

error_reporting(E_ALL);
ini_set('display_errors', '1');

// Autoloader
spl_autoload_register(function (string $class) {
    $prefix = 'App\\';
    $baseDir = dirname(__DIR__) . '/app/';

    $len = strlen($prefix);
    if (strncmp($prefix, $class, $len) !== 0) {
        return;
    }

    $relativeClass = substr($class, $len);
    $file = $baseDir . str_replace('\\', '/', $relativeClass) . '.php';

    if (file_exists($file)) {
        require $file;
    }
});

use App\Core\Router;
use App\Controllers\AuthController;
use App\Controllers\DashboardController;
use App\Controllers\CompetitorController;
use App\Controllers\MarketRecordController;
use App\Controllers\ProductComparisonController;
use App\Controllers\SignalTrackingController;
use App\Controllers\EvidenceInsightController;
use App\Controllers\UserController;

$router = new Router();

// --- Authentication Routes ---
$router->get('/login', [AuthController::class, 'showLogin']);
$router->post('/login', [AuthController::class, 'login']);
$router->get('/register', [AuthController::class, 'showRegister']);
$router->post('/register', [AuthController::class, 'register']);
$router->get('/logout', [AuthController::class, 'logout']);
$router->post('/logout', [AuthController::class, 'logout']);

// --- Dashboard Root ---
$router->get('/', [DashboardController::class, 'index'], ['AuthMiddleware']);
$router->get('/dashboard', [DashboardController::class, 'index'], ['AuthMiddleware']);

// --- 3.1 Competitor Management ---
$router->get('/competitors', [CompetitorController::class, 'index'], ['AuthMiddleware']);
$router->get('/competitors/create', [CompetitorController::class, 'create'], ['AuthMiddleware']);
$router->post('/competitors', [CompetitorController::class, 'store'], ['AuthMiddleware']);
$router->get('/competitors/{id}', [CompetitorController::class, 'show'], ['AuthMiddleware']);
$router->get('/competitors/{id}/edit', [CompetitorController::class, 'edit'], ['AuthMiddleware']);
$router->post('/competitors/{id}', [CompetitorController::class, 'update'], ['AuthMiddleware']);
$router->post('/competitors/{id}/updates', [CompetitorController::class, 'addUpdate'], ['AuthMiddleware']);
$router->post('/competitors/{id}/delete', [CompetitorController::class, 'delete'], ['AuthMiddleware']);

// --- 3.2 Market Records ---
$router->get('/market-records', [MarketRecordController::class, 'index'], ['AuthMiddleware']);
$router->get('/market-records/create', [MarketRecordController::class, 'create'], ['AuthMiddleware']);
$router->post('/market-records', [MarketRecordController::class, 'store'], ['AuthMiddleware']);
$router->get('/market-records/{id}', [MarketRecordController::class, 'show'], ['AuthMiddleware']);
$router->get('/market-records/{id}/edit', [MarketRecordController::class, 'edit'], ['AuthMiddleware']);
$router->post('/market-records/{id}', [MarketRecordController::class, 'update'], ['AuthMiddleware']);
$router->post('/market-records/{id}/sources', [MarketRecordController::class, 'addSource'], ['AuthMiddleware']);
$router->post('/market-records/{id}/delete', [MarketRecordController::class, 'delete'], ['AuthMiddleware']);

// --- 3.3 Product Comparisons ---
$router->get('/product-comparisons', [ProductComparisonController::class, 'index'], ['AuthMiddleware']);
$router->get('/product-comparisons/create', [ProductComparisonController::class, 'create'], ['AuthMiddleware']);
$router->post('/product-comparisons', [ProductComparisonController::class, 'store'], ['AuthMiddleware']);
$router->get('/product-comparisons/{id}', [ProductComparisonController::class, 'show'], ['AuthMiddleware']);
$router->get('/product-comparisons/{id}/edit', [ProductComparisonController::class, 'edit'], ['AuthMiddleware']);
$router->post('/product-comparisons/{id}', [ProductComparisonController::class, 'update'], ['AuthMiddleware']);
$router->post('/product-comparisons/{id}/attributes', [ProductComparisonController::class, 'addAttribute'], ['AuthMiddleware']);
$router->post('/product-comparisons/{id}/attributes/{attrId}/delete', [ProductComparisonController::class, 'deleteAttribute'], ['AuthMiddleware']);
$router->post('/product-comparisons/{id}/delete', [ProductComparisonController::class, 'delete'], ['AuthMiddleware']);
$router->post('/products', [ProductComparisonController::class, 'storeProduct'], ['AuthMiddleware']);

// --- 3.4 Signal Tracking ---
$router->get('/signals', [SignalTrackingController::class, 'index'], ['AuthMiddleware']);
$router->get('/signals/create', [SignalTrackingController::class, 'create'], ['AuthMiddleware']);
$router->post('/signals', [SignalTrackingController::class, 'store'], ['AuthMiddleware']);
$router->get('/signals/{id}', [SignalTrackingController::class, 'show'], ['AuthMiddleware']);
$router->get('/signals/{id}/edit', [SignalTrackingController::class, 'edit'], ['AuthMiddleware']);
$router->post('/signals/{id}', [SignalTrackingController::class, 'update'], ['AuthMiddleware']);
$router->post('/signals/{id}/status', [SignalTrackingController::class, 'changeStatus'], ['AuthMiddleware']);
$router->post('/signals/{id}/delete', [SignalTrackingController::class, 'delete'], ['AuthMiddleware']);

// --- 3.5 Evidence & Strategic Insights ---
$router->get('/evidence', [EvidenceInsightController::class, 'index'], ['AuthMiddleware']);
$router->get('/evidence/create', [EvidenceInsightController::class, 'createEvidence'], ['AuthMiddleware']);
$router->post('/evidence', [EvidenceInsightController::class, 'storeEvidence'], ['AuthMiddleware']);
$router->get('/evidence/{id}', [EvidenceInsightController::class, 'showEvidence'], ['AuthMiddleware']);
$router->post('/evidence/{id}/delete', [EvidenceInsightController::class, 'deleteEvidence'], ['AuthMiddleware']);
$router->post('/insights', [EvidenceInsightController::class, 'storeInsight'], ['AuthMiddleware']);
$router->post('/insights/{id}/delete', [EvidenceInsightController::class, 'deleteInsight'], ['AuthMiddleware']);

// --- User Management (Admin Only) ---
$router->get('/users', [UserController::class, 'index'], ['AuthMiddleware', 'AdminMiddleware']);
$router->get('/users/create', [UserController::class, 'create'], ['AuthMiddleware', 'AdminMiddleware']);
$router->post('/users', [UserController::class, 'store'], ['AuthMiddleware', 'AdminMiddleware']);
$router->get('/users/{id}/edit', [UserController::class, 'edit'], ['AuthMiddleware', 'AdminMiddleware']);
$router->post('/users/{id}', [UserController::class, 'update'], ['AuthMiddleware', 'AdminMiddleware']);
$router->post('/users/{id}/delete', [UserController::class, 'delete'], ['AuthMiddleware', 'AdminMiddleware']);

// --- REST JSON API Routes (For Dashboard & External Integrations) ---
use App\Controllers\ApiController;

$router->get('/api/status', [ApiController::class, 'status']);
$router->get('/api/stats', [ApiController::class, 'stats']);

// 3.1 Competitors API
$router->get('/api/competitors', [ApiController::class, 'getCompetitors']);
$router->post('/api/competitors', [ApiController::class, 'storeCompetitor']);
$router->get('/api/competitors/{id}/updates', [ApiController::class, 'getCompetitorUpdates']);
$router->post('/api/competitors/{id}/updates', [ApiController::class, 'storeCompetitorUpdate']);

// 3.2 Market Records API
$router->get('/api/market-records', [ApiController::class, 'getMarketRecords']);
$router->post('/api/market-records', [ApiController::class, 'storeMarketRecord']);
$router->post('/api/market-records/{id}/sources', [ApiController::class, 'storeMarketSource']);

// 3.3 Product Comparisons API
$router->get('/api/product-comparisons', [ApiController::class, 'getProductComparisons']);
$router->post('/api/product-comparisons', [ApiController::class, 'storeProductComparison']);
$router->post('/api/product-comparisons/{id}/attributes', [ApiController::class, 'storeProductAttribute']);

// 3.4 Signal Tracking API
$router->get('/api/signals', [ApiController::class, 'getSignals']);
$router->post('/api/signals', [ApiController::class, 'storeSignal']);
$router->post('/api/signals/{id}/status', [ApiController::class, 'changeSignalStatus']);

// 3.5 Evidence & Strategic Insights API
$router->get('/api/evidence', [ApiController::class, 'getEvidence']);
$router->post('/api/evidence', [ApiController::class, 'storeEvidence']);
$router->post('/api/insights', [ApiController::class, 'storeInsight']);

// Dispatch
$router->dispatch();

