<?php

namespace App\Http\Controllers\Setting;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Setting\GeneralSetting;

class GeneralSettingController extends Controller
{
    /**
     * Get general settings
     */
    public function index()
    {
        $setting = GeneralSetting::first();
        
        if (!$setting) {
            // Return default/empty structure if no settings exist yet
            $setting = new GeneralSetting([
                'site_name' => '',
                'company_type' => '',
                'establish_year' => null,
                'employee_number' => null,
                'location' => '',
                'website' => '',
                'phone' => '',
                'email' => '',
                'industry' => '',
                'about_company' => '',
                'hr_name' => '',
                'hr_position' => '',
                'hr_experience' => '',
                'hr_joindate' => null,
                'hr_email' => '',
                'hr_phone' => '',
                'hr_dept' => '',
                'hr_education' => ''
            ]);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'company' => [
                    'name' => $setting->site_name,
                    'companyType' => $setting->company_type,
                    'established' => $setting->establish_year,
                    'employees' => $setting->employee_number,
                    'location' => $setting->location,
                    'website' => $setting->website,
                    'phone' => $setting->phone,
                    'email' => $setting->email,
                    'industry' => $setting->industry,
                    'description' => $setting->about_company
                ],
                'hr' => [
                    'name' => $setting->hr_name,
                    'position' => $setting->hr_position,
                    'experience' => $setting->hr_experience,
                    'joinDate' => $setting->hr_joindate ? $setting->hr_joindate->format('Y-m-d') : null,
                    'email' => $setting->hr_email,
                    'phone' => $setting->hr_phone,
                    'department' => $setting->hr_dept,
                    'education' => $setting->hr_education
                ]
            ]
        ]);
    }

    /**
     * Update general settings
     */
    public function setting(Request $request)
    {
        $validated = $request->validate([
            'site_name' => 'nullable|string|max:255',
            'company_type' => 'nullable|string|max:255',
            'establish_year' => 'nullable|integer|min:1900|max:' . date('Y'),
            'employee_number' => 'nullable|integer|min:1',
            'location' => 'nullable|string|max:255',
            'website' => 'nullable|url|max:255',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'industry' => 'nullable|string|max:255',
            'about_company' => 'nullable|string|max:1000',

            'hr_name' => 'nullable|string|max:255',
            'hr_position' => 'nullable|string|max:255',
            'hr_experience' => 'nullable|string|max:255',
            'hr_joindate' => 'nullable|date',
            'hr_email' => 'nullable|email|max:255',
            'hr_phone' => 'nullable|string|max:20',
            'hr_dept' => 'nullable|string|max:255',
            'hr_education' => 'nullable|string|max:500'
        ]);

        $setting = GeneralSetting::firstOrCreate([]);
        $setting->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Settings updated successfully',
            'data' => [
                'company' => [
                    'name' => $setting->site_name,
                    'companyType' => $setting->company_type,
                    'established' => $setting->establish_year,
                    'employees' => $setting->employee_number,
                    'location' => $setting->location,
                    'website' => $setting->website,
                    'phone' => $setting->phone,
                    'email' => $setting->email,
                    'industry' => $setting->industry,
                    'description' => $setting->about_company
                ],
                'hr' => [
                    'name' => $setting->hr_name,
                    'position' => $setting->hr_position,
                    'experience' => $setting->hr_experience,
                    'joinDate' => $setting->hr_joindate ? $setting->hr_joindate->format('Y-m-d') : null,
                    'email' => $setting->hr_email,
                    'phone' => $setting->hr_phone,
                    'department' => $setting->hr_dept,
                    'education' => $setting->hr_education
                ]
            ]
        ]);
    }

    /**
     * Update company information only
     */
    public function updateCompany(Request $request)
    {
        $validated = $request->validate([
            'name' => 'nullable|string|max:255',
            'companyType' => 'nullable|string|max:255',
            'established' => 'nullable|integer|min:1900|max:' . date('Y'),
            'employees' => 'nullable|integer|min:1',
            'location' => 'nullable|string|max:255',
            'website' => 'nullable|url|max:255',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'industry' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:1000'
        ]);

        $setting = GeneralSetting::firstOrCreate([]);
        
        $setting->update([
            'site_name' => $validated['name'] ?? $setting->site_name,
            'company_type' => $validated['companyType'] ?? $setting->company_type,
            'establish_year' => $validated['established'] ?? $setting->establish_year,
            'employee_number' => $validated['employees'] ?? $setting->employee_number,
            'location' => $validated['location'] ?? $setting->location,
            'website' => $validated['website'] ?? $setting->website,
            'phone' => $validated['phone'] ?? $setting->phone,
            'email' => $validated['email'] ?? $setting->email,
            'industry' => $validated['industry'] ?? $setting->industry,
            'about_company' => $validated['description'] ?? $setting->about_company
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Company information updated successfully',
            'data' => [
                'name' => $setting->site_name,
                'companyType' => $setting->company_type,
                'established' => $setting->establish_year,
                'employees' => $setting->employee_number,
                'location' => $setting->location,
                'website' => $setting->website,
                'phone' => $setting->phone,
                'email' => $setting->email,
                'industry' => $setting->industry,
                'description' => $setting->about_company
            ]
        ]);
    }

    /**
     * Update HR information only
     */
    public function updateHR(Request $request)
    {
        $validated = $request->validate([
            'name' => 'nullable|string|max:255',
            'position' => 'nullable|string|max:255',
            'experience' => 'nullable|string|max:255',
            'joinDate' => 'nullable|date',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'department' => 'nullable|string|max:255',
            'education' => 'nullable|string|max:500'
        ]);

        $setting = GeneralSetting::firstOrCreate([]);
        
        $setting->update([
            'hr_name' => $validated['name'] ?? $setting->hr_name,
            'hr_position' => $validated['position'] ?? $setting->hr_position,
            'hr_experience' => $validated['experience'] ?? $setting->hr_experience,
            'hr_joindate' => $validated['joinDate'] ?? $setting->hr_joindate,
            'hr_email' => $validated['email'] ?? $setting->hr_email,
            'hr_phone' => $validated['phone'] ?? $setting->hr_phone,
            'hr_dept' => $validated['department'] ?? $setting->hr_dept,
            'hr_education' => $validated['education'] ?? $setting->hr_education
        ]);

        return response()->json([
            'success' => true,
            'message' => 'HR information updated successfully',
            'data' => [
                'name' => $setting->hr_name,
                'position' => $setting->hr_position,
                'experience' => $setting->hr_experience,
                'joinDate' => $setting->hr_joindate ? $setting->hr_joindate->format('Y-m-d') : null,
                'email' => $setting->hr_email,
                'phone' => $setting->hr_phone,
                'department' => $setting->hr_dept,
                'education' => $setting->hr_education
            ]
        ]);
    }
}
