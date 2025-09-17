<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EmployeeSalaries extends Model
{
    use HasFactory;

    protected $table = 'employee_salaries'; // explicitly matches DB table name

    protected $fillable = [
        'name',
        'employee_id',
        'salary',
        'adjustment_amount',
        'adjustment_reason',
        'after_adjustment_salary',
        'status',
    ];
}
