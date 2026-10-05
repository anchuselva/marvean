<?php

namespace App\Controllers;

use App\Core\Auth;
use App\Core\View;
use App\Core\Validator;
use App\Models\MarketRecord;

class MarketRecordController {
    public function index(): void {
        $industry = $_GET['industry'] ?? null;
        $classification = $_GET['classification'] ?? null;
        $search = $_GET['search'] ?? null;

        $records = MarketRecord::all($industry, $classification, $search);

        View::render('market_records/index', [
            'title'          => 'MARKET INTELLIGENCE // Authoritative Records',
            'records'        => $records,
            'industry'       => $industry,
            'classification' => $classification,
            'search'         => $search,
            'activeNav'      => 'market_records'
        ]);
    }

    public function show(string $id): void {
        $record = MarketRecord::find((int)$id);
        if (!$record) {
            View::setFlash('error', 'Market record not found.');
            View::redirect('/market-records');
        }

        $sources = MarketRecord::sources((int)$id);
        $history = MarketRecord::history((int)$id);

        View::render('market_records/show', [
            'title'     => "{$record['title']} // Intelligence Record",
            'record'    => $record,
            'sources'   => $sources,
            'history'   => $history,
            'activeNav' => 'market_records'
        ]);
    }

    public function create(): void {
        View::render('market_records/create', [
            'title'     => 'Create Market Intelligence Record',
            'activeNav' => 'market_records'
        ]);
    }

    public function store(): void {
        if (!View::verifyCsrf()) {
            View::setFlash('error', 'Security token expired.');
            View::redirect('/market-records/create');
        }

        $validator = Validator::make($_POST, [
            'title'             => 'required|min:5|max:255',
            'industry'          => 'required|max:120',
            'classification'    => 'required|in:SEC Filing,Patent Registry,Direct Pricing Audit,Industry Benchmark,Earnings Call Telemetry',
            'confidence_score'  => 'required|numeric',
            'executive_summary' => 'required|min:10'
        ]);

        if ($validator->fails()) {
            View::setFlash('error', $validator->firstError());
            View::redirect('/market-records/create');
        }

        // Process sources
        $sources = [];
        if (!empty($_POST['source_name'])) {
            $sources[] = [
                'source_name'       => trim($_POST['source_name']),
                'source_type'       => trim($_POST['source_type'] ?? 'Regulatory Filing'),
                'source_url'        => trim($_POST['source_url'] ?? ''),
                'citation_key'      => trim($_POST['citation_key'] ?? ('SRC-' . rand(1000, 9999))),
                'verification_date' => date('Y-m-d')
            ];
        }

        $id = MarketRecord::create([
            'title'             => trim($_POST['title']),
            'industry'          => trim($_POST['industry']),
            'confidence_score'  => (float)$_POST['confidence_score'],
            'classification'    => $_POST['classification'],
            'executive_summary' => trim($_POST['executive_summary']),
            'deep_analysis'     => trim($_POST['deep_analysis'] ?? ''),
            'status'            => $_POST['status'] ?? 'Published'
        ], $sources, Auth::id());

        View::setFlash('success', "Market intelligence record published successfully.");
        View::redirect("/market-records/{$id}");
    }

    public function edit(string $id): void {
        $record = MarketRecord::find((int)$id);
        if (!$record) {
            View::setFlash('error', 'Market record not found.');
            View::redirect('/market-records');
        }

        $sources = MarketRecord::sources((int)$id);

        View::render('market_records/edit', [
            'title'     => "Edit Market Record: {$record['title']}",
            'record'    => $record,
            'sources'   => $sources,
            'activeNav' => 'market_records'
        ]);
    }

    public function update(string $id): void {
        if (!View::verifyCsrf()) {
            View::setFlash('error', 'Security token expired.');
            View::redirect("/market-records/{$id}/edit");
        }

        $validator = Validator::make($_POST, [
            'title'             => 'required|min:5|max:255',
            'industry'          => 'required|max:120',
            'classification'    => 'required|in:SEC Filing,Patent Registry,Direct Pricing Audit,Industry Benchmark,Earnings Call Telemetry',
            'confidence_score'  => 'required|numeric',
            'executive_summary' => 'required|min:10'
        ]);

        if ($validator->fails()) {
            View::setFlash('error', $validator->firstError());
            View::redirect("/market-records/{$id}/edit");
        }

        $newSources = [];
        if (!empty($_POST['new_source_name'])) {
            $newSources[] = [
                'source_name'  => trim($_POST['new_source_name']),
                'source_type'  => trim($_POST['new_source_type'] ?? 'Industry Citation'),
                'source_url'   => trim($_POST['new_source_url'] ?? ''),
                'citation_key' => trim($_POST['new_citation_key'] ?? ('SRC-' . rand(1000, 9999)))
            ];
        }

        $changeSummary = trim($_POST['change_summary'] ?? 'Updated intelligence synthesis and citations.');

        MarketRecord::update((int)$id, [
            'title'             => trim($_POST['title']),
            'industry'          => trim($_POST['industry']),
            'confidence_score'  => (float)$_POST['confidence_score'],
            'classification'    => $_POST['classification'],
            'executive_summary' => trim($_POST['executive_summary']),
            'deep_analysis'     => trim($_POST['deep_analysis'] ?? ''),
            'status'            => $_POST['status'] ?? 'Published'
        ], $newSources, Auth::id(), $changeSummary);

        View::setFlash('success', 'Market record updated with revision history.');
        View::redirect("/market-records/{$id}");
    }

    public function addSource(string $id): void {
        if (!View::verifyCsrf()) {
            View::setFlash('error', 'Security token expired.');
            View::redirect("/market-records/{$id}");
        }

        $name = trim($_POST['source_name'] ?? '');
        if (empty($name)) {
            View::setFlash('error', 'Source name is required.');
            View::redirect("/market-records/{$id}");
        }

        \App\Core\Database::insert('market_sources', [
            'market_record_id'  => (int)$id,
            'source_name'       => $name,
            'source_type'       => trim($_POST['source_type'] ?? 'Independent Audit'),
            'source_url'        => trim($_POST['source_url'] ?? ''),
            'citation_key'      => trim($_POST['citation_key'] ?? ('SRC-' . rand(1000, 9999))),
            'verification_date' => date('Y-m-d')
        ]);

        \App\Core\Database::logActivity(Auth::id(), 'ADD_SOURCE', 'MarketRecord', (int)$id, "Associated source: {$name}");
        View::setFlash('success', 'Source citation associated successfully.');
        View::redirect("/market-records/{$id}");
    }

    public function delete(string $id): void {
        if (!View::verifyCsrf()) {
            View::setFlash('error', 'Security token expired.');
            View::redirect('/market-records');
        }

        MarketRecord::delete((int)$id, Auth::id());
        View::setFlash('success', 'Market intelligence record removed.');
        View::redirect('/market-records');
    }
}
