<?php

namespace App\Controllers;

use App\Core\Auth;
use App\Core\View;
use App\Core\Validator;
use App\Models\User;

class UserController {
    public function index(): void {
        $users = User::all();

        View::render('users/index', [
            'title'     => 'USER MANAGEMENT // RBAC Access Control',
            'users'     => $users,
            'activeNav' => 'users'
        ]);
    }

    public function create(): void {
        View::render('users/create', [
            'title'     => 'Provision User Account',
            'activeNav' => 'users'
        ]);
    }

    public function store(): void {
        if (!View::verifyCsrf()) {
            View::setFlash('error', 'Security token expired.');
            View::redirect('/users/create');
        }

        $validator = Validator::make($_POST, [
            'name'     => 'required|min:2|max:100',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|min:6',
            'role'     => 'required|in:admin,analyst,viewer',
            'status'   => 'required|in:active,suspended'
        ]);

        if ($validator->fails()) {
            View::setFlash('error', $validator->firstError());
            View::redirect('/users/create');
        }

        User::create([
            'name'     => trim($_POST['name']),
            'email'    => trim($_POST['email']),
            'password' => $_POST['password'],
            'role'     => $_POST['role'],
            'status'   => $_POST['status']
        ]);

        View::setFlash('success', "User account [{$_POST['email']}] provisioned successfully.");
        View::redirect('/users');
    }

    public function edit(string $id): void {
        $user = User::find((int)$id);
        if (!$user) {
            View::setFlash('error', 'User account not found.');
            View::redirect('/users');
        }

        View::render('users/edit', [
            'title'     => "Edit User: {$user['name']}",
            'targetUser'=> $user,
            'activeNav' => 'users'
        ]);
    }

    public function update(string $id): void {
        if (!View::verifyCsrf()) {
            View::setFlash('error', 'Security token expired.');
            View::redirect("/users/{$id}/edit");
        }

        $validator = Validator::make($_POST, [
            'name'   => 'required|min:2|max:100',
            'email'  => "required|email|unique:users,email,{$id}",
            'role'   => 'required|in:admin,analyst,viewer',
            'status' => 'required|in:active,suspended'
        ]);

        if ($validator->fails()) {
            View::setFlash('error', $validator->firstError());
            View::redirect("/users/{$id}/edit");
        }

        $data = [
            'name'   => trim($_POST['name']),
            'email'  => trim($_POST['email']),
            'role'   => $_POST['role'],
            'status' => $_POST['status']
        ];

        if (!empty($_POST['password'])) {
            $data['password'] = $_POST['password'];
        }

        User::update((int)$id, $data);
        View::setFlash('success', "User account [{$_POST['email']}] updated.");
        View::redirect('/users');
    }

    public function delete(string $id): void {
        if (!View::verifyCsrf()) {
            View::setFlash('error', 'Security token expired.');
            View::redirect('/users');
        }

        if ((int)$id === Auth::id()) {
            View::setFlash('error', 'Cannot delete active logged-in administrator.');
            View::redirect('/users');
        }

        User::delete((int)$id);
        View::setFlash('success', 'User account revoked.');
        View::redirect('/users');
    }
}
