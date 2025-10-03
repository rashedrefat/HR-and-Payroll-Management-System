<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\LeaveType;

class LeaveTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $leaveTypes = [
            [
                'leave_type' => 'Casual',
                'days' => 10,
            ],
            [
                'leave_type' => 'Sick',
                'days' => 15,
            ],
            [
                'leave_type' => 'Maternity Leave',
                'days' => 90,
            ],
        ];

        foreach ($leaveTypes as $leaveType) {
            LeaveType::firstOrCreate(
                ['leave_type' => $leaveType['leave_type']], // condition to check
                $leaveType // data to insert if not exists
            );
        }
    }
}