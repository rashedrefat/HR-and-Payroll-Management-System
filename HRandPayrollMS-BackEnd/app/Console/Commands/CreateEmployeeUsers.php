<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class CreateEmployeeUsers extends Command
{
    protected $signature = 'employees:create-users';
    protected $description = 'Create user accounts for employees who dont have them';

    public function handle()
    {
        // Get all employees
        $employees = DB::table('employees')->get();
        
        // Get existing user emails
        $existingUsers = DB::table('users')->pluck('email')->toArray();
        
        $created = 0;
        
        foreach ($employees as $employee) {
            // Skip if user already exists
            if (in_array($employee->email, $existingUsers)) {
                $this->info("User already exists for: {$employee->email}");
                continue;
            }
            
            // Create user account for employee
            $nameParts = explode(' ', $employee->name, 2);
            $firstName = $nameParts[0];
            $lastName = isset($nameParts[1]) ? $nameParts[1] : '';
            
            DB::table('users')->insert([
                'firstName' => $firstName,
                'lastName' => $lastName,
                'email' => $employee->email,
                'password' => Hash::make('123456'), // Default password
                'role_id' => 1, // Employee role
                'status' => 1, // Active
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            
            $this->info("Created user account for: {$employee->name} ({$employee->email})");
            $created++;
        }
        
        $this->info("Created {$created} new user accounts.");
        $this->warn("Default password for new accounts is: 123456");
        
        return 0;
    }
}