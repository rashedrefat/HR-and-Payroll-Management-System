<?php

namespace App\Http\Controllers;

use App\Models\LeaveType;
use Illuminate\Http\Request;

class LeaveTypeController extends Controller
{
    // Get all leave types
    public function index()
    {
        return response()->json(LeaveType::all());
    }

    // Create new leave type
    public function store(Request $request)
    {
        $request->validate([
            'leave_type' => 'required|string|max:255',
            'days' => 'required|integer|min:1',
        ]);

        $leaveType = LeaveType::create($request->all());
        return response()->json($leaveType, 201);
    }

    // Show single leave type
    public function show($id)
    {
        $leaveType = LeaveType::findOrFail($id);
        return response()->json($leaveType);
    }

    // Update leave type
    public function update(Request $request, $id)
    {
        $request->validate([
            'leave_type' => 'string|max:255',
            'days' => 'integer|min:1',
        ]);

        $leaveType = LeaveType::findOrFail($id);
        $leaveType->update($request->all());
        return response()->json($leaveType);
    }

    // Delete leave type
    public function destroy($id)
    {
        $leaveType = LeaveType::findOrFail($id);
        $leaveType->delete();
        return response()->json(['message' => 'Leave type deleted successfully']);
    }
}
