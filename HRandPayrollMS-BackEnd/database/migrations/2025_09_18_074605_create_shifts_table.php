<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('shifts', function (Blueprint $table) {
            $table->id();
            $table->string('shift_name');
            $table->string('type')->nullable(); // Example: Morning, Evening, Night
            $table->time('check_in');
            $table->time('check_out');
            $table->integer('grace_time')->default(0); // in minutes
            $table->json('working_days'); // store as array [Mon, Tue, ...]
            $table->json('weekends')->nullable(); // store as array [Sat, Sun, ...]
            $table->boolean('status')->default(1); // 1 = Active, 0 = Inactive
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('shifts');
    }
};
