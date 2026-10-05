<?php

namespace App\Controllers;

use App\Core\Auth;
use App\Core\View;
use App\Core\Validator;
use App\Models\User;

class AuthController {
    public function showLogin(): void {
        if (Auth::check()) {
            View::redirect('/dashboard');
        }
        View::render('auth/login', ['title' => 'Authenticate // MARVEAN Command Center'], 'layouts/auth');
    }

    public function login(): void {
        if (!View::verifyCsrf()) {
            View::setFlash('error', 'Session expired. Please retry.');
            View::redirect('/login');
        }

        $email = trim($_POST['email'] ?? '');
        $password = $_POST['password'] ?? '';

        $validator = Validator::make($_POST, [
            'email'    => 'required|email',
            'password' => 'required'
        ]);

        if ($validator->fails()) {
            View::setFlash('error', $validator->firstError());
            View::redirect('/login');
        }

        if (Auth::attempt($email, $password)) {
            View::setFlash('success', 'Authentication successful. Welcome to MARVEAN Command Center.');
            View::redirect('/dashboard');
        } else {
            View::setFlash('error', 'Invalid intelligence credentials. Check email and passphrase.');
            View::redirect('/login');
        }
    }

    public function showRegister(): void {
        if (Auth::check()) {
            View::redirect('/dashboard');
        }
        View::render('auth/register', ['title' => 'Register Analyst Account // MARVEAN'], 'layouts/auth');
    }

    public function register(): void {
        if (!View::verifyCsrf()) {
            View::setFlash('error', 'Session expired. Please retry.');
            View::redirect('/register');
        }

        $validator = Validator::make($_POST, [
            'name'     => 'required|min:2|max:100',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|min:6'
        ]);

        if ($validator->fails()) {
            View::setFlash('error', $validator->firstError());
            View::redirect('/register');
        }

        $userId = User::create([
            'name'     => trim($_POST['name']),
            'email'    => trim($_POST['email']),
            'password' => $_POST['password'],
            'role'     => 'analyst',
            'status'   => 'active'
        ]);

        Auth::attempt($_POST['email'], $_POST['password']);
        View::setFlash('success', 'Analyst profile provisioned. Welcome to MARVEAN.');
        View::redirect('/dashboard');
    }

    public function logout(): void {
        Auth::logout();
        View::setFlash('success', 'Session terminated securely.');
        View::redirect('/login');
    }
}
