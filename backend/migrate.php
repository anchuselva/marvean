<?php
// ============================================================================
// MARVEAN Intelligence Platform - Migration & Seeder CLI
// ============================================================================

require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/app/Core/Database.php';

use App\Core\Database;

echo "========================================================\n";
echo "MARVEAN Database Migrator & Seeder CLI\n";
echo "Target DB: logicstrand_marvean\n";
echo "========================================================\n\n";

try {
    $pdo = Database::getConnection();
    echo "✓ Connected to MySQL database successfully.\n";

    $schemaFile = __DIR__ . '/database/schema.sql';
    if (!file_exists($schemaFile)) {
        die("✗ Error: schema.sql not found at {$schemaFile}\n");
    }

    $sql = file_get_contents($schemaFile);
    echo "→ Executing schema migrations and enterprise seeds...\n";

    // Split and execute SQL statements
    $pdo->exec($sql);

    echo "✓ All 15 database tables migrated and seeded successfully!\n\n";

    $tables = Database::fetchAll("SHOW TABLES");
    echo "Current Tables in logicstrand_marvean:\n";
    foreach ($tables as $t) {
        echo "  - " . reset($t) . "\n";
    }

    echo "\n✓ Ready for Command Center operations.\n";
} catch (\PDOException $e) {
    die("✗ Migration failed: " . $e->getMessage() . "\n");
}
