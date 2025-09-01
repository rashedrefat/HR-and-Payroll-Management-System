<?php

use App\Http\Controllers\System\SystemLogController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'role:hrms_owner'])->prefix('admin')->group(function () {
    Route::get('/system-logs/notifications', [SystemLogController::class, 'adminNotifications']);
    Route::post('/system-logs/mark-seen', [SystemLogController::class, 'markAllAsSeen']);
});

Route::middleware(['auth:sanctum', 'role_or_permission:super_admin|hrms_owner'])->prefix('admin')->group(function () {
    Route::get('/tenant/system-logs', [SystemLogController::class, 'systemLogForTenant']);
});
