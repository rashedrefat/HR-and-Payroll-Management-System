<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('employee_salaries', function (Blueprint $table) {
            $table->id();
            $table->string('name');                        // Salary title (e.g., September Salary)
            $table->string('employee_id');                 // Employee ID (string since you mentioned IDs may have text/symbols)
            $table->decimal('salary', 10, 2);              // Base salary
            $table->decimal('adjustment_amount', 10, 2)->default(0); // Adjustment amount (+/-)
            $table->string('adjustment_reason')->nullable();         // Reason for adjustment
            $table->decimal('after_adjustment_salary', 10, 2);       // Final salary after adjustment
            $table->enum('status', ['pending', 'paid', 'unpaid'])->default('pending'); // Status
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employee_salaries');
    }
};
