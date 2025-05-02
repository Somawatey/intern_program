<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'role:admin']);
    }

    public function index()
    {
        return Inertia::render('Users/Index', [
            'users' => User::with('roles', 'permissions')->get(),
            'roles' => Role::all(),
            'can' => [
                'create' => Auth::user()->can('create users'),
                'edit' => Auth::user()->can('edit users'),
                'delete' => Auth::user()->can('delete users'),
                'view' => Auth::user()->can('view users'),
            ]
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|exists:roles,id',
         
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password'])
        ]);

        $role = Role::findById($validated['role']);  // Get role by ID
        $user->assignRole($role);


        return back()->with('success', 'User created successfully');
    }

    public function update(Request $request, User $user)
{
    try {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:8',
            'role' => 'sometimes|required|exists:roles,id',
          
        ]);

        $user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => $validated['password'] ? Hash::make($validated['password']) : $user->password
        ]);

        if (isset($validated['role'])) {
            $user->syncRoles([$validated['role']]);
        }

        return back()->with('success', 'User updated successfully');
    } catch (\Exception $e) {
        Log::error('Error updating user: ' . $e->getMessage());
        return back()->with('error', 'Failed to update user');
    }
}
    public function updatePermissions(Request $request, User $user)
    {
        $validated = $request->validate([
            'permissions' => 'required|array',
            'permissions.*' => 'in:view students,create students,edit students,delete students'
        ]);

        $user->syncPermissions($validated['permissions']);

        return back()->with('success', 'User permissions updated successfully');
    }

    public function destroy(User $user)
    {
        if ($user->hasRole('admin') && User::role('admin')->count() === 1) {
            return back()->with('error', 'Cannot delete the last admin user');
        }

        $user->delete();
        return back()->with('success', 'User deleted successfully');
    }
}