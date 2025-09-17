<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Resources\EmployeeSalaryResource;
use App\Models\EmployeeSalaries;
use Illuminate\Http\Request;

class EmployeeSalariesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $employeeSalaries = EmployeeSalaries::all();
        return EmployeeSalaryResource::collection($employeeSalaries);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Map frontend status to database status
        $statusMapping = [
            'pending' => 'pending',
            'approved' => 'paid',
            'rejected' => 'unpaid'
        ];

        $frontendStatus = $request->input('status', 'pending');
        $databaseStatus = $statusMapping[$frontendStatus] ?? $frontendStatus;

        // Convert camelCase to snake_case for database storage
        $data = [
            'name' => $request->input('name'),
            'employee_id' => $request->input('employeeId') ?? $request->input('employee_id'),
            'salary' => $request->input('salary'),
            'adjustment_amount' => $request->input('adjustmentAmount') ?? $request->input('adjustment_amount', 0),
            'adjustment_reason' => $request->input('adjustmentReason') ?? $request->input('adjustment_reason'),
            'after_adjustment_salary' => $request->input('afterAdjustmentSalary') ?? $request->input('after_adjustment_salary'),
            'status' => $databaseStatus,
        ];

        $request->merge($data);

        $request->validate([
            'name' => 'required|string|max:255',
            'employee_id' => 'required|string|max:255',
            'salary' => 'required|numeric|min:0',
            'adjustment_amount' => 'nullable|numeric',
            'adjustment_reason' => 'nullable|string|max:255',
            'after_adjustment_salary' => 'required|numeric|min:0',
            'status' => 'required|in:pending,paid,unpaid,approved,rejected',
        ]);

        $employeeSalary = EmployeeSalaries::create($data);

        return new EmployeeSalaryResource($employeeSalary);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $employeeSalary = EmployeeSalaries::findOrFail($id);
        return new EmployeeSalaryResource($employeeSalary);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $employeeSalary = EmployeeSalaries::findOrFail($id);

        // Map frontend status to database status
        $statusMapping = [
            'pending' => 'pending',
            'approved' => 'paid',
            'rejected' => 'unpaid'
        ];

        $frontendStatus = $request->input('status');
        $databaseStatus = $frontendStatus ? ($statusMapping[$frontendStatus] ?? $frontendStatus) : null;

        // Convert camelCase to snake_case for database storage
        $data = [
            'name' => $request->input('name'),
            'employee_id' => $request->input('employeeId') ?? $request->input('employee_id'),
            'salary' => $request->input('salary'),
            'adjustment_amount' => $request->input('adjustmentAmount') ?? $request->input('adjustment_amount'),
            'adjustment_reason' => $request->input('adjustmentReason') ?? $request->input('adjustment_reason'),
            'after_adjustment_salary' => $request->input('afterAdjustmentSalary') ?? $request->input('after_adjustment_salary'),
            'status' => $databaseStatus,
        ];

        // Remove null values to only update provided fields
        $data = array_filter($data, function($value) {
            return $value !== null;
        });

        $request->merge($data);

        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'employee_id' => 'sometimes|required|string|max:255',
            'salary' => 'sometimes|required|numeric|min:0',
            'adjustment_amount' => 'nullable|numeric',
            'adjustment_reason' => 'nullable|string|max:255',
            'after_adjustment_salary' => 'sometimes|required|numeric|min:0',
            'status' => 'sometimes|required|in:pending,paid,unpaid,approved,rejected',
        ]);

        $employeeSalary->update($data);

        return new EmployeeSalaryResource($employeeSalary);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $employeeSalary = EmployeeSalaries::findOrFail($id);
        $employeeSalary->delete();

        return response()->json(['message' => 'Deleted successfully'], 200);
    }
}
