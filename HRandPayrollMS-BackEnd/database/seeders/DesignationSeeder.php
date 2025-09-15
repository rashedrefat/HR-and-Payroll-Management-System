<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Designations;
use App\Models\Departments;

class DesignationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get department IDs
        $webDev = Departments::where('name', 'Web Development')->first();
        $hr = Departments::where('name', 'Human Resource')->first();
        $sales = Departments::where('name', 'Sales')->first();
        $support = Departments::where('name', 'Customer Support')->first();
        $marketing = Departments::where('name', 'Marketing')->first();
        $finance = Departments::where('name', 'Finance')->first();

        $designations = [
            // Web Development
            [
                'title' => 'Web Developer',
                'description' => 'Develops and maintains web applications',
                'department_id' => $webDev->id,
                'status' => 1,
            ],
            [
                'title' => 'Senior Web Developer',
                'description' => 'Senior level web developer with team lead responsibilities',
                'department_id' => $webDev->id,
                'status' => 1,
            ],
            [
                'title' => 'Frontend Developer',
                'description' => 'Specializes in frontend development',
                'department_id' => $webDev->id,
                'status' => 1,
            ],
            [
                'title' => 'Backend Developer',
                'description' => 'Specializes in backend development',
                'department_id' => $webDev->id,
                'status' => 1,
            ],
            
            // Human Resource
            [
                'title' => 'HR Head',
                'description' => 'Head of Human Resources department',
                'department_id' => $hr->id,
                'status' => 1,
            ],
            [
                'title' => 'HR Manager',
                'description' => 'Manages HR operations and employee relations',
                'department_id' => $hr->id,
                'status' => 1,
            ],
            [
                'title' => 'Recruitment Specialist',
                'description' => 'Handles recruitment and talent acquisition',
                'department_id' => $hr->id,
                'status' => 1,
            ],
            
            // Sales
            [
                'title' => 'Salesman',
                'description' => 'Handles sales activities and customer acquisition',
                'department_id' => $sales->id,
                'status' => 1,
            ],
            [
                'title' => 'Sales Manager',
                'description' => 'Manages sales team and strategies',
                'department_id' => $sales->id,
                'status' => 1,
            ],
            [
                'title' => 'Sales Executive',
                'description' => 'Executive level sales professional',
                'department_id' => $sales->id,
                'status' => 1,
            ],
            
            // Customer Support
            [
                'title' => 'Supporter',
                'description' => 'Provides customer support and assistance',
                'department_id' => $support->id,
                'status' => 1,
            ],
            [
                'title' => 'Support Manager',
                'description' => 'Manages customer support operations',
                'department_id' => $support->id,
                'status' => 1,
            ],
            
            // Marketing
            [
                'title' => 'Marketing Manager',
                'description' => 'Manages marketing campaigns and strategies',
                'department_id' => $marketing->id,
                'status' => 1,
            ],
            [
                'title' => 'Digital Marketing Specialist',
                'description' => 'Specializes in digital marketing and online campaigns',
                'department_id' => $marketing->id,
                'status' => 1,
            ],
            
            // Finance
            [
                'title' => 'Accountant',
                'description' => 'Handles accounting and financial records',
                'department_id' => $finance->id,
                'status' => 1,
            ],
            [
                'title' => 'Finance Manager',
                'description' => 'Manages financial planning and budgeting',
                'department_id' => $finance->id,
                'status' => 1,
            ],
        ];

        foreach ($designations as $designation) {
            Designations::create($designation);
        }
    }
}
