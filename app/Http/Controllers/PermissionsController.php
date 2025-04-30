<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;
use Illuminate\Support\Facades\Auth;

class PermissionsController extends Controller
{
    public function index()
    {
        return Inertia::render('permissions/index', [
            'auth' => [
                'user' => Auth::user(),
            ],
            'permissions' => Permission::paginate(10)
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|min:3|unique:permissions,name'
        ]);

        $permission = Permission::create([
            'name' => $validated['name']
        ]);

        Session::flash("success", "Permission added successfully");

        return to_route('permissions.index');
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|min:3|unique:permissions,name,'.$id
        ]);

        $permission = Permission::findById($id);
        $permission->name = $validated['name'];
        $permission->save();

        Session::flash("success", "Permission updated successfully");

        return to_route('permissions.index');
    }

    public function destroy($id)
    {
        $permission = Permission::findById($id);

        $permission->delete();

        Session::flash("success", "Permission deleted successfully");

        return to_route('permissions.index');
    }
}