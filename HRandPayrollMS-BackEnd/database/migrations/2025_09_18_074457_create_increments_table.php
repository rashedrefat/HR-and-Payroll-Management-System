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
        Schema::create('increments', function (Blueprint $table) {
            $table->id();

            // foreign key to employees.id (numeric PK)
            $table->string('employee_id'); // Make sure this is VARCHAR in DB, not INT
            $table->foreign('employee_id')->references('employee_id')->on('employees')->onDelete('cascade');

            $table->decimal('salary', 10, 2);
            $table->date('last_increment_date')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('increments');
    }
};
