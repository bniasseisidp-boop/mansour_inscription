<?php

use App\Http\Controllers\Api\AnneeAcademiqueController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\FiliereController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    Route::middleware('role:admin,super_admin')->group(function () {
        Route::get('/admin/filieres', [FiliereController::class, 'index']);
        Route::get('/admin/filieres/{filiere}', [FiliereController::class, 'show']);
        Route::patch('/admin/filieres/{filiere}/statut', [FiliereController::class, 'updateStatut']);

        Route::get('/admin/annees-academiques', [AnneeAcademiqueController::class, 'index']);
    });

    Route::middleware('role:super_admin')->group(function () {
        Route::post('/admin/filieres', [FiliereController::class, 'store']);
        Route::put('/admin/filieres/{filiere}', [FiliereController::class, 'update']);
        Route::delete('/admin/filieres/{filiere}', [FiliereController::class, 'destroy']);

        Route::post('/admin/annees-academiques', [AnneeAcademiqueController::class, 'store']);
        Route::patch('/admin/annees-academiques/{anneeAcademique}/statut', [AnneeAcademiqueController::class, 'updateStatut']);
        Route::delete('/admin/annees-academiques/{anneeAcademique}', [AnneeAcademiqueController::class, 'destroy']);
    });
});
