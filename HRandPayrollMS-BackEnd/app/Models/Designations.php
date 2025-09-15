<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Designations extends Model
{
    use HasFactory;

    protected $table = 'designations';

    protected $fillable = [
        'title',
        'description',
        'status',
        'department_id',
    ];

    // Each designation belongs to one department
    public function department()
    {
        return $this->belongsTo(Departments::class, 'department_id');
    }

    // One designation can have many employees
    public function employees()
    {
        return $this->hasMany(Employees::class, 'designation_id');
    }
}
