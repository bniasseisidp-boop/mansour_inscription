<?php

use App\Http\Controllers\Api\AuthController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Route de test pour vérifier la protection par rôle (Phase 1).
    // Sera remplacée par de vraies routes admin dans les phases suivantes.
    Route::middleware('role:admin,super_admin')->get('/admin/ping', function () {
        return response()->json(['message' => 'Accès admin confirmé.']);
    });
});
