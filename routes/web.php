<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\StudentsModelController;
use App\Http\Controllers\PermissionsController;
use App\Http\Controllers\RolesController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\UserPermissionController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

// Public routes
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
});

Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard route

    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

        // Profile routes
        Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
        Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    // Admin routes
    Route::middleware(['role:admin'])->group(function () {
        // Users routes
        Route::prefix('users')->group(function () {
            Route::get('/', [UserController::class, 'index'])->name('users.index');
            Route::get('/create', [UserController::class, 'create'])->name('users.create');
            Route::post('/', [UserController::class, 'store'])->name('users.store');
            Route::get('/{user}/edit', [UserController::class, 'edit'])->name('users.edit');
            Route::put('/{user}', [UserController::class, 'update'])->name('users.update');
            Route::delete('/{user}', [UserController::class, 'destroy'])->name('users.destroy');
            Route::post('/{user}/permissions', [UserController::class, 'updatePermissions'])
                ->name('users.permissions.update');
        });

        // Roles routes
        Route::prefix('roles')->group(function () {
            Route::get('/', [RolesController::class, 'index'])->name('roles.index');
            Route::get('/create', [RolesController::class, 'create'])->name('roles.create');
            Route::post('/', [RolesController::class, 'store'])->name('roles.store');
            Route::get('/{role}/edit', [RolesController::class, 'edit'])->name('roles.edit');
            Route::put('/{role}', [RolesController::class, 'update'])->name('roles.update');
            Route::delete('/{role}', [RolesController::class, 'destroy'])->name('roles.destroy');
        });

        // Permissions routes
        Route::prefix('permissions')->group(function () {
            Route::get('/', [PermissionsController::class, 'index'])->name('permissions.index');
            Route::get('/create', [PermissionsController::class, 'create'])->name('permissions.create');
            Route::post('/', [PermissionsController::class, 'store'])->name('permissions.store');
            Route::get('/{permission}/edit', [PermissionsController::class, 'edit'])->name('permissions.edit');
            Route::put('/{permission}', [PermissionsController::class, 'update'])->name('permissions.update');
            Route::delete('/{permission}', [PermissionsController::class, 'destroy'])->name('permissions.destroy');
        });
    });

    // Staff and Admin routes
    Route::middleware(['role:admin|staff'])->group(function () {
        Route::prefix('studentsdashboard')->group(function () {
            Route::get('/', [StudentsModelController::class, 'index'])->name('studentsdashboard.index');
            Route::get('/create', [StudentsModelController::class, 'create'])->name('studentsdashboard.create');
            Route::post('/', [StudentsModelController::class, 'store'])->name('studentsdashboard.store');
            Route::get('/{student}/edit', [StudentsModelController::class, 'edit'])->name('studentsdashboard.edit');
            Route::put('/{student}', [StudentsModelController::class, 'update'])->name('studentsdashboard.update');
            Route::delete('/{student}', [StudentsModelController::class, 'destroy'])->name('studentsdashboard.destroy');
        });
    });
});

require __DIR__.'/auth.php';



