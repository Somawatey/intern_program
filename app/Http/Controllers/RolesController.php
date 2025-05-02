<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class RolesController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'role:admin']);
    }

    public function index()
    {
        try {
            return Inertia::render('Roles/Index', [
                'roles' => Role::with('permissions')->latest()->get(),
                'can' => [
                    'create' => auth()->user()->can('create roles'),
                    'edit' => auth()->user()->can('edit roles'),
                    'delete' => auth()->user()->can('delete roles'),
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Error loading roles: ' . $e->getMessage());
            return back()->with('error', 'Error loading roles');
        }
    }

    public function create()
    {
        try {
            return Inertia::render('Roles/Create', [
                'permissions' => Permission::all(),
                'can' => [
                    'create' => auth()->user()->can('create roles'),
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Error loading create role form: ' . $e->getMessage());
            return back()->with('error', 'Error loading create form');
        }
    }

    public function store(Request $request)
{
    try {
        $validated = $request->validate([
            'name' => 'required|unique:roles,name',
            'permissions' => 'array'
        ]);

        $role = Role::create(['name' => $validated['name']]);
        
        if(!empty($validated['permissions'])) {
            $role->syncPermissions($validated['permissions']);
        }

        return redirect()->route('roles.index')
                        ->with('success', 'Role created successfully');
    } catch (\Exception $e) {
        return back()->withErrors(['error' => 'Failed to create role'])
                     ->withInput();
    }
}
public function update(Request $request, Role $role)
{
    try {
        if ($role->name === 'admin') {
            return redirect()->back()->with('error', 'Cannot modify admin role');
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:roles,name,' . $role->id],
            'permissions' => ['array'],
            'permissions.*' => ['exists:permissions,id']
        ]);

        $role->update(['name' => $validated['name']]);
        $role->syncPermissions($validated['permissions'] ?? []);

        return redirect()->route('roles.index')->with('success', 'Role updated successfully');

    } catch (\Exception $e) {
        Log::error('Error updating role: ' . $e->getMessage());
        return back()->withErrors(['error' => 'Failed to update role'])->withInput();
    }
}

public function edit(Role $role)
{
    try {
        return Inertia::render('Roles/Edit', [
            'role' => [
                'id' => $role->id,
                'name' => $role->name,
                'permissions' => $role->permissions->pluck('id'),  // Changed this line
            ],
            'allPermissions' => Permission::all(),  // Changed this line
            'can' => [
                'edit' => auth()->user()->can('edit roles'),
            ]
        ]);
    } catch (\Exception $e) {
        Log::error('Error loading role edit form: ' . $e->getMessage());
        return back()->with('error', 'Error loading edit form');
    }
}

    public function destroy(Role $role)
    {
        try {
            if ($role->name === 'admin') {
                return back()->with('error', 'Cannot delete admin role');
            }

            if ($role->users()->exists()) {
                return back()->with('error', 'Cannot delete role with assigned users');
            }

            $role->delete();
            return back()->with('success', 'Role deleted successfully');
        } catch (\Exception $e) {
            Log::error('Error deleting role: ' . $e->getMessage());
            return back()->with('error', 'Failed to delete role');
        }
    }
}