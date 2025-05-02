<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\StudentsModelController;
use App\Http\Controllers\PermissionsController;
use App\Http\Controllers\RolesController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public routes
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
});

// Protected routes
Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard route
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    // Profile routes
    Route::controller(ProfileController::class)->group(function () {
        Route::get('/profile', 'edit')->name('profile.edit');
        Route::patch('/profile', 'update')->name('profile.update');
        Route::delete('/profile', 'destroy')->name('profile.destroy');
    });

    // Admin routes
    Route::middleware(['role:admin'])->group(function () {
        // Users management
        Route::controller(UserController::class)
            ->prefix('users')
            ->name('users.')
            ->group(function () {
                Route::get('/', 'index')->name('index');
                Route::get('/create', 'create')->name('create');
                Route::post('/', 'store')->name('store');
                Route::get('/{user}/edit', 'edit')->name('edit');
                Route::put('/{user}', 'update')->name('update');
                Route::delete('/{user}', 'destroy')->name('destroy');
                Route::post('/{user}/permissions', 'updatePermissions')
                    ->name('permissions.update');
            });

        // Roles management
        Route::controller(RolesController::class)
            ->prefix('roles')
            ->name('roles.')
            ->group(function () {
                Route::get('/', 'index')->name('index');
                Route::get('/create', 'create')->name('create');
                Route::post('/', 'store')->name('store');
                Route::get('/{role}/edit', 'edit')->name('edit');
                Route::put('/{role}', 'update')->name('update');
                Route::delete('/{role}', 'destroy')->name('destroy');
            });

        // Permissions management
        Route::controller(PermissionsController::class)
            ->prefix('permissions')
            ->name('permissions.')
            ->group(function () {
                Route::get('/', 'index')->name('index');
                Route::get('/create', 'create')->name('create');
                Route::post('/', 'store')->name('store');
                Route::get('/{permission}/edit', 'edit')->name('edit');
                Route::put('/{permission}', 'update')->name('update');
                Route::delete('/{permission}', 'destroy')->name('destroy');
            });
    });

    // Staff and Admin routes
    Route::middleware(['role:admin|staff'])->group(function () {
        Route::controller(StudentsModelController::class)
            ->prefix('studentsdashboard')
            ->name('studentsdashboard.')
            ->group(function () {
                Route::get('/', 'index')->name('index');
                Route::post('/store', 'store')->name('store');
                Route::put('/{student}', 'update')->name('update');
                Route::delete('/{student}', 'destroy')->name('destroy');
            });
    });
});

require __DIR__.'/auth.php';