<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Setting\GeneralSettingController;
use App\Http\Controllers\DepartmentsController;
use App\Http\Controllers\DesignationsController;
use App\Http\Controllers\EmployeeController;


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