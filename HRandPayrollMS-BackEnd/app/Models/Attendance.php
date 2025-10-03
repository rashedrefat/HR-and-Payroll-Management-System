<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'employee_id',
        'shift_id',
        'check_in_time',
        'check_out_time',
        'date',
        'is_late',
        'is_early_out',
        'late_minutes',
        'early_out_minutes',
    ];

    protected $casts = [
        'is_late' => 'boolean',
        'is_early_out' => 'boolean',
        'date' => 'date',
        'check_in_time' => 'datetime:g:i A',
        'check_out_time' => 'datetime:g:i A',
    ];

    // Convert 12-hour format to 24-hour format for database storage
    public function setCheckInTimeAttribute($value)
    {
        if ($value && $this->is12HourFormat($value)) {
            $this->attributes['check_in_time'] = $this->convertTo24Hour($value);
        } else {
            $this->attributes['check_in_time'] = $value;
        }
    }

    public function setCheckOutTimeAttribute($value)
    {
        if ($value && $this->is12HourFormat($value)) {
            $this->attributes['check_out_time'] = $this->convertTo24Hour($value);
        } else {
            $this->attributes['check_out_time'] = $value;
        }
    }

    // Convert 24-hour format to 12-hour format for display
    public function getCheckInTimeAttribute($value)
    {
        if ($value) {
            try {
                // Try H:i:s format first
                return \Carbon\Carbon::createFromFormat('H:i:s', $value)->format('g:i A');
            } catch (\Exception $e) {
                try {
                    // Try H:i format
                    return \Carbon\Carbon::createFromFormat('H:i', $value)->format('g:i A');
                } catch (\Exception $e) {
                    // If it's already in 12-hour format, return as is
                    if ($this->is12HourFormat($value)) {
                        return $value;
                    }
                    return $value;
                }
            }
        }
        return $value;
    }

    public function getCheckOutTimeAttribute($value)
    {
        if ($value) {
            try {
                // Try H:i:s format first
                return \Carbon\Carbon::createFromFormat('H:i:s', $value)->format('g:i A');
            } catch (\Exception $e) {
                try {
                    // Try H:i format
                    return \Carbon\Carbon::createFromFormat('H:i', $value)->format('g:i A');
                } catch (\Exception $e) {
                    // If it's already in 12-hour format, return as is
                    if ($this->is12HourFormat($value)) {
                        return $value;
                    }
                    return $value;
                }
            }
        }
        return $value;
    }

    // Helper methods
    private function is12HourFormat($time)
    {
        return preg_match('/^\d{1,2}:\d{2}\s?(AM|PM)$/i', $time);
    }

    private function convertTo24Hour($time12)
    {
        return \Carbon\Carbon::createFromFormat('g:i A', $time12)->format('H:i:s');
    }

    // Relationship with Employee
    public function employee()
    {
        return $this->belongsTo(Employee::class, 'employee_id', 'employee_id');
    }

    // Relationship with Shift
    public function shift()
    {
        return $this->belongsTo(Shift::class);
    }
}
