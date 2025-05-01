<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class UserPermissionController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'verified']);
        $this->middleware('role:admin');
    }

    public function index()
    {
        return Inertia::render('UserPermissions/Index', [
            'users' => User::with(['roles', 'permissions'])->paginate(10),
            'roles' => Role::all(),
            'permissions' => Permission::all()
        ]);
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'roles' => 'array',
            'roles.*' => 'exists:roles,id',
            'permissions' => 'array',
            'permissions.*' => 'exists:permissions,id'
        ]);

        // Sync roles
        if (isset($validated['roles'])) {
            $user->syncRoles($validated['roles']);
        }

        // Sync permissions
        if (isset($validated['permissions'])) {
            $user->syncPermissions($validated['permissions']);
        }

        return back()->with('success', 'User permissions updated successfully');
    }

    public function assignRole(Request $request, User $user)
{
    $validated = $request->validate([
        'role' => 'required|exists:roles,name'
    ]);

    try {
        $user->assignRole($validated['role']);
        return back()->with('success', "Role '{$validated['role']}' assigned successfully to {$user->name}");
    } catch (\Exception $e) {
        return back()->with('error', 'Failed to assign role');
    }
}

public function removeRole(Request $request, User $user)
{
    $validated = $request->validate([
        'role' => 'required|exists:roles,name'
    ]);

    try {
        $user->removeRole($validated['role']);
        return back()->with('success', "Role '{$validated['role']}' removed from {$user->name}");
    } catch (\Exception $e) {
        return back()->with('error', 'Failed to remove role');
    }
}
}