<?php

namespace Database\Seeders;

use App\Models\User\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class TestUserSeeder extends Seeder
{
    public function run(): void
    {
        // Create admin user
        User::create([
            'firstName' => 'Admin',
            'lastName' => 'User',
            'email' => 'admin@test.com',
            'phone' => '1234567890',
            'password' => Hash::make('password123'),
            'status' => 1,
        ]);

        // Create employee user
        User::create([
            'firstName' => 'John',
            'lastName' => 'Employee',
            'email' => 'employee@test.com',
            'phone' => '0987654321',
            'password' => Hash::make('password123'),
            'status' => 1,
        ]);
    }
}
