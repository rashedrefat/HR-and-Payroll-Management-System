<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Clean up duplicate leave types
        // First, update any leave requests that reference "Casual Leave" to just "Casual"
        DB::table('leave_requests')
            ->where('leave_type', 'Casual Leave')
            ->update(['leave_type' => 'Casual']);

        // Remove the "Casual Leave" entry and keep only "Casual"
        DB::table('leave_types')
            ->where('leave_type', 'Casual Leave')
            ->delete();

        // Ensure we have a "Casual" leave type with reasonable days
        DB::table('leave_types')
            ->updateOrInsert(
                ['leave_type' => 'Casual'],
                ['leave_type' => 'Casual', 'days' => 10, 'updated_at' => now()]
            );
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // This rollback adds back "Casual Leave" if needed
        DB::table('leave_types')
            ->insertOrIgnore([
                'leave_type' => 'Casual Leave',
                'days' => 10,
                'created_at' => now(),
                'updated_at' => now()
            ]);
    }
};