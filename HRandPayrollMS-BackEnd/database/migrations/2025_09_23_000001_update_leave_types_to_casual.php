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
        // Update leave_types table - change Annual, Personal, Emergency to Casual
        DB::table('leave_types')
            ->whereIn('leave_type', ['Annual', 'Personal', 'Emergency'])
            ->update(['leave_type' => 'Casual']);

        // Update leave_requests table to match the new leave type names
        DB::table('leave_requests')
            ->whereIn('leave_type', ['Annual', 'Personal', 'Emergency'])
            ->update(['leave_type' => 'Casual']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Note: This rollback is simplified and may not restore original data exactly
        // as multiple leave types were merged into one
        
        // Split Casual back to Annual (as an example)
        DB::table('leave_types')
            ->where('leave_type', 'Casual')
            ->update(['leave_type' => 'Annual']);

        DB::table('leave_requests')
            ->where('leave_type', 'Casual')
            ->update(['leave_type' => 'Annual']);
    }
};