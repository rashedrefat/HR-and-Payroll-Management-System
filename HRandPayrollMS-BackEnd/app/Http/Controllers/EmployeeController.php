<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use Illuminate\Http\Request;

class EmployeeController extends Controller
{
    // Get all employees with department and designation
    public function index()
    {
        return response()->json(
            Employee::with(['department', 'designation'])->get(),
            200
        );
    }

    // Store new employee
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:employees,email',
            'employee_id' => 'required|string|unique:employees,employee_id',
            'mobile' => 'nullable|string|max:20',
            'department_id' => 'required|exists:departments,id',
            'designation_id' => 'required|exists:designations,id',
            'status' => 'boolean',
            'joining_date' => 'required|date',
            'image' => 'nullable|string',
        ]);

        $employee = Employee::create($validated);

        return response()->json(
            $employee->load(['department', 'designation']),
            201
        );
    }

    // Show one employee
    public function show($id)
    {
        $employee = Employee::with(['department', 'designation'])->findOrFail($id);
        return response()->json($employee, 200);
    }

    // Update employee
    public function update(Request $request, $id)
    {
        $employee = Employee::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:employees,email,' . $id,
            'employee_id' => 'sometimes|required|string|unique:employees,employee_id,' . $id,
            'mobile' => 'nullable|string|max:20',
            'department_id' => 'sometimes|required|exists:departments,id',
            'designation_id' => 'sometimes|required|exists:designations,id',
            'status' => 'boolean',
            'joining_date' => 'sometimes|required|date',
            'image' => 'nullable|string',
        ]);

        $employee->update($validated);

        return response()->json(
            $employee->load(['department', 'designation']),
            200
        );
    }

    // Delete employee
    public function destroy($id)
    {
        $employee = Employee::findOrFail($id);
        $employee->delete();

        return response()->json(['message' => 'Employee deleted successfully'], 200);
    }

    // Get current authenticated employee profile
    public function profile(Request $request)
    {
        $user = $request->user();
        
        if (!$user) {
            return response()->json(['error' => 'User not authenticated'], 401);
        }

        // Log user for debugging
        \Log::info('User authenticated in employee profile:', ['user_id' => $user->id, 'email' => $user->email]);

        // Find employee by matching email
        $employee = Employee::with(['department', 'designation'])
            ->where('email', $user->email)
            ->first();

        if (!$employee) {
            \Log::warning('Employee record not found for user:', ['user_email' => $user->email]);
            return response()->json(['error' => 'Employee record not found'], 404);
        }

        \Log::info('Employee found:', ['employee_id' => $employee->id, 'employee_name' => $employee->name]);

        // Format the response data
        $employeeData = [
            'id' => $employee->id,
            'name' => $employee->name,
            'email' => $employee->email,
            'employee_id' => $employee->employee_id,
            'mobile' => $employee->mobile,
            'department' => $employee->department ? $employee->department->name : null,
            'department_id' => $employee->department_id,
            'designation' => $employee->designation ? $employee->designation->name : null,
            'designation_id' => $employee->designation_id,
            'status' => $employee->status,
            'joining_date' => $employee->joining_date,
            'image' => $employee->image ? url('storage/employee_images/' . $employee->image) : null,
        ];

        return response()->json($employeeData, 200);
    }
}
