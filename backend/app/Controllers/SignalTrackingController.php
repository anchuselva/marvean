<?php

namespace App\Controllers;

use App\Core\Auth;
use App\Core\View;
use App\Core\Validator;
use App\Models\MarketSignal;
use App\Models\Competitor;

class SignalTrackingController {
    public function index(): void {
        $category = $_GET['category'] ?? null;
        $severity = $_GET['severity'] ?? null;
        $status = $_GET['status'] ?? null;
        $competitorId = !empty($_GET['competitor_id']) ? (int)$_GET['competitor_id'] : null;
        $search = $_GET['search'] ?? null;

        $signals = MarketSignal::all($category, $severity, $status, $competitorId, $search);
        $competitors = Competitor::all();

        View::render('signals/index', [
            'title'        => 'SIGNAL TRACKING // Real-Time Radar',
            'signals'      => $signals,
            'competitors'  => $competitors,
            'category'     => $category,
            'severity'     => $severity,
            'status'       => $status,
            'competitorId' => $competitorId,
            'search'       => $search,
            'activeNav'    => 'signals'
        ]);
    }

    public function show(string $id): void {
        $signal = MarketSignal::find((int)$id);
        if (!$signal) {
            View::setFlash('error', 'Market signal alert not found.');
            View::redirect('/signals');
        }

        $history = MarketSignal::history((int)$id);

        View::render('signals/show', [
            'title'     => "Signal #{$id}: {$signal['title']}",
            'signal'    => $signal,
            'history'   => $history,
            'activeNav' => 'signals'
        ]);
    }

    public function create(): void {
        $competitors = Competitor::all();

        View::render('signals/create', [
            'title'       => 'Ingest Market Signal // Manual Entry',
            'competitors' => $competitors,
            'activeNav'   => 'signals'
        ]);
    }

    public function store(): void {
        if (!View::verifyCsrf()) {
            View::setFlash('error', 'Security token expired.');
            View::redirect('/signals/create');
        }

        $validator = Validator::make($_POST, [
            'title'         => 'required|min:5|max:255',
            'category'      => 'required|in:Pricing Shift,Product Launch,Patent Filing,Executive Move,M&A / Partnership,Regulatory Action',
            'severity'      => 'required|in:Critical,High,Medium,Low',
            'shift_latency' => 'required',
            'details'       => 'required|min:10'
        ]);

        if ($validator->fails()) {
            View::setFlash('error', $validator->firstError());
            View::redirect('/signals/create');
        }

        $id = MarketSignal::create([
            'competitor_id' => !empty($_POST['competitor_id']) ? (int)$_POST['competitor_id'] : null,
            'title'         => trim($_POST['title']),
            'category'      => $_POST['category'],
            'severity'      => $_POST['severity'],
            'status'        => $_POST['status'] ?? 'Active Alert',
            'shift_latency' => trim($_POST['shift_latency']),
            'confidence'    => !empty($_POST['confidence']) ? (float)$_POST['confidence'] : 99.4,
            'details'       => trim($_POST['details']),
            'source_tag'    => trim($_POST['source_tag'] ?? 'Direct Telemetry Scrape')
        ], Auth::id());

        View::setFlash('success', "Market signal #{$id} ingested into real-time radar stream.");
        View::redirect("/signals/{$id}");
    }

    public function edit(string $id): void {
        $signal = MarketSignal::find((int)$id);
        if (!$signal) {
            View::setFlash('error', 'Signal not found.');
            View::redirect('/signals');
        }

        $competitors = Competitor::all();

        View::render('signals/edit', [
            'title'       => "Edit Signal #{$id}",
            'signal'      => $signal,
            'competitors' => $competitors,
            'activeNav'   => 'signals'
        ]);
    }

    public function update(string $id): void {
        if (!View::verifyCsrf()) {
            View::setFlash('error', 'Security token expired.');
            View::redirect("/signals/{$id}/edit");
        }

        $validator = Validator::make($_POST, [
            'title'         => 'required|min:5|max:255',
            'category'      => 'required|in:Pricing Shift,Product Launch,Patent Filing,Executive Move,M&A / Partnership,Regulatory Action',
            'severity'      => 'required|in:Critical,High,Medium,Low',
            'shift_latency' => 'required',
            'details'       => 'required|min:10'
        ]);

        if ($validator->fails()) {
            View::setFlash('error', $validator->firstError());
            View::redirect("/signals/{$id}/edit");
        }

        MarketSignal::update((int)$id, [
            'competitor_id' => !empty($_POST['competitor_id']) ? (int)$_POST['competitor_id'] : null,
            'title'         => trim($_POST['title']),
            'category'      => $_POST['category'],
            'severity'      => $_POST['severity'],
            'status'        => $_POST['status'] ?? 'Active Alert',
            'shift_latency' => trim($_POST['shift_latency']),
            'confidence'    => !empty($_POST['confidence']) ? (float)$_POST['confidence'] : 99.4,
            'details'       => trim($_POST['details']),
            'source_tag'    => trim($_POST['source_tag'] ?? 'Direct Telemetry Scrape')
        ], Auth::id());

        View::setFlash('success', 'Market signal updated.');
        View::redirect("/signals/{$id}");
    }

    public function changeStatus(string $id): void {
        if (!View::verifyCsrf()) {
            View::setFlash('error', 'Security token expired.');
            View::redirect("/signals/{$id}");
        }

        $newStatus = $_POST['status'] ?? '';
        $notes = trim($_POST['notes'] ?? '');

        if (!in_array($newStatus, ['Active Alert', 'Under Review', 'Verified', 'Archived'])) {
            View::setFlash('error', 'Invalid status selection.');
            View::redirect("/signals/{$id}");
        }

        MarketSignal::updateStatus((int)$id, $newStatus, $notes, Auth::id());
        View::setFlash('success', "Signal #{$id} status updated to [{$newStatus}].");
        View::redirect("/signals/{$id}");
    }

    public function delete(string $id): void {
        if (!View::verifyCsrf()) {
            View::setFlash('error', 'Security token expired.');
            View::redirect('/signals');
        }

        MarketSignal::delete((int)$id, Auth::id());
        View::setFlash('success', 'Market signal archived and removed from stream.');
        View::redirect('/signals');
    }
}
