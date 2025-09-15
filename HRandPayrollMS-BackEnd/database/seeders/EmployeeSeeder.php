<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Employee;
use App\Models\Departments;
use App\Models\Designations;

class EmployeeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get department and designation IDs
        $webDev = Departments::where('name', 'Web Development')->first();
        $hr = Departments::where('name', 'Human Resource')->first();
        $sales = Departments::where('name', 'Sales')->first();
        $support = Departments::where('name', 'Customer Support')->first();

        $webDeveloper = Designations::where('title', 'Web Developer')->first();
        $hrHead = Designations::where('title', 'HR Head')->first();
        $salesman = Designations::where('title', 'Salesman')->first();
        $supporter = Designations::where('title', 'Supporter')->first();

        $employees = [
            [
                'name' => 'Rashedul Islam',
                'email' => 'rashed@gmail.com',
                'employee_id' => 'EMP-82382',
                'mobile' => '01934478672',
                'department_id' => $webDev->id,
                'designation_id' => $webDeveloper->id,
                'status' => 1,
                'joining_date' => '2025-06-22',
                'image' => '/images/profile-photo.jpg',
            ],
            [
                'name' => 'Rifat Bandhan',
                'email' => 'bandhan@gmail.com',
                'employee_id' => 'EMP-33923',
                'mobile' => '01798674289',
                'department_id' => $webDev->id,
                'designation_id' => $webDeveloper->id,
                'status' => 1,
                'joining_date' => '2025-06-22',
                'image' => '/images/bandhan-pic.jpg',
            ],
            [
                'name' => 'Sadia Afrin',
                'email' => 'sadia@gmail.com',
                'employee_id' => 'EMP-13445',
                'mobile' => '01843272377',
                'department_id' => $hr->id,
                'designation_id' => $hrHead->id,
                'status' => 1,
                'joining_date' => '2025-06-22',
                'image' => '/images/sadia-pic.jpg',
            ],
            [
                'name' => 'Mazaharul Auntu',
                'email' => 'auntu@gmail.com',
                'employee_id' => 'EMP-24422',
                'mobile' => '01307842696',
                'department_id' => $webDev->id,
                'designation_id' => $webDeveloper->id,
                'status' => 0,
                'joining_date' => '2025-06-22',
                'image' => '/images/auntu-pic.jpg',
            ],
            [
                'name' => 'Shahariar Islam',
                'email' => 'shahriar@gmail.com',
                'employee_id' => 'EMP-42452',
                'mobile' => '01432344525',
                'department_id' => $sales->id,
                'designation_id' => $salesman->id,
                'status' => 1,
                'joining_date' => '2025-06-20',
                'image' => '/images/shahriar-pic.jpg',
            ],
            [
                'name' => 'Lina Rahman',
                'email' => 'lina@gmail.com',
                'employee_id' => 'EMP-42332',
                'mobile' => '0134949490',
                'department_id' => $support->id,
                'designation_id' => $supporter->id,
                'status' => 1,
                'joining_date' => '2025-06-20',
                'image' => '/images/lina-pic.jpg',
            ],
        ];

        foreach ($employees as $employee) {
            Employee::create($employee);
        }
    }
}
