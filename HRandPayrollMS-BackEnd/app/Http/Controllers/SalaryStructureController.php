<?php

namespace App\Http\Controllers;

use App\Models\SalaryStructure;
use Illuminate\Http\Request;

class SalaryStructureController extends Controller
{
    // Get all salary structures
    public function index()
    {
        return response()->json(SalaryStructure::all(), 200);
    }

    // Store a new salary structure
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'percentage' => 'required|integer|min:0|max:100',
        ]);

        $salaryStructure = SalaryStructure::create($request->all());

        return response()->json($salaryStructure, 201);
    }

    // Show a single salary structure
    public function show($id)
    {
        $salaryStructure = SalaryStructure::findOrFail($id);
        return response()->json($salaryStructure, 200);
    }

    // Update a salary structure
    public function update(Request $request, $id)
    {
        $salaryStructure = SalaryStructure::findOrFail($id);

        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'percentage' => 'sometimes|required|integer|min:0|max:100',
        ]);

        $salaryStructure->update($request->all());

        return response()->json($salaryStructure, 200);
    }

    // Delete a salary structure
    public function destroy($id)
    {
        $salaryStructure = SalaryStructure::findOrFail($id);
        $salaryStructure->delete();

        return response()->json(['message' => 'Deleted successfully'], 200);
    }
}
