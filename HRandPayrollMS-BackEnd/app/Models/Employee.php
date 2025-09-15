<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    use HasFactory;

    protected $table = 'employees';

    protected $fillable = [
        'name',
        'email',
        'employee_id',
        'mobile',
        'department_id',
        'designation_id',
        'status',
        'joining_date',
        'image',
    ];

    // Employee belongs to a department
    public function department()
    {
        return $this->belongsTo(Departments::class, 'department_id');
    }

    // Employee belongs to a designation
    public function designation()
    {
        return $this->belongsTo(Designations::class, 'designation_id');
    }
}
