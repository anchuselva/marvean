<?php

namespace App\Controllers;

use App\Core\Auth;
use App\Core\View;
use App\Core\Validator;
use App\Models\EvidenceItem;
use App\Models\StrategicInsight;
use App\Models\Competitor;
use App\Models\ActivityLog;

class EvidenceInsightController {
    public function index(): void {
        $evidence = EvidenceItem::all();
        $insights = StrategicInsight::all();
        $competitors = Competitor::all();
        $recentActivity = ActivityLog::recent(15);

        View::render('evidence/index', [
            'title'          => 'EVIDENCE & STRATEGIC INSIGHTS // Intelligence Governance',
            'evidence'       => $evidence,
            'insights'       => $insights,
            'competitors'    => $competitors,
            'recentActivity' => $recentActivity,
            'activeNav'      => 'evidence'
        ]);
    }

    public function showEvidence(string $id): void {
        $item = EvidenceItem::find((int)$id);
        if (!$item) {
            View::setFlash('error', 'Evidence item not found.');
            View::redirect('/evidence');
        }

        $insights = EvidenceItem::insights((int)$id);
        $activity = ActivityLog::forEntity('EvidenceItem', (int)$id);

        View::render('evidence/show_evidence', [
            'title'     => "Evidence // {$item['document_reference']}",
            'evidence'  => $item,
            'insights'  => $insights,
            'activity'  => $activity,
            'activeNav' => 'evidence'
        ]);
    }

    public function createEvidence(): void {
        View::render('evidence/create_evidence', [
            'title'     => 'Deposit Audited Evidence // Evidence Locker',
            'activeNav' => 'evidence'
        ]);
    }

    public function storeEvidence(): void {
        if (!View::verifyCsrf()) {
            View::setFlash('error', 'Security token expired.');
            View::redirect('/evidence/create');
        }

        $validator = Validator::make($_POST, [
            'title'              => 'required|min:5|max:255',
            'evidence_type'      => 'required|in:SEC Filing (10-K/10-Q),Patent Registry Audit,Direct Pricing Audit,Antitrust / Legal Record,Earnings Telemetry Transcript',
            'document_reference' => 'required|max:200',
            'summary'            => 'required|min:10'
        ]);

        if ($validator->fails()) {
            View::setFlash('error', $validator->firstError());
            View::redirect('/evidence/create');
        }

        $id = EvidenceItem::create([
            'title'              => trim($_POST['title']),
            'evidence_type'      => $_POST['evidence_type'],
            'document_reference' => trim($_POST['document_reference']),
            'verification_hash'  => !empty($_POST['verification_hash']) ? trim($_POST['verification_hash']) : hash('sha256', $_POST['title'] . time()),
            'verified_at'        => date('Y-m-d H:i:s'),
            'summary'            => trim($_POST['summary'])
        ], Auth::id());

        View::setFlash('success', "Evidence document deposited with cryptographic verification hash.");
        View::redirect("/evidence/{$id}");
    }

    public function deleteEvidence(string $id): void {
        if (!View::verifyCsrf()) {
            View::setFlash('error', 'Security token expired.');
            View::redirect('/evidence');
        }

        EvidenceItem::delete((int)$id, Auth::id());
        View::setFlash('success', 'Evidence record removed from vault.');
        View::redirect('/evidence');
    }

    public function storeInsight(): void {
        if (!View::verifyCsrf()) {
            View::setFlash('error', 'Security token expired.');
            View::redirect('/evidence');
        }

        $validator = Validator::make($_POST, [
            'title'             => 'required|min:5|max:255',
            'recommendation'    => 'required|min:10',
            'strategic_horizon' => 'required|in:Immediate (0-30d),Tactical (1-6mo),Strategic (6-18mo)',
            'impact_rating'     => 'required|in:Critical Advantage,High Impact,Moderate Impact,Observation Only'
        ]);

        if ($validator->fails()) {
            View::setFlash('error', $validator->firstError());
            View::redirect('/evidence');
        }

        $id = StrategicInsight::create([
            'competitor_id'     => !empty($_POST['competitor_id']) ? (int)$_POST['competitor_id'] : null,
            'evidence_id'       => !empty($_POST['evidence_id']) ? (int)$_POST['evidence_id'] : null,
            'title'             => trim($_POST['title']),
            'recommendation'    => trim($_POST['recommendation']),
            'strategic_horizon' => $_POST['strategic_horizon'],
            'impact_rating'     => $_POST['impact_rating'],
            'status'            => $_POST['status'] ?? 'Active Brief'
        ], Auth::id());

        View::setFlash('success', 'Strategic insight dossier formulated.');
        View::redirect('/evidence');
    }

    public function deleteInsight(string $id): void {
        if (!View::verifyCsrf()) {
            View::setFlash('error', 'Security token expired.');
            View::redirect('/evidence');
        }

        StrategicInsight::delete((int)$id, Auth::id());
        View::setFlash('success', 'Strategic insight archived.');
        View::redirect('/evidence');
    }
}
