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
        Schema::table('employee_salaries', function (Blueprint $table) {
            $table->dropColumn(['adjustment_amount', 'adjustment_reason', 'after_adjustment_salary']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('employee_salaries', function (Blueprint $table) {
            $table->decimal('adjustment_amount', 10, 2)->default(0);
            $table->string('adjustment_reason')->nullable();
            $table->decimal('after_adjustment_salary', 10, 2);
        });
    }
};
