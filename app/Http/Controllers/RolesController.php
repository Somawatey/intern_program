<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Auth;

class RolesController extends Controller
{
    public function index()
    {
        $roles = Role::paginate(10);

        return Inertia::render('roles/index', [
            'auth' => [
            'user' => Auth::user(),
        ],
            'roles' => $roles
        ]);
    }

    public function create()
    {
        return Inertia::render('roles/create', [
            'auth' => [
                'user' => Auth::user(),
            ],
            'permissions' => Permission::all()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
           'name' => 'required|min:3|unique:roles,name'
        ]);

        $role = Role::create($validated);

        if($request->permissions) {

            $permissions = Permission::whereIn("id", $request->permissions)->pluck('name');

            $role->syncPermissions($permissions);
        }

        return to_route('roles.index')->with("success", "Role added successfully");
    }

    public function edit($id)
    {
        return Inertia::render('roles/edit', [
            'auth' => [
                'user' => Auth::user(),
            ],
            'role' => Role::with('permissions')->findOrFail($id),
            'permissions' => Permission::all()
        ]);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|min:3|unique:roles,name,' . $id
        ]);

        $role = Role::findById($id);

        $role->name = $validated['name'];

        $role->save();

        $permissions = Permission::whereIn("id", $request->permissions)->pluck('name');

        $role->syncPermissions($permissions);

        return to_route('roles.index')->with("success", "Role updated successfully");
    }

    public function destroy($id)
    {
        $role = Role::findById($id);

        $role->delete();

        return to_route('roles.index')->with("success", "Role Deleted successfully");
    }
}