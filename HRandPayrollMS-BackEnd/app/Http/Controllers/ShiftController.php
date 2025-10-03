<?php

namespace App\Http\Controllers;

use App\Models\Shift;
use Illuminate\Http\Request;

class ShiftController extends Controller
{
    // GET all shifts
    public function index()
    {
        return response()->json(Shift::all(), 200);
    }

    // GET single shift
    public function show($id)
    {
        $shift = Shift::find($id);
        if (!$shift) {
            return response()->json(['message' => 'Shift not found'], 404);
        }
        return response()->json($shift, 200);
    }

    // CREATE shift
    public function store(Request $request)
    {
        $validated = $request->validate([
            'shift_name' => 'required|string|max:255',
            'type' => 'nullable|string|max:255',
            'check_in' => 'required|regex:/^\d{1,2}:\d{2}\s?(AM|PM)$/i',
            'check_out' => 'required|regex:/^\d{1,2}:\d{2}\s?(AM|PM)$/i',
            'grace_time' => 'nullable|integer|min:0',
            'working_days' => 'required|array',
            'weekends' => 'nullable|array',
            'status' => 'boolean',
        ]);

        $shift = Shift::create($validated);
        return response()->json($shift, 201);
    }

    // UPDATE shift
    public function update(Request $request, $id)
    {
        $shift = Shift::find($id);
        if (!$shift) {
            return response()->json(['message' => 'Shift not found'], 404);
        }

        $validated = $request->validate([
            'shift_name' => 'sometimes|string|max:255',
            'type' => 'sometimes|string|max:255',
            'check_in' => 'sometimes|regex:/^\d{1,2}:\d{2}\s?(AM|PM)$/i',
            'check_out' => 'sometimes|regex:/^\d{1,2}:\d{2}\s?(AM|PM)$/i',
            'grace_time' => 'sometimes|integer|min:0',
            'working_days' => 'sometimes|array',
            'weekends' => 'sometimes|array',
            'status' => 'sometimes|boolean',
        ]);

        $shift->update($validated);
        return response()->json($shift, 200);
    }

    // DELETE shift
    public function destroy($id)
    {
        $shift = Shift::find($id);
        if (!$shift) {
            return response()->json(['message' => 'Shift not found'], 404);
        }

        $shift->delete();
        return response()->json(['message' => 'Shift deleted successfully'], 200);
    }
}
