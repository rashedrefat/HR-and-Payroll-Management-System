<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Departments;

class DepartmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $departments = [
            [
                'name' => 'Web Development',
                'description' => 'Responsible for web application development and maintenance',
                'status' => 1,
            ],
            [
                'name' => 'Human Resource',
                'description' => 'Manages employee relations, recruitment, and HR policies',
                'status' => 1,
            ],
            [
                'name' => 'Sales',
                'description' => 'Handles sales activities and customer acquisition',
                'status' => 1,
            ],
            [
                'name' => 'Customer Support',
                'description' => 'Provides customer service and technical support',
                'status' => 1,
            ],
            [
                'name' => 'Marketing',
                'description' => 'Manages marketing campaigns and brand promotion',
                'status' => 1,
            ],
            [
                'name' => 'Finance',
                'description' => 'Handles financial planning, budgeting, and accounting',
                'status' => 1,
            ],
        ];

        foreach ($departments as $department) {
            Departments::create($department);
        }
    }
}
