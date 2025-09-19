<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Increment extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_id',
        'salary',
        'last_increment_date',
    ];

    // Relation to employee (employees.id)
    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }
}
