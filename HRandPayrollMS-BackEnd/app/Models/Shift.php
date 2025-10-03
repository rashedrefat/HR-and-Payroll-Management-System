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

    // Convert 12-hour format to 24-hour format for database storage
    public function setCheckInAttribute($value)
    {
        if ($value && $this->is12HourFormat($value)) {
            $this->attributes['check_in'] = $this->convertTo24Hour($value);
        } else {
            $this->attributes['check_in'] = $value;
        }
    }

    public function setCheckOutAttribute($value)
    {
        if ($value && $this->is12HourFormat($value)) {
            $this->attributes['check_out'] = $this->convertTo24Hour($value);
        } else {
            $this->attributes['check_out'] = $value;
        }
    }

    // Convert 24-hour format to 12-hour format for display
    public function getCheckInAttribute($value)
    {
        if ($value) {
            try {
                return \Carbon\Carbon::createFromFormat('H:i:s', $value)->format('g:i A');
            } catch (\Exception $e) {
                try {
                    // If it's already in H:i format, add seconds and convert
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

    public function getCheckOutAttribute($value)
    {
        if ($value) {
            try {
                return \Carbon\Carbon::createFromFormat('H:i:s', $value)->format('g:i A');
            } catch (\Exception $e) {
                try {
                    // If it's already in H:i format, add seconds and convert
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
}
