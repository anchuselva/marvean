<?php

namespace App\Controllers;

use App\Core\Database;
use App\Core\View;
use App\Models\Competitor;
use App\Models\MarketRecord;
use App\Models\ProductComparison;
use App\Models\MarketSignal;
use App\Models\EvidenceItem;
use App\Models\StrategicInsight;
use App\Models\ActivityLog;

class ApiController {

    private function cors(): void {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
        if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
            http_response_code(200);
            exit;
        }
    }

    private function getJsonInput(): array {
        $raw = file_get_contents('php://input');
        if (!empty($raw)) {
            $json = json_decode($raw, true);
            if (is_array($json)) return $json;
        }
        return $_POST;
    }

    // Health & System Status
    public function status(): void {
        $this->cors();
        $dbConnected = false;
        try {
            Database::getConnection();
            $dbConnected = true;
        } catch (\Throwable $e) {}

        View::json([
            'status'     => 'online',
            'database'   => $dbConnected ? 'connected' : 'disconnected',
            'version'    => '3.1.0',
            'platform'   => 'MARVEAN AI Market & Competitive Intelligence',
            'timestamp'  => date('c')
        ]);
    }

    // Aggregated Dashboard Stats
    public function stats(): void {
        $this->cors();
        try {
            $stats = [
                'competitors_count' => Database::fetchValue("SELECT COUNT(*) FROM `competitors`") ?? 0,
                'signals_count'     => Database::fetchValue("SELECT COUNT(*) FROM `market_signals`") ?? 0,
                'critical_signals'  => Database::fetchValue("SELECT COUNT(*) FROM `market_signals` WHERE `severity` = 'Critical'") ?? 0,
                'market_records'    => Database::fetchValue("SELECT COUNT(*) FROM `market_records`") ?? 0,
                'comparisons_count' => Database::fetchValue("SELECT COUNT(*) FROM `product_comparisons`") ?? 0,
                'evidence_count'    => Database::fetchValue("SELECT COUNT(*) FROM `evidence_items`") ?? 0,
                'insights_count'    => Database::fetchValue("SELECT COUNT(*) FROM `strategic_insights`") ?? 0
            ];
            View::json(['success' => true, 'data' => $stats]);
        } catch (\Throwable $e) {
            View::json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    // 3.1 Competitor Management
    public function getCompetitors(): void {
        $this->cors();
        try {
            $category = $_GET['category'] ?? null;
            $tier = $_GET['tier'] ?? null;
            $search = $_GET['search'] ?? null;
            $competitors = Competitor::all($category, $tier, $search);
            View::json(['success' => true, 'data' => $competitors]);
        } catch (\Throwable $e) {
            View::json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    public function storeCompetitor(): void {
        $this->cors();
        $input = $this->getJsonInput();
        if (empty($input['name'])) {
            View::json(['success' => false, 'error' => 'Name is required'], 400);
            return;
        }

        try {
            $data = [
                'name'         => trim($input['name']),
                'ticker'       => !empty($input['ticker']) ? strtoupper(trim($input['ticker'])) : null,
                'tier'         => $input['tier'] ?? 'Tier-1 Direct',
                'category'     => $input['category'] ?? 'Enterprise Commerce Intelligence',
                'website'      => $input['website'] ?? null,
                'market_cap'   => $input['market_cap'] ?? null,
                'headquarters' => $input['headquarters'] ?? null,
                'threat_level' => $input['threat_level'] ?? 'High',
                'status'       => $input['status'] ?? 'Active Tracking',
                'overview'     => $input['overview'] ?? 'Monitored competitor profile.'
            ];
            $id = Competitor::create($data, 1);
            $competitor = Competitor::find($id);
            View::json(['success' => true, 'data' => $competitor, 'message' => 'Competitor created successfully']);
        } catch (\Throwable $e) {
            View::json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    public function getCompetitorUpdates(string $id): void {
        $this->cors();
        try {
            $updates = Competitor::updates((int)$id);
            View::json(['success' => true, 'data' => $updates]);
        } catch (\Throwable $e) {
            View::json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    public function storeCompetitorUpdate(string $id): void {
        $this->cors();
        $input = $this->getJsonInput();
        if (empty($input['summary'])) {
            View::json(['success' => false, 'error' => 'Update summary is required'], 400);
            return;
        }

        try {
            Competitor::addUpdate(
                (int)$id,
                $input['update_type'] ?? 'General Update',
                $input['change_field'] ?? 'Profile Attributes',
                $input['summary'],
                1
            );
            View::json(['success' => true, 'message' => 'Profile update recorded successfully']);
        } catch (\Throwable $e) {
            View::json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    // 3.2 Market Records
    public function getMarketRecords(): void {
        $this->cors();
        try {
            $industry = $_GET['industry'] ?? null;
            $classification = $_GET['classification'] ?? null;
            $search = $_GET['search'] ?? null;
            $records = MarketRecord::all($industry, $classification, $search);
            
            // Enrich with sources and history count
            foreach ($records as &$rec) {
                $rec['sources'] = MarketRecord::sources((int)$rec['id']);
                $rec['history'] = MarketRecord::history((int)$rec['id']);
            }
            View::json(['success' => true, 'data' => $records]);
        } catch (\Throwable $e) {
            View::json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    public function storeMarketRecord(): void {
        $this->cors();
        $input = $this->getJsonInput();
        if (empty($input['title'])) {
            View::json(['success' => false, 'error' => 'Title is required'], 400);
            return;
        }

        try {
            $data = [
                'title'             => trim($input['title']),
                'industry'          => $input['industry'] ?? 'Enterprise SaaS & Commerce',
                'confidence_score'  => (float)($input['confidence_score'] ?? 99.0),
                'classification'    => $input['classification'] ?? 'Industry Benchmark',
                'executive_summary' => $input['executive_summary'] ?? '',
                'deep_analysis'     => $input['deep_analysis'] ?? '',
                'status'            => $input['status'] ?? 'Published'
            ];
            $id = MarketRecord::create($data, [], 1);
            $record = MarketRecord::find($id);
            View::json(['success' => true, 'data' => $record, 'message' => 'Market record published']);
        } catch (\Throwable $e) {
            View::json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    public function storeMarketSource(string $id): void {
        $this->cors();
        $input = $this->getJsonInput();
        if (empty($input['source_name'])) {
            View::json(['success' => false, 'error' => 'Source name is required'], 400);
            return;
        }

        try {
            MarketRecord::addSource(
                (int)$id,
                trim($input['source_name']),
                $input['source_type'] ?? 'Regulatory Filing',
                $input['source_url'] ?? null,
                $input['citation_key'] ?? null,
                $input['verification_date'] ?? date('Y-m-d')
            );
            View::json(['success' => true, 'message' => 'Source associated successfully']);
        } catch (\Throwable $e) {
            View::json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    // 3.3 Product Comparisons
    public function getProductComparisons(): void {
        $this->cors();
        try {
            $comparisons = ProductComparison::all();
            foreach ($comparisons as &$comp) {
                $comp['attributes'] = ProductComparison::attributes((int)$comp['id']);
                $comp['history'] = ProductComparison::history((int)$comp['id']);
            }
            View::json(['success' => true, 'data' => $comparisons]);
        } catch (\Throwable $e) {
            View::json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    public function storeProductComparison(): void {
        $this->cors();
        $input = $this->getJsonInput();
        if (empty($input['title'])) {
            View::json(['success' => false, 'error' => 'Comparison title is required'], 400);
            return;
        }

        try {
            $data = [
                'title'             => trim($input['title']),
                'target_product_id' => !empty($input['target_product_id']) ? (int)$input['target_product_id'] : null,
                'category'          => $input['category'] ?? 'Competitive Benchmark',
                'status'            => $input['status'] ?? 'Active Brief',
                'notes'             => $input['notes'] ?? ''
            ];
            $id = ProductComparison::create($data, [], 1);
            $comp = ProductComparison::find($id);
            View::json(['success' => true, 'data' => $comp, 'message' => 'Product shootout created']);
        } catch (\Throwable $e) {
            View::json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    public function storeProductAttribute(string $id): void {
        $this->cors();
        $input = $this->getJsonInput();
        if (empty($input['attribute_name'])) {
            View::json(['success' => false, 'error' => 'Attribute name is required'], 400);
            return;
        }

        try {
            ProductComparison::addAttribute(
                (int)$id,
                trim($input['attribute_name']),
                $input['marvean_metric'] ?? 'Advanced capability',
                $input['competitor_metric'] ?? 'Standard metric',
                $input['advantage'] ?? 'Marvean',
                $input['audit_note'] ?? null,
                1
            );
            View::json(['success' => true, 'message' => 'Attribute added to shootout']);
        } catch (\Throwable $e) {
            View::json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    // 3.4 Signal Tracking
    public function getSignals(): void {
        $this->cors();
        try {
            $severity = $_GET['severity'] ?? null;
            $status = $_GET['status'] ?? null;
            $search = $_GET['search'] ?? null;
            $signals = MarketSignal::all($severity, $status, $search);
            foreach ($signals as &$sig) {
                $sig['history'] = MarketSignal::history((int)$sig['id']);
            }
            View::json(['success' => true, 'data' => $signals]);
        } catch (\Throwable $e) {
            View::json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    public function storeSignal(): void {
        $this->cors();
        $input = $this->getJsonInput();
        if (empty($input['title'])) {
            View::json(['success' => false, 'error' => 'Signal title is required'], 400);
            return;
        }

        try {
            $data = [
                'competitor_id' => !empty($input['competitor_id']) ? (int)$input['competitor_id'] : null,
                'title'         => trim($input['title']),
                'category'      => $input['category'] ?? 'Pricing Shift',
                'severity'      => $input['severity'] ?? 'Medium',
                'status'        => $input['status'] ?? 'Active Alert',
                'shift_latency' => $input['shift_latency'] ?? '< 15m',
                'confidence'    => (float)($input['confidence'] ?? 99.4),
                'details'       => $input['details'] ?? 'Telemetry alert ingested.',
                'source_tag'    => $input['source_tag'] ?? 'Direct Telemetry'
            ];
            $id = MarketSignal::create($data, 1);
            $sig = MarketSignal::find($id);
            View::json(['success' => true, 'data' => $sig, 'message' => 'Signal ingested']);
        } catch (\Throwable $e) {
            View::json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    public function changeSignalStatus(string $id): void {
        $this->cors();
        $input = $this->getJsonInput();
        if (empty($input['status'])) {
            View::json(['success' => false, 'error' => 'Status is required'], 400);
            return;
        }

        try {
            MarketSignal::changeStatus((int)$id, $input['status'], $input['notes'] ?? 'Status updated via API', 1);
            View::json(['success' => true, 'message' => 'Signal status updated']);
        } catch (\Throwable $e) {
            View::json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    // 3.5 Evidence & Strategic Insights
    public function getEvidence(): void {
        $this->cors();
        try {
            $evidence = EvidenceItem::all();
            $insights = StrategicInsight::all();
            $activity = ActivityLog::recent(50);
            View::json([
                'success'  => true,
                'evidence' => $evidence,
                'insights' => $insights,
                'activity' => $activity
            ]);
        } catch (\Throwable $e) {
            View::json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    public function storeEvidence(): void {
        $this->cors();
        $input = $this->getJsonInput();
        if (empty($input['title'])) {
            View::json(['success' => false, 'error' => 'Title is required'], 400);
            return;
        }

        try {
            $data = [
                'title'              => trim($input['title']),
                'evidence_type'      => $input['evidence_type'] ?? 'SEC Filing (10-K/10-Q)',
                'document_reference' => $input['document_reference'] ?? ('DOC-' . strtoupper(bin2hex(random_bytes(4)))),
                'verification_hash'  => !empty($input['verification_hash']) ? $input['verification_hash'] : ('sha256:' . hash('sha256', $input['title'] . time())),
                'verified_at'        => $input['verified_at'] ?? date('Y-m-d H:i:s'),
                'summary'            => $input['summary'] ?? 'Evidence item verification.'
            ];
            $id = EvidenceItem::create($data, 1);
            $item = EvidenceItem::find($id);
            View::json(['success' => true, 'data' => $item, 'message' => 'Evidence deposited']);
        } catch (\Throwable $e) {
            View::json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    public function storeInsight(): void {
        $this->cors();
        $input = $this->getJsonInput();
        if (empty($input['title'])) {
            View::json(['success' => false, 'error' => 'Title is required'], 400);
            return;
        }

        try {
            $data = [
                'competitor_id'     => !empty($input['competitor_id']) ? (int)$input['competitor_id'] : null,
                'evidence_id'       => !empty($input['evidence_id']) ? (int)$input['evidence_id'] : null,
                'title'             => trim($input['title']),
                'recommendation'    => $input['recommendation'] ?? '',
                'strategic_horizon' => $input['strategic_horizon'] ?? 'Tactical (1-6mo)',
                'impact_rating'     => $input['impact_rating'] ?? 'High Impact',
                'status'            => $input['status'] ?? 'Active Brief'
            ];
            $id = StrategicInsight::create($data, 1);
            $insight = StrategicInsight::find($id);
            View::json(['success' => true, 'data' => $insight, 'message' => 'Strategic insight recorded']);
        } catch (\Throwable $e) {
            View::json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }
}
