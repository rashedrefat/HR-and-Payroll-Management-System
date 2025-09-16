<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use Illuminate\Http\Request;

class AttendanceController extends Controller
{
    // Get all attendance records (Admin only)
    public function index()
    {
        return response()->json(
            Attendance::with(['employee'])->orderBy('date', 'desc')->get(),
            200
        );
    }

    // Get attendance records for authenticated employee only
    public function myAttendances(Request $request)
    {
        $user = $request->user();
        
        if (!$user) {
            return response()->json(['error' => 'User not authenticated'], 401);
        }

        $employee = \App\Models\Employee::where('email', $user->email)->first();
        
        if (!$employee) {
            return response()->json(['error' => 'Employee record not found'], 404);
        }

        $attendances = Attendance::where('employee_id', $employee->employee_id)
            ->orderBy('date', 'desc')
            ->get();

        return response()->json($attendances, 200);
    }

    // Store new attendance record
    public function store(Request $request)
    {
        // Check if this is an admin request (contains name and employee_id)
        if ($request->has('name') && $request->has('employee_id')) {
            // Admin store - no authentication required for name/employee_id
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'employee_id' => 'required|string|max:50',
                'check_in_time' => 'nullable|date_format:H:i',
                'check_out_time' => 'nullable|date_format:H:i',
                'reason_for_late' => 'nullable|string|max:255',
                'date' => 'required|date',
                'early_out_reason' => 'nullable|string|max:255',
            ]);

            $attendance = Attendance::create([
                'name' => $validated['name'],
                'employee_id' => $validated['employee_id'],
                'check_in_time' => $validated['check_in_time'],
                'check_out_time' => $validated['check_out_time'],
                'reason_for_late' => $validated['reason_for_late'] ?: '--',
                'date' => $validated['date'],
                'early_out_reason' => $validated['early_out_reason'] ?: '--',
            ]);

            return response()->json([
                'message' => 'Attendance record created successfully',
                'attendance' => $attendance
            ], 201);
        }

        // Employee store - requires authentication
        $user = $request->user();
        
        if (!$user) {
            return response()->json(['error' => 'User not authenticated'], 401);
        }

        $employee = \App\Models\Employee::where('email', $user->email)->first();
        
        if (!$employee) {
            return response()->json(['error' => 'Employee record not found'], 404);
        }

        $validated = $request->validate([
            'check_in_time' => 'nullable|date_format:H:i',
            'check_out_time' => 'nullable|date_format:H:i',
            'reason_for_late' => 'nullable|string|max:255',
            'date' => 'required|date',
            'early_out_reason' => 'nullable|string|max:255',
        ]);

        // Automatically populate name and employee_id from authenticated user
        $attendance = Attendance::create([
            'name' => $employee->name,
            'employee_id' => $employee->employee_id,
            'check_in_time' => $validated['check_in_time'],
            'check_out_time' => $validated['check_out_time'],
            'reason_for_late' => $validated['reason_for_late'] ?: '--',
            'date' => $validated['date'],
            'early_out_reason' => $validated['early_out_reason'] ?: '--',
        ]);

        return response()->json([
            'message' => 'Attendance record created successfully',
            'attendance' => $attendance
        ], 201);
    }

    public function show($id)
    {
        return response()->json(Attendance::findOrFail($id));
    }

    // Update attendance record
    public function update(Request $request, $id)
    {
        try {
            $attendance = Attendance::findOrFail($id);

            // Log the incoming request for debugging
            \Log::info('Attendance update request:', [
                'id' => $id,
                'request_data' => $request->all(),
                'has_name' => $request->has('name'),
                'has_employee_id' => $request->has('employee_id')
            ]);

            // Check if this is an admin request (contains name and employee_id)
            if ($request->has('name') && $request->has('employee_id')) {
                // Admin update - can update any record without authentication
                
                // Custom validation for time fields to handle both H:i and H:i:s formats
                $request->validate([
                    'name' => 'required|string|max:255',
                    'employee_id' => 'required|string|max:50',
                    'reason_for_late' => 'nullable|string|max:255',
                    'date' => 'required|date',
                    'early_out_reason' => 'nullable|string|max:255',
                ]);

                // Handle time fields separately with custom validation
                $checkInTime = $request->input('check_in_time');
                $checkOutTime = $request->input('check_out_time');

                // Validate and format time fields
                if ($checkInTime && !preg_match('/^\d{2}:\d{2}(:\d{2})?$/', $checkInTime)) {
                    return response()->json(['error' => 'Check in time must be in H:i or H:i:s format'], 422);
                }
                if ($checkOutTime && !preg_match('/^\d{2}:\d{2}(:\d{2})?$/', $checkOutTime)) {
                    return response()->json(['error' => 'Check out time must be in H:i or H:i:s format'], 422);
                }

                // Format times to H:i format (remove seconds if present)
                $validated = [
                    'name' => $request->input('name'),
                    'employee_id' => $request->input('employee_id'),
                    'check_in_time' => $checkInTime ? substr($checkInTime, 0, 5) : null,
                    'check_out_time' => $checkOutTime ? substr($checkOutTime, 0, 5) : null,
                    'reason_for_late' => $request->input('reason_for_late') ?: '--',
                    'date' => $request->input('date'),
                    'early_out_reason' => $request->input('early_out_reason') ?: '--',
                ];

                \Log::info('Admin update validated data:', $validated);

                $attendance->update($validated);

                return response()->json([
                    'message' => 'Attendance record updated successfully',
                    'attendance' => $attendance
                ], 200);
            }

        // Employee update - requires authentication and ownership
        $user = $request->user();
        
        if (!$user) {
            return response()->json(['error' => 'User not authenticated'], 401);
        }

        $employee = \App\Models\Employee::where('email', $user->email)->first();
        
        if (!$employee) {
            return response()->json(['error' => 'Employee record not found'], 404);
        }

        // Check if this attendance record belongs to the authenticated employee
        if ($attendance->employee_id !== $employee->employee_id) {
            return response()->json(['error' => 'Unauthorized to update this attendance record'], 403);
        }

        $validated = $request->validate([
            'check_in_time' => 'nullable|date_format:H:i',
            'check_out_time' => 'nullable|date_format:H:i',
            'reason_for_late' => 'nullable|string|max:255',
            'date' => 'sometimes|date',
            'early_out_reason' => 'nullable|string|max:255',
        ]);

        // Ensure name and employee_id remain from authenticated user
        $validated['reason_for_late'] = $validated['reason_for_late'] ?: '--';
        $validated['early_out_reason'] = $validated['early_out_reason'] ?: '--';

        $attendance->update($validated);

        return response()->json([
            'message' => 'Attendance record updated successfully',
            'attendance' => $attendance
        ], 200);
        } catch (\Exception $e) {
            \Log::error('Attendance update error:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'error' => 'Failed to update attendance record',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    // Delete attendance record
    public function destroy(Request $request, $id)
    {
        $attendance = Attendance::findOrFail($id);

        // Check if this is a request from admin portal or authenticated employee
        $user = $request->user();
        
        if (!$user) {
            // Admin delete - no authentication required
            $attendance->delete();
            return response()->json(['message' => 'Attendance record deleted successfully'], 200);
        }

        // Employee delete - requires authentication and ownership
        $employee = \App\Models\Employee::where('email', $user->email)->first();
        
        if (!$employee) {
            return response()->json(['error' => 'Employee record not found'], 404);
        }

        // Check if this attendance record belongs to the authenticated employee
        if ($attendance->employee_id !== $employee->employee_id) {
            return response()->json(['error' => 'Unauthorized to delete this attendance record'], 403);
        }

        $attendance->delete();

        return response()->json(['message' => 'Attendance record deleted successfully'], 200);
    }
}
