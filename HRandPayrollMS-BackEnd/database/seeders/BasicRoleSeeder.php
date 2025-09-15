<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BasicRoleSeeder extends Seeder
{
    public function run()
    {
        // Insert basic roles for role_id foreign key constraint
        DB::table('roles')->insertOrIgnore([
            [
                'id' => 1,
                'name' => 'employee',
                'guard_name' => 'sanctum',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 2, 
                'name' => 'administrator',
                'guard_name' => 'sanctum',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);
    }
}
