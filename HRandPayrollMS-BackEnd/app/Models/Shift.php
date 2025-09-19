<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Shift extends Model
{
    use HasFactory;

    protected $fillable = [
        'shift_name',
        'type',
        'check_in',
        'check_out',
        'grace_time',
        'working_days',
        'weekends',
        'status',
    ];

    protected $casts = [
        'working_days' => 'array',
        'weekends' => 'array',
        'status' => 'boolean',
    ];
}
