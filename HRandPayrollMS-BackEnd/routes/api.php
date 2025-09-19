<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Setting\GeneralSettingController;
use App\Http\Controllers\DepartmentsController;
use App\Http\Controllers\DesignationsController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\LeaveRequestController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\SalaryStructureController;
use App\Http\Controllers\EmployeeSalariesController;
use App\Http\Controllers\IncrementController;


//Route
Route::get('/generalsetting', [GeneralSettingController::class, 'index']);
Route::post('/generalsetting', [GeneralSettingController::class, 'setting']);

// Company Settings Routes
Route::prefix('company')->group(function () {
    Route::get('/', [GeneralSettingController::class, 'index']);
    Route::post('/', [GeneralSettingController::class, 'updateCompany']);
    Route::post('/hr', [GeneralSettingController::class, 'updateHR']);
});

// General Settings Routes
Route::prefix('settings')->group(function () {
    Route::get('general', [GeneralSettingController::class, 'index']);
    Route::post('general', [GeneralSettingController::class, 'setting']);
});

// Departments Routes
Route::apiResource('departments', DepartmentsController::class);

// Designations Routes
Route::apiResource('designations', DesignationsController::class);

// Employees Routes
Route::apiResource('employees', EmployeeController::class);
Route::middleware('auth:sanctum')->get('employee/profile', [EmployeeController::class, 'profile']);

// Leave Requests Routes
Route::get('leave-requests', [LeaveRequestController::class, 'index']); // Admin: Get all leave requests
Route::middleware('auth:sanctum')->group(function () {
    Route::get('my-leave-requests', [LeaveRequestController::class, 'myLeaveRequests']); // Employee: Get own leave requests
    Route::post('leave-requests', [LeaveRequestController::class, 'store']);
    Route::put('leave-requests/{id}', [LeaveRequestController::class, 'update']);
    Route::delete('leave-requests/{id}', [LeaveRequestController::class, 'destroy']);
    Route::patch('leave-requests/{id}/status', [LeaveRequestController::class, 'updateStatus']);
});


// Attendance Routes
Route::get('attendances', [AttendanceController::class, 'index']); // Admin: Get all attendances
Route::post('attendances', [AttendanceController::class, 'store']); // Admin create (no auth)
Route::put('attendances/{id}', [AttendanceController::class, 'update']); // Admin update (no auth)
Route::delete('attendances/{id}', [AttendanceController::class, 'destroy']); // Admin delete (no auth)

Route::middleware('auth:sanctum')->group(function () {
    Route::get('my-attendances', [AttendanceController::class, 'myAttendances']); // Employee: Get own attendances
    Route::post('my-attendances', [AttendanceController::class, 'store']); // Employee: Create attendance
    Route::put('my-attendances/{id}', [AttendanceController::class, 'update']); // Employee: Update own attendance
    Route::delete('my-attendances/{id}', [AttendanceController::class, 'destroy']); // Employee: Delete own attendance
});

// Salary Structure Routes
Route::apiResource('salary-structures', SalaryStructureController::class);

// Employee Salaries Routes
Route::apiResource('employee-salaries', EmployeeSalariesController::class);

// Increment Routes
Route::apiResource('increments', IncrementController::class);