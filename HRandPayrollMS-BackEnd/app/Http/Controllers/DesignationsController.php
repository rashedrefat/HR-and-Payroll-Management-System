<?php

namespace App\Http\Controllers;

use App\Models\Designations;
use Illuminate\Http\Request;

class DesignationsController extends Controller
{
    // Get all designations with department name
    public function index()
    {
        return response()->json(
            Designations::with('department')->get(),
            200
        );
    }

    // Store new designation
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255|unique:designations,title',
            'description' => 'nullable|string',
            'status' => 'boolean',
            'department_id' => 'required|exists:departments,id',
        ]);

        $designation = Designations::create($validated);

        return response()->json($designation->load('department'), 201);
    }

    // Show one designation
    public function show($id)
    {
        $designation = Designations::with('department')->findOrFail($id);
        return response()->json($designation, 200);
    }

    // Update designation
    public function update(Request $request, $id)
    {
        $designation = Designations::findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255|unique:designations,title,' . $id,
            'description' => 'nullable|string',
            'status' => 'boolean',
            'department_id' => 'sometimes|exists:departments,id',
        ]);

        $designation->update($validated);

        return response()->json($designation->load('department'), 200);
    }

    // Delete designation
    public function destroy($id)
    {
        $designation = Designations::findOrFail($id);
        $designation->delete();

        return response()->json(['message' => 'Designation deleted successfully'], 200);
    }
}
