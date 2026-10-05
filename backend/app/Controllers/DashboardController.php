<?php

namespace App\Controllers;

use App\Core\View;
use App\Core\Database;
use App\Models\Competitor;
use App\Models\MarketRecord;
use App\Models\ProductComparison;
use App\Models\MarketSignal;
use App\Models\EvidenceItem;
use App\Models\StrategicInsight;
use App\Models\ActivityLog;

class DashboardController {
    public function index(): void {
        $stats = [
            'competitors_count' => Competitor::count(),
            'signals_count'     => MarketSignal::count(),
            'critical_signals'  => MarketSignal::criticalCount(),
            'market_records'    => MarketRecord::count(),
            'comparisons_count' => ProductComparison::count(),
            'evidence_count'    => EvidenceItem::count(),
            'insights_count'    => StrategicInsight::count(),
        ];

        $recentSignals = MarketSignal::all(null, null, null, null, null);
        $recentSignals = array_slice($recentSignals, 0, 5);

        $recentCompetitors = Competitor::all();
        $recentCompetitors = array_slice($recentCompetitors, 0, 4);

        $recentInsights = StrategicInsight::all();
        $recentInsights = array_slice($recentInsights, 0, 3);

        $recentActivity = ActivityLog::recent(8);

        // Fetch threat distribution for competitor intelligence chart
        $threatCountsRaw = Database::fetchAll("SELECT threat_level, COUNT(*) as cnt FROM competitors GROUP BY threat_level");
        $threatCounts = ['Critical' => 0, 'High' => 0, 'Moderate' => 0, 'Low' => 0];
        foreach ($threatCountsRaw as $row) {
            $threatCounts[$row['threat_level']] = (int)$row['cnt'];
        }

        // Fetch signal severity distribution
        $signalSeverityRaw = Database::fetchAll("SELECT severity, COUNT(*) as cnt FROM market_signals GROUP BY severity");
        $signalSeverity = ['Critical' => 0, 'High' => 0, 'Medium' => 0, 'Low' => 0];
        foreach ($signalSeverityRaw as $row) {
            $signalSeverity[$row['severity']] = (int)$row['cnt'];
        }

        View::render('dashboard/index', [
            'title'             => 'COMMAND CENTER // AI Market & Competitive Intelligence',
            'stats'             => $stats,
            'recentSignals'     => $recentSignals,
            'recentCompetitors' => $recentCompetitors,
            'recentInsights'    => $recentInsights,
            'recentActivity'    => $recentActivity,
            'threatCounts'      => $threatCounts,
            'signalSeverity'    => $signalSeverity,
            'activeNav'         => 'dashboard'
        ]);
    }
}
