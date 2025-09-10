<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User\User as UserUser;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class UserSeeder extends Seeder
{
    public function run()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0');

        $user1 = UserUser::firstOrCreate(
            ['email' => 'sadiaafrin@gmail.com'],
            [
                'firstName' => 'Sadia',
                'lastName' => 'Afrin',
                'phone' => '01833445566',
                'password' => Hash::make('123456'),
                'tenant_id' => 1,
                'role_id' => 1
            ]
        );
        $user1->assignRole('hrms_owner');

        $user2 = UserUser::firstOrCreate(
            ['email' => 'rashedulislamrefat@gmail.com'],
            [
                'firstName' => 'Rashed',
                'lastName' => 'Refat',  // You can change lastName if needed
                'phone' => '01934478672', // Add a phone number or leave blank if nullable
                'password' => Hash::make('123456'),
                'tenant_id' => 2,
                'role_id' => 2 // Change role_id if needed
            ]
        );
        $user2->assignRole('super_admin'); // Or assign a different role if needed

        DB::statement('SET FOREIGN_KEY_CHECKS=1');
    }
}
