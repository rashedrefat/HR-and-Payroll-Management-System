<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Departments extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'status',
    ];

    // Relation: One department has many employees
    public function employees()
    {
        return $this->hasMany(Employee::class, 'department_id');
    }
}
