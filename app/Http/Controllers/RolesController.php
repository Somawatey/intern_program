<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Inertia\Inertia;

class RolesController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'role:admin']);
    }

    public function index()
    {
        return Inertia::render('Roles/Index', [
            'roles' => Role::with('permissions')->get()
        ]);
    }

    public function create()
    {
        return Inertia::render('Roles/Create', [
            'permissions' => Permission::all()
        ]);
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|unique:roles,name',
                'permissions' => 'array'
            ]);
    
            $role = Role::create(['name' => $validated['name']]);
    
            if (isset($validated['permissions'])) {
                $role->syncPermissions($validated['permissions']);
            }
    
            return redirect()->route('roles.index')
                ->with('success', 'Role created successfully');
        } catch (\Exception $e) {
            Log::error('Error creating role: ' . $e->getMessage());
            return back()->with('error', 'Failed to create role');
        }
    }
    public function edit(Role $role)
    {
        return Inertia::render('roles/Edit', [
            'role' => $role->load('permissions'),
            'permissions' => Permission::all()
        ]);
    }

    public function update(Request $request, Role $role)
    {
        $validated = $request->validate([
            'name' => 'required|unique:roles,name,' . $role->id,
            'permissions' => 'array'
        ]);

        $role->update(['name' => $validated['name']]);

        if (isset($validated['permissions'])) {
            $role->syncPermissions($validated['permissions']);
        }

        return back()->with('success', 'Role updated successfully');
    }

    public function destroy(Role $role)
    {
        if ($role->name === 'admin') {
            return back()->with('error', 'Cannot delete admin role');
        }

        $role->delete();
        return back()->with('success', 'Role deleted successfully');
    }
}