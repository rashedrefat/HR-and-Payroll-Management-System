<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Employee;

class UpdateEmployeeGenderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Specifically update Rashedul Islam and Rifat Bandhan to male
        Employee::where('name', 'LIKE', '%Rashedul Islam%')
            ->orWhere('name', 'LIKE', '%rashedul islam%')
            ->orWhere('name', 'LIKE', '%Rashedul%')
            ->update(['gender' => 'male']);
            
        Employee::where('name', 'LIKE', '%Rifat Bandhan%')
            ->orWhere('name', 'LIKE', '%rifat bandhan%')
            ->orWhere('name', 'LIKE', '%Rifat%')
            ->update(['gender' => 'male']);
            
        // Log the updates
        $rashedul = Employee::where('name', 'LIKE', '%Rashedul%')->first();
        $rifat = Employee::where('name', 'LIKE', '%Rifat%')->first();
        
        if ($rashedul) {
            echo "Updated {$rashedul->name} to male\n";
        }
        
        if ($rifat) {
            echo "Updated {$rifat->name} to male\n";
        }
        
        // Update other employees with gender based on name patterns
        $employees = Employee::whereNull('gender')->orWhere('gender', '')->get();
        
        foreach ($employees as $employee) {
            $gender = $this->determineGenderByName($employee->name);
            
            $employee->update([
                'gender' => $gender
            ]);
        }
    }
    
    private function determineGenderByName($name)
    {
        $name = strtolower($name);
        
        // Common male name patterns
        $malePatterns = ['rashid', 'ahmed', 'mohammed', 'ali', 'hassan', 'omar', 'ibrahim', 'yusuf', 'abdullah', 'muhammad'];
        
        // Common female name patterns
        $femalePatterns = ['fatima', 'aisha', 'amina', 'sara', 'hana', 'mariam', 'zainab', 'yasmin', 'nadia', 'layla'];
        
        foreach ($malePatterns as $pattern) {
            if (strpos($name, $pattern) !== false) {
                return 'male';
            }
        }
        
        foreach ($femalePatterns as $pattern) {
            if (strpos($name, $pattern) !== false) {
                return 'female';
            }
        }
        
        // If no pattern matches, assign randomly but weighted towards male/female
        $genders = ['male', 'female', 'male', 'female']; // Equal weight
        return $genders[array_rand($genders)];
    }
}