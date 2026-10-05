<?php

namespace App\Middleware;

use App\Core\Auth;
use App\Core\View;

class AuthMiddleware {
    public function handle(): void {
        if (!Auth::check()) {
            View::setFlash('error', 'Please authenticate to access the MARVEAN command center.');
            View::redirect('/login');
        }
    }
}
