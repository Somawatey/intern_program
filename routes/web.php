<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\StudentsModelController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\PermissionsController;
use App\Http\Controllers\RolesController;
use Illuminate\Support\Facades\Auth;
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'auth' => [
            'user' => Auth::user(),
        ],
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard', [
        'auth' => [
            'user' => Auth::user()
        ]
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    // Profile routes
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Roles routes
    Route::prefix('roles')->group(function () {
        Route::get('/', [RolesController::class, 'index'])->name('roles.index');
        Route::get('/create', [RolesController::class, 'create'])->name('roles.create');
        Route::post('/', [RolesController::class, 'store'])->name('roles.store');
        Route::get('/{id}/edit', [RolesController::class, 'edit'])->name('roles.edit');
        Route::put('/{id}', [RolesController::class, 'update'])->name('roles.update');
        Route::delete('/{id}', [RolesController::class, 'destroy'])->name('roles.destroy');
    });

    // Permissions routes
    Route::prefix('permissions')->group(function () {
        Route::get('/', [PermissionsController::class, 'index'])->name('permissions.index');
        Route::post('/', [PermissionsController::class, 'store'])->name('permissions.store');
        Route::put('/{id}', [PermissionsController::class, 'update'])->name('permissions.update');
        Route::delete('/{id}', [PermissionsController::class, 'destroy'])->name('permissions.destroy');
    });
   
    // Students routes
    Route::prefix('studentsdashboard')->group(function () {
        Route::get('/', [StudentsModelController::class, 'index'])->name('studentsdashboard.index');
        Route::post('/store', [StudentsModelController::class, 'store'])->name('studentsdashboard.store');
        Route::patch('/update/{id}', [StudentsModelController::class, 'update'])->name('studentsdashboard.update');
        Route::delete('/delete/{id}', [StudentsModelController::class, 'destroy'])->name('studentsdashboard.destroy');
    });

});



require __DIR__.'/auth.php';
