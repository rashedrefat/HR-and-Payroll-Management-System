<?php

namespace App\Http\Controllers;

use App\Models\LeaveRequest;
use Illuminate\Http\Request;

class LeaveRequestController extends Controller
{
    // Get all leave requests
    public function index()
    {
        return response()->json(
            LeaveRequest::with(['employee'])->get(),
            200
        );
    }

    // Store new leave request
    public function store(Request $request)
    {
        $user = $request->user();
        
        if (!$user) {
            return response()->json(['error' => 'User not authenticated'], 401);
        }

        $employee = \App\Models\Employee::where('email', $user->email)->first();
        
        if (!$employee) {
            return response()->json(['error' => 'Employee record not found'], 404);
        }

        $validated = $request->validate([
            'leave_type' => 'required|string|max:100',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'reason' => 'nullable|string|max:500',
        ]);

        $startDate = new \Carbon\Carbon($validated['start_date']);
        $endDate = new \Carbon\Carbon($validated['end_date']);
        $days = $startDate->diffInDays($endDate) + 1;

        $leaveRequest = LeaveRequest::create([
            'name' => $employee->name,
            'employee_id' => $employee->id,
            'leave_type' => $validated['leave_type'],
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'],
            'days' => $days,
            'status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Leave request created successfully',
            'leave_request' => $leaveRequest
        ], 201);
    }

    // Show one leave request
    public function show($id)
    {
        $leaveRequest = LeaveRequest::with(['employee'])->findOrFail($id);
        return response()->json($leaveRequest, 200);
    }

    // Update leave request
    public function update(Request $request, $id)
    {
        $user = $request->user();
        
        if (!$user) {
            return response()->json(['error' => 'User not authenticated'], 401);
        }

        $employee = \App\Models\Employee::where('email', $user->email)->first();
        
        if (!$employee) {
            return response()->json(['error' => 'Employee record not found'], 404);
        }

        $leaveRequest = LeaveRequest::where('id', $id)
            ->where('employee_id', $employee->id)
            ->where('status', 'pending')
            ->firstOrFail();

        $validated = $request->validate([
            'leave_type' => 'required|string|max:100',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'reason' => 'nullable|string|max:500',
        ]);

        $startDate = new \Carbon\Carbon($validated['start_date']);
        $endDate = new \Carbon\Carbon($validated['end_date']);
        $days = $startDate->diffInDays($endDate) + 1;

        $leaveRequest->update([
            'leave_type' => $validated['leave_type'],
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'],
            'days' => $days,
        ]);

        return response()->json([
            'message' => 'Leave request updated successfully',
            'leave_request' => $leaveRequest
        ]);
    }

    // Delete leave request
    public function destroy(Request $request, $id)
    {
        $user = $request->user();
        
        if (!$user) {
            return response()->json(['error' => 'User not authenticated'], 401);
        }

        $employee = \App\Models\Employee::where('email', $user->email)->first();
        
        if (!$employee) {
            return response()->json(['error' => 'Employee record not found'], 404);
        }

        $leaveRequest = LeaveRequest::where('id', $id)
            ->where('employee_id', $employee->id)
            ->where('status', 'pending')
            ->firstOrFail();

        $leaveRequest->delete();

        return response()->json(['message' => 'Leave request deleted successfully']);
    }

    // Update leave request status (Admin only)
    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,approved,rejected'
        ]);

        $leaveRequest = LeaveRequest::findOrFail($id);
        $leaveRequest->status = $validated['status'];
        $leaveRequest->save();

        return response()->json([
            'message' => 'Leave request status updated successfully',
            'leave_request' => $leaveRequest
        ]);
    }
}
