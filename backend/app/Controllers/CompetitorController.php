<?php

namespace App\Controllers;

use App\Core\Auth;
use App\Core\View;
use App\Core\Validator;
use App\Models\Competitor;
use App\Models\Product;

class CompetitorController {
    public function index(): void {
        $category = $_GET['category'] ?? null;
        $tier = $_GET['tier'] ?? null;
        $search = $_GET['search'] ?? null;

        $competitors = Competitor::all($category, $tier, $search);
        $categories = Competitor::categories();

        View::render('competitors/index', [
            'title'       => 'COMPETITOR REGISTRY // Profile Management',
            'competitors' => $competitors,
            'categories'  => $categories,
            'category'    => $category,
            'tier'        => $tier,
            'search'      => $search,
            'activeNav'   => 'competitors'
        ]);
    }

    public function show(string $id): void {
        $competitor = Competitor::find((int)$id);
        if (!$competitor) {
            View::setFlash('error', 'Competitor dossier not found.');
            View::redirect('/competitors');
        }

        $updates = Competitor::updates((int)$id);
        $products = Competitor::products((int)$id);
        $signals = Competitor::signals((int)$id);
        $insights = Competitor::insights((int)$id);

        View::render('competitors/show', [
            'title'      => "{$competitor['name']} // Enterprise Dossier",
            'competitor' => $competitor,
            'updates'    => $updates,
            'products'   => $products,
            'signals'    => $signals,
            'insights'   => $insights,
            'activeNav'  => 'competitors'
        ]);
    }

    public function create(): void {
        View::render('competitors/create', [
            'title'     => 'Create Competitor Profile // Registry Entry',
            'activeNav' => 'competitors'
        ]);
    }

    public function store(): void {
        if (!View::verifyCsrf()) {
            View::setFlash('error', 'Security token expired.');
            View::redirect('/competitors/create');
        }

        $validator = Validator::make($_POST, [
            'name'         => 'required|min:2|max:150',
            'category'     => 'required|max:100',
            'tier'         => 'required|in:Tier-1 Direct,Tier-2 Emerging,Indirect Threat,Strategic Partner',
            'threat_level' => 'required|in:Critical,High,Moderate,Low',
            'overview'     => 'required|min:10'
        ]);

        if ($validator->fails()) {
            View::setFlash('error', $validator->firstError());
            View::redirect('/competitors/create');
        }

        $id = Competitor::create([
            'name'         => trim($_POST['name']),
            'ticker'       => !empty($_POST['ticker']) ? strtoupper(trim($_POST['ticker'])) : null,
            'tier'         => $_POST['tier'],
            'category'     => trim($_POST['category']),
            'website'      => trim($_POST['website'] ?? ''),
            'market_cap'   => trim($_POST['market_cap'] ?? ''),
            'headquarters' => trim($_POST['headquarters'] ?? ''),
            'threat_level' => $_POST['threat_level'],
            'status'       => $_POST['status'] ?? 'Active Tracking',
            'overview'     => trim($_POST['overview'])
        ], Auth::id());

        View::setFlash('success', "Competitor profile [{$_POST['name']}] created successfully.");
        View::redirect("/competitors/{$id}");
    }

    public function edit(string $id): void {
        $competitor = Competitor::find((int)$id);
        if (!$competitor) {
            View::setFlash('error', 'Competitor dossier not found.');
            View::redirect('/competitors');
        }

        View::render('competitors/edit', [
            'title'      => "Edit Profile: {$competitor['name']}",
            'competitor' => $competitor,
            'activeNav'  => 'competitors'
        ]);
    }

    public function update(string $id): void {
        if (!View::verifyCsrf()) {
            View::setFlash('error', 'Security token expired.');
            View::redirect("/competitors/{$id}/edit");
        }

        $validator = Validator::make($_POST, [
            'name'         => 'required|min:2|max:150',
            'category'     => 'required|max:100',
            'tier'         => 'required|in:Tier-1 Direct,Tier-2 Emerging,Indirect Threat,Strategic Partner',
            'threat_level' => 'required|in:Critical,High,Moderate,Low',
            'overview'     => 'required|min:10'
        ]);

        if ($validator->fails()) {
            View::setFlash('error', $validator->firstError());
            View::redirect("/competitors/{$id}/edit");
        }

        $summary = trim($_POST['update_summary'] ?? 'Updated competitor corporate attributes and positioning.');

        Competitor::update((int)$id, [
            'name'         => trim($_POST['name']),
            'ticker'       => !empty($_POST['ticker']) ? strtoupper(trim($_POST['ticker'])) : null,
            'tier'         => $_POST['tier'],
            'category'     => trim($_POST['category']),
            'website'      => trim($_POST['website'] ?? ''),
            'market_cap'   => trim($_POST['market_cap'] ?? ''),
            'headquarters' => trim($_POST['headquarters'] ?? ''),
            'threat_level' => $_POST['threat_level'],
            'status'       => $_POST['status'] ?? 'Active Tracking',
            'overview'     => trim($_POST['overview'])
        ], Auth::id(), $summary);

        View::setFlash('success', "Competitor profile updated with audit logging.");
        View::redirect("/competitors/{$id}");
    }

    public function addUpdate(string $id): void {
        if (!View::verifyCsrf()) {
            View::setFlash('error', 'Security token expired.');
            View::redirect("/competitors/{$id}");
        }

        $summary = trim($_POST['summary'] ?? '');
        $updateType = trim($_POST['update_type'] ?? 'General Note');
        $field = trim($_POST['change_field'] ?? 'Corporate Intel');

        if (empty($summary)) {
            View::setFlash('error', 'Update note cannot be empty.');
            View::redirect("/competitors/{$id}");
        }

        \App\Core\Database::insert('competitor_updates', [
            'competitor_id' => (int)$id,
            'user_id'       => Auth::id(),
            'update_type'   => $updateType,
            'change_field'  => $field,
            'summary'       => $summary
        ]);

        \App\Core\Database::logActivity(Auth::id(), 'LOG_UPDATE', 'Competitor', (int)$id, "Logged competitor update for #{$id}: {$updateType}");

        View::setFlash('success', 'Profile update logged to historical timeline.');
        View::redirect("/competitors/{$id}");
    }

    public function delete(string $id): void {
        if (!View::verifyCsrf()) {
            View::setFlash('error', 'Security token expired.');
            View::redirect('/competitors');
        }

        Competitor::delete((int)$id, Auth::id());
        View::setFlash('success', 'Competitor dossier removed from active tracking.');
        View::redirect('/competitors');
    }
}
