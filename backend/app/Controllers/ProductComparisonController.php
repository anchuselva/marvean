<?php

namespace App\Controllers;

use App\Core\Auth;
use App\Core\View;
use App\Core\Validator;
use App\Models\ProductComparison;
use App\Models\Product;
use App\Models\Competitor;

class ProductComparisonController {
    public function index(): void {
        $comparisons = ProductComparison::all();
        $products = Product::all();
        $competitors = Competitor::all();

        View::render('product_comparisons/index', [
            'title'       => 'PRODUCT COMPARISONS // Competitive Matrices',
            'comparisons' => $comparisons,
            'products'    => $products,
            'competitors' => $competitors,
            'activeNav'   => 'product_comparisons'
        ]);
    }

    public function show(string $id): void {
        $comparison = ProductComparison::find((int)$id);
        if (!$comparison) {
            View::setFlash('error', 'Comparison matrix not found.');
            View::redirect('/product-comparisons');
        }

        $attributes = ProductComparison::attributes((int)$id);
        $history = ProductComparison::history((int)$id);

        View::render('product_comparisons/show', [
            'title'      => "{$comparison['title']} // Shootout Matrix",
            'comparison' => $comparison,
            'attributes' => $attributes,
            'history'    => $history,
            'activeNav'  => 'product_comparisons'
        ]);
    }

    public function create(): void {
        $products = Product::all();

        View::render('product_comparisons/create', [
            'title'     => 'Create Product Comparison Matrix',
            'products'  => $products,
            'activeNav' => 'product_comparisons'
        ]);
    }

    public function store(): void {
        if (!View::verifyCsrf()) {
            View::setFlash('error', 'Security token expired.');
            View::redirect('/product-comparisons/create');
        }

        $validator = Validator::make($_POST, [
            'title'    => 'required|min:5|max:200',
            'category' => 'required|max:100'
        ]);

        if ($validator->fails()) {
            View::setFlash('error', $validator->firstError());
            View::redirect('/product-comparisons/create');
        }

        $attributes = [];
        if (!empty($_POST['attribute_name'])) {
            $attributes[] = [
                'attribute_name'    => trim($_POST['attribute_name']),
                'marvean_metric'    => trim($_POST['marvean_metric'] ?? 'Real-time (< 15m)'),
                'competitor_metric' => trim($_POST['competitor_metric'] ?? 'Batch / Opaque'),
                'advantage'         => $_POST['advantage'] ?? 'Marvean',
                'audit_note'        => trim($_POST['audit_note'] ?? '')
            ];
        }

        $id = ProductComparison::create([
            'title'             => trim($_POST['title']),
            'target_product_id' => !empty($_POST['target_product_id']) ? (int)$_POST['target_product_id'] : null,
            'category'          => trim($_POST['category']),
            'status'            => $_POST['status'] ?? 'Active Brief',
            'notes'             => trim($_POST['notes'] ?? '')
        ], $attributes, Auth::id());

        View::setFlash('success', 'Product comparison matrix initialized.');
        View::redirect("/product-comparisons/{$id}");
    }

    public function edit(string $id): void {
        $comparison = ProductComparison::find((int)$id);
        if (!$comparison) {
            View::setFlash('error', 'Comparison not found.');
            View::redirect('/product-comparisons');
        }

        $products = Product::all();

        View::render('product_comparisons/edit', [
            'title'      => "Edit Comparison: {$comparison['title']}",
            'comparison' => $comparison,
            'products'   => $products,
            'activeNav'  => 'product_comparisons'
        ]);
    }

    public function update(string $id): void {
        if (!View::verifyCsrf()) {
            View::setFlash('error', 'Security token expired.');
            View::redirect("/product-comparisons/{$id}/edit");
        }

        $validator = Validator::make($_POST, [
            'title'    => 'required|min:5|max:200',
            'category' => 'required|max:100'
        ]);

        if ($validator->fails()) {
            View::setFlash('error', $validator->firstError());
            View::redirect("/product-comparisons/{$id}/edit");
        }

        $notes = trim($_POST['history_notes'] ?? 'Updated matrix header attributes.');

        ProductComparison::update((int)$id, [
            'title'             => trim($_POST['title']),
            'target_product_id' => !empty($_POST['target_product_id']) ? (int)$_POST['target_product_id'] : null,
            'category'          => trim($_POST['category']),
            'status'            => $_POST['status'] ?? 'Active Brief',
            'notes'             => trim($_POST['notes'] ?? '')
        ], Auth::id(), $notes);

        View::setFlash('success', 'Comparison matrix updated.');
        View::redirect("/product-comparisons/{$id}");
    }

    public function addAttribute(string $id): void {
        if (!View::verifyCsrf()) {
            View::setFlash('error', 'Security token expired.');
            View::redirect("/product-comparisons/{$id}");
        }

        $name = trim($_POST['attribute_name'] ?? '');
        if (empty($name)) {
            View::setFlash('error', 'Attribute name is required.');
            View::redirect("/product-comparisons/{$id}");
        }

        ProductComparison::addAttribute((int)$id, [
            'attribute_name'    => $name,
            'marvean_metric'    => trim($_POST['marvean_metric'] ?? 'Audited & Verified'),
            'competitor_metric' => trim($_POST['competitor_metric'] ?? 'Standard Baseline'),
            'advantage'         => $_POST['advantage'] ?? 'Marvean',
            'audit_note'        => trim($_POST['audit_note'] ?? '')
        ], Auth::id());

        View::setFlash('success', "Attribute [{$name}] added to shootout matrix.");
        View::redirect("/product-comparisons/{$id}");
    }

    public function deleteAttribute(string $comparisonId, string $attributeId): void {
        if (!View::verifyCsrf()) {
            View::setFlash('error', 'Security token expired.');
            View::redirect("/product-comparisons/{$comparisonId}");
        }

        ProductComparison::deleteAttribute((int)$attributeId, Auth::id());
        View::setFlash('success', 'Comparison attribute removed.');
        View::redirect("/product-comparisons/{$comparisonId}");
    }

    public function delete(string $id): void {
        if (!View::verifyCsrf()) {
            View::setFlash('error', 'Security token expired.');
            View::redirect('/product-comparisons');
        }

        ProductComparison::delete((int)$id, Auth::id());
        View::setFlash('success', 'Product comparison matrix deleted.');
        View::redirect('/product-comparisons');
    }

    public function storeProduct(): void {
        if (!View::verifyCsrf()) {
            View::setFlash('error', 'Security token expired.');
            View::redirect('/product-comparisons');
        }

        $validator = Validator::make($_POST, [
            'competitor_id' => 'required|numeric',
            'name'          => 'required|min:2|max:150',
            'category'      => 'required|max:100',
            'pricing_tier'  => 'required'
        ]);

        if ($validator->fails()) {
            View::setFlash('error', $validator->firstError());
            View::redirect('/product-comparisons');
        }

        Product::create([
            'competitor_id'   => (int)$_POST['competitor_id'],
            'name'            => trim($_POST['name']),
            'category'        => trim($_POST['category']),
            'pricing_model'   => trim($_POST['pricing_model'] ?? 'Annual Contract'),
            'pricing_tier'    => trim($_POST['pricing_tier']),
            'status'          => $_POST['status'] ?? 'Active',
            'feature_summary' => trim($_POST['feature_summary'] ?? '')
        ], Auth::id());

        View::setFlash('success', "Competitor product [{$_POST['name']}] cataloged.");
        View::redirect('/product-comparisons');
    }
}
