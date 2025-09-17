<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\EmployeeSalaries;
use Illuminate\Http\Request;

class EmployeeSalariesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(EmployeeSalaries::all(), 200);
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
        $request->validate([
            'name' => 'required|string|max:255',
            'employee_id' => 'required|string|max:255',
            'salary' => 'required|numeric|min:0',
            'adjustment_amount' => 'nullable|numeric',
            'adjustment_reason' => 'nullable|string|max:255',
            'after_adjustment_salary' => 'required|numeric|min:0',
            'status' => 'required|in:pending,paid,unpaid',
        ]);

        $employeeSalary = EmployeeSalaries::create($request->all());

        return response()->json($employeeSalary, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return response()->json(EmployeeSalaries::findOrFail($id), 200);
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

        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'employee_id' => 'sometimes|required|string|max:255',
            'salary' => 'sometimes|required|numeric|min:0',
            'adjustment_amount' => 'nullable|numeric',
            'adjustment_reason' => 'nullable|string|max:255',
            'after_adjustment_salary' => 'sometimes|required|numeric|min:0',
            'status' => 'sometimes|required|in:pending,paid,unpaid',
        ]);

        $employeeSalary->update($request->all());

        return response()->json($employeeSalary, 200);
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
