<?php

namespace App\Http\Controllers;

use App\Models\Departments;
use Illuminate\Http\Request;

class DepartmentsController extends Controller
{
    // Get all departments
    public function index()
    {
        return response()->json(Departments::all(), 200);
    }

    // Store new department
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:departments,name',
            'description' => 'nullable|string',
            'status' => 'boolean',
        ]);

        $department = Departments::create($validated);

        return response()->json($department, 201);
    }

    // Show single department
    public function show($id)
    {
        $department = Departments::findOrFail($id);
        return response()->json($department, 200);
    }

    // Update department
    public function update(Request $request, $id)
    {
        $department = Departments::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255|unique:departments,name,' . $id,
            'description' => 'nullable|string',
            'status' => 'boolean',
        ]);

        $department->update($validated);

        return response()->json($department, 200);
    }

    // Delete department
    public function destroy($id)
    {
        $department = Departments::findOrFail($id);
        $department->delete();

        return response()->json(['message' => 'Department deleted successfully'], 200);
    }
}
