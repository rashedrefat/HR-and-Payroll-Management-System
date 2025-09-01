<?php

namespace App\Http\Controllers\Setting;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Setting\GeneralSetting;

class GeneralSettingController extends Controller
{
    public function setting(Request $request)
    {
        $validated = $request->validate([
            'site_name' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'location' => 'nullable|string|max:255',
            'website' => 'nullable|url|max:255',
            'establish_year' => 'nullable|integer|min:1900|max:' . date('Y'),
        ]);
 
        $setting = GeneralSetting::firstOrCreate([]);
        
        $setting->site_name = $validated['site_name'] ?? $setting->site_name;
        $setting->email = $validated['email'] ?? $setting->email;
        $setting->phone = $validated['phone'] ?? $setting->phone;
        $setting->location = $validated['location'] ?? $setting->location;
        $setting->website = $validated['website'] ?? $setting->website;
        $setting->establish_year = $validated['establish_year'] ?? $setting->establish_year;

        $setting->save();

        return response()->json(['message' => 'Settings updated successfully']);    
    }
}
