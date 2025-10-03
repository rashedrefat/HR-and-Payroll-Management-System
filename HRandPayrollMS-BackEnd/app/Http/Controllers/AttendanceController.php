<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Shift;
use Illuminate\Http\Request;
use Carbon\Carbon;

class AttendanceController extends Controller
{
    // Get all attendance records (Admin only)
    public function index()
    {
        return response()->json(
            Attendance::with(['employee', 'shift'])->orderBy('date', 'desc')->get(),
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

        $attendances = Attendance::with('shift')
            ->where('employee_id', $employee->employee_id)
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
                'shift_id' => 'nullable|exists:shifts,id',
                'check_in_time' => 'nullable|regex:/^\d{1,2}:\d{2}\s?(AM|PM)$/i',
                'check_out_time' => 'nullable|regex:/^\d{1,2}:\d{2}\s?(AM|PM)$/i',
                'date' => 'required|date',
            ]);

            // Use provided shift or find employee's default shift
            $shiftId = $validated['shift_id'];
            if (!$shiftId) {
                $employee = \App\Models\Employee::where('employee_id', $validated['employee_id'])->first();
                $shiftId = $employee ? $employee->default_shift_id : null;
            }

            // Calculate attendance status based on shift
            $attendanceStatus = $this->calculateAttendanceStatus(
                $validated['check_in_time'],
                $validated['check_out_time'],
                $shiftId
            );

            $attendance = Attendance::create([
                'name' => $validated['name'],
                'employee_id' => $validated['employee_id'],
                'shift_id' => $validated['shift_id'],
                'check_in_time' => $validated['check_in_time'],
                'check_out_time' => $validated['check_out_time'],
                'date' => $validated['date'],
                'is_late' => $attendanceStatus['is_late'],
                'is_early_out' => $attendanceStatus['is_early_out'],
                'late_minutes' => $attendanceStatus['late_minutes'],
                'early_out_minutes' => $attendanceStatus['early_out_minutes'],
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
            'shift_id' => 'nullable|exists:shifts,id',
            'check_in_time' => 'nullable|regex:/^\d{1,2}:\d{2}\s?(AM|PM)$/i',
            'check_out_time' => 'nullable|regex:/^\d{1,2}:\d{2}\s?(AM|PM)$/i',
            'date' => 'required|date',
        ]);

        // Use provided shift or employee's default shift
        $shiftId = $validated['shift_id'] ?: $employee->default_shift_id;

        // Calculate attendance status based on shift
        $attendanceStatus = $this->calculateAttendanceStatus(
            $validated['check_in_time'],
            $validated['check_out_time'],
            $shiftId
        );

        // Automatically populate name and employee_id from authenticated user
        $attendance = Attendance::create([
            'name' => $employee->name,
            'employee_id' => $employee->employee_id,
            'shift_id' => $validated['shift_id'],
            'check_in_time' => $validated['check_in_time'],
            'check_out_time' => $validated['check_out_time'],
            'date' => $validated['date'],
            'is_late' => $attendanceStatus['is_late'],
            'is_early_out' => $attendanceStatus['is_early_out'],
            'late_minutes' => $attendanceStatus['late_minutes'],
            'early_out_minutes' => $attendanceStatus['early_out_minutes'],
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
                'has_employee_id' => $request->has('employee_id'),
                'date_value' => $request->input('date'),
                'check_in_time' => $request->input('check_in_time'),
                'check_out_time' => $request->input('check_out_time')
            ]);

            // Check if this is an admin request (contains name and employee_id)
            if ($request->has('name') && $request->has('employee_id')) {
                // Admin update - can update any record without authentication
                
                // Custom validation for time and date fields
                $request->validate([
                    'name' => 'required|string|max:255',
                    'employee_id' => 'required|string|max:50',
                    'shift_id' => 'nullable|exists:shifts,id',
                    'date' => 'required|date_format:Y-m-d',
                ]);

                // Handle time fields separately with custom validation
                $checkInTime = $request->input('check_in_time');
                $checkOutTime = $request->input('check_out_time');

                // Validate and convert 12-hour format to 24-hour format
                if ($checkInTime) {
                    $checkInTime = trim($checkInTime);
                    if (!preg_match('/^\d{1,2}:\d{2}\s?(AM|PM)$/i', $checkInTime)) {
                        return response()->json(['error' => 'Check in time must be in 12-hour format (e.g., 9:00 AM)'], 422);
                    }
                }
                
                if ($checkOutTime) {
                    $checkOutTime = trim($checkOutTime);
                    if (!preg_match('/^\d{1,2}:\d{2}\s?(AM|PM)$/i', $checkOutTime)) {
                        return response()->json(['error' => 'Check out time must be in 12-hour format (e.g., 5:00 PM)'], 422);
                    }
                }

                // Use provided shift or find employee's default shift
                $shiftId = $request->input('shift_id');
                if (!$shiftId) {
                    $employee = \App\Models\Employee::where('employee_id', $request->input('employee_id'))->first();
                    $shiftId = $employee ? $employee->default_shift_id : null;
                }

                // Calculate attendance status based on shift
                $attendanceStatus = $this->calculateAttendanceStatus(
                    $checkInTime,
                    $checkOutTime,
                    $shiftId
                );

                // Format times to H:i format (already cleaned above)
                $validated = [
                    'name' => $request->input('name'),
                    'employee_id' => $request->input('employee_id'),
                    'shift_id' => $shiftId,
                    'check_in_time' => $checkInTime,
                    'check_out_time' => $checkOutTime,
                    'date' => $request->input('date'),
                    'is_late' => $attendanceStatus['is_late'],
                    'is_early_out' => $attendanceStatus['is_early_out'],
                    'late_minutes' => $attendanceStatus['late_minutes'],
                    'early_out_minutes' => $attendanceStatus['early_out_minutes'],
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
            'shift_id' => 'nullable|exists:shifts,id',
            'check_in_time' => 'nullable|regex:/^\d{1,2}:\d{2}\s?(AM|PM)$/i',
            'check_out_time' => 'nullable|regex:/^\d{1,2}:\d{2}\s?(AM|PM)$/i',
            'date' => 'sometimes|date_format:Y-m-d',
        ]);

        // Use provided shift or employee's default shift
        $shiftId = $validated['shift_id'] ?? $employee->default_shift_id;

        // Calculate attendance status based on shift
        $attendanceStatus = $this->calculateAttendanceStatus(
            $validated['check_in_time'],
            $validated['check_out_time'],
            $shiftId
        );

        // Ensure name and employee_id remain from authenticated user
        $validated['shift_id'] = $shiftId;
        $validated['is_late'] = $attendanceStatus['is_late'];
        $validated['is_early_out'] = $attendanceStatus['is_early_out'];
        $validated['late_minutes'] = $attendanceStatus['late_minutes'];
        $validated['early_out_minutes'] = $attendanceStatus['early_out_minutes'];

        $attendance->update($validated);

        return response()->json([
            'message' => 'Attendance record updated successfully',
            'attendance' => $attendance
        ], 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::error('Attendance validation error:', [
                'errors' => $e->errors(),
                'message' => $e->getMessage()
            ]);
            
            return response()->json([
                'error' => 'Validation failed',
                'errors' => $e->errors(),
                'message' => $e->getMessage()
            ], 422);
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

    /**
     * Calculate late and early out status based on shift times
     */
    private function calculateAttendanceStatus($checkInTime, $checkOutTime, $shiftId)
    {
        $status = [
            'is_late' => false,
            'is_early_out' => false,
            'late_minutes' => 0,
            'early_out_minutes' => 0
        ];

        if (!$shiftId) {
            return $status;
        }

        $shift = Shift::find($shiftId);
        if (!$shift) {
            return $status;
        }

        // Check if employee is late
        if ($checkInTime) {
            // Convert 12-hour format to 24-hour for comparison
            if (preg_match('/^\d{1,2}:\d{2}\s?(AM|PM)$/i', $checkInTime)) {
                $checkIn = Carbon::createFromFormat('g:i A', $checkInTime);
            } else {
                $checkIn = Carbon::createFromFormat('H:i', $checkInTime);
            }
            
            // Get shift start time (stored as 24-hour in database but may need conversion)
            $shiftStartTime = $shift->getOriginal('check_in'); // Get raw database value
            if (strlen($shiftStartTime) > 5) {
                $shiftStart = Carbon::createFromFormat('H:i:s', $shiftStartTime);
            } else {
                $shiftStart = Carbon::createFromFormat('H:i', $shiftStartTime);
            }
            $graceTime = $shift->grace_time ?? 0; // Grace time in minutes
            
            $allowedCheckIn = $shiftStart->copy()->addMinutes($graceTime);
            
            if ($checkIn->gt($allowedCheckIn)) {
                $status['is_late'] = true;
                $status['late_minutes'] = $checkIn->diffInMinutes($shiftStart);
            }
        }

        // Check if employee left early
        if ($checkOutTime) {
            // Convert 12-hour format to 24-hour for comparison
            if (preg_match('/^\d{1,2}:\d{2}\s?(AM|PM)$/i', $checkOutTime)) {
                $checkOut = Carbon::createFromFormat('g:i A', $checkOutTime);
            } else {
                $checkOut = Carbon::createFromFormat('H:i', $checkOutTime);
            }
            
            // Get shift end time (stored as 24-hour in database but may need conversion)
            $shiftEndTime = $shift->getOriginal('check_out'); // Get raw database value
            if (strlen($shiftEndTime) > 5) {
                $shiftEnd = Carbon::createFromFormat('H:i:s', $shiftEndTime);
            } else {
                $shiftEnd = Carbon::createFromFormat('H:i', $shiftEndTime);
            }
            
            if ($checkOut->lt($shiftEnd)) {
                $status['is_early_out'] = true;
                $status['early_out_minutes'] = $shiftEnd->diffInMinutes($checkOut);
            }
        }

        return $status;
    }
}
