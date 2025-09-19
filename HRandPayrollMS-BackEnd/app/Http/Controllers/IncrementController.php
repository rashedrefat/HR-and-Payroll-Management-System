<?php

namespace App\Http\Controllers;

use App\Models\Increment;
use Illuminate\Http\Request;

class IncrementController extends Controller
{
    // GET /api/increments
    public function index()
    {
        // eager load employee so response includes name, email, employee_id(code), joining_date, etc.
        return response()->json(Increment::with('employee')->get(), 200);
    }

    // POST /api/increments
    public function store(Request $request)
    {
        $validated = $request->validate([
            // this checks numeric PK `employees.id`
            'employee_id' => 'required|exists:employees,id',
            'salary' => 'required|numeric',
            'last_increment_date' => 'nullable|date',
        ]);

        $increment = Increment::create($validated);

        return response()->json($increment->load('employee'), 201);
    }

    // GET /api/increments/{id}
    public function show($id)
    {
        $increment = Increment::with('employee')->findOrFail($id);
        return response()->json($increment, 200);
    }

    // PUT or PATCH /api/increments/{id}
    public function update(Request $request, $id)
    {
        $increment = Increment::findOrFail($id);

        $validated = $request->validate([
            'salary' => 'sometimes|required|numeric',
            'last_increment_date' => 'nullable|date',
        ]);

        $increment->update($validated);

        return response()->json($increment->load('employee'), 200);
    }

    // DELETE /api/increments/{id}
    public function destroy($id)
    {
        $increment = Increment::findOrFail($id);
        $increment->delete();

        return response()->json(['message' => 'Increment deleted successfully'], 200);
    }
}
