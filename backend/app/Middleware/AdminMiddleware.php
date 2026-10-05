<?php

namespace App\Middleware;

use App\Core\Auth;
use App\Core\View;

class AdminMiddleware {
    public function handle(): void {
        if (!Auth::check() || Auth::role() !== 'admin') {
            View::setFlash('error', 'Access restricted: Executive Administrator privilege required.');
            View::redirect('/dashboard');
        }
    }
}
