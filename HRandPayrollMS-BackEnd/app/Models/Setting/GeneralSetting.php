<?php

namespace App\Models\Setting;

use Illuminate\Database\Eloquent\Model;

class GeneralSetting extends Model
{
    protected $fillable = [
        'site_name',
        'company_type',
        'establish_year',
        'employee_number',
        'location',
        'website',
        'phone',
        'email',
        'industry',
        'about_company',
        'hr_name',
        'hr_position',
        'hr_experience',
        'hr_joindate',
        'hr_email',
        'hr_phone',
        'hr_dept',
        'hr_education',
    ];

    protected $casts = [
        'establish_year' => 'integer',
        'employee_number' => 'integer',
        'hr_joindate' => 'date',
    ];
}
