<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Spatie\Permission\Models\Permission;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
class PermissionsController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'role:admin']);
    }

    public function index()
    {
        return Inertia::render('Permissions/Index', [
            'permissions' => Permission::latest()->get(),
                'can' => [
                    'create' => auth()->user()->can('create permissions'),
                    'edit' => auth()->user()->can('edit permissions'),
                    'delete' => auth()->user()->can('delete permissions'),
                ]
        ]);
    }

    public function create()
    {
        return Inertia::render('Permissions/Create');
    }

    public function store(Request $request)
{
    try {
        $validated = $request->validate([
            'name' => 'required|unique:permissions,name'
        ]);

        Permission::create($validated);

        return redirect()->route('permissions.index')
            ->with('success', 'Permission created successfully');
    } catch (\Exception $e) {
        Log::error('Error creating permission: ' . $e->getMessage());
        return back()->with('error', 'Failed to create permission');
    }
}

    public function edit(Permission $permission)
    {
        return Inertia::render('Permissions/Edit', [
            'permission' => $permission
        ]);
    }

    public function update(Request $request, Permission $permission)
    {
        $validated = $request->validate([
            'name' => 'required|unique:permissions,name,' . $permission->id
        ]);

        $permission->update($validated);

        return back()->with('success', 'Permission updated successfully');
    }

    public function destroy(Permission $permission)
    {
        $permission->delete();
        return back()->with('success', 'Permission deleted successfully');
    }
}