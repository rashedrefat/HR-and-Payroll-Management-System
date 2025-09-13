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
}
