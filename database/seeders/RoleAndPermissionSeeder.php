<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class RoleAndPermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions
        $permissions = [
            // Dashboard access
            'access dashboard',
            
            // Student management
            'view students',
            'create students',
            'edit students',
            'delete students',
            
            // Admin permissions
            'manage roles',
            'manage permissions',
            'manage users',
            'manage students',
            'view roles',
            'create roles',
            'edit roles',
            'delete roles',
            'view permissions',
            'create permissions',
            'edit permissions',
            'delete permissions',
            'view users',
            'create users',
            'edit users',
            'delete users'
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        // Create Admin role and assign all permissions
        $adminRole = Role::create(['name' => 'admin']);
        $adminRole->givePermissionTo(Permission::all());

        // Create Staff role with student management permissions
        $staffRole = Role::create(['name' => 'staff']);
        $staffRole->givePermissionTo([
            'access dashboard',
            'view students',
            'create students',
            'edit students',
            'delete students'
        ]);

        // Create users
        $users = [
            [
                'name' => 'Admin',
                'email' => 'admin@dashboard.com',
                'password' => '12345678',
                'role' => 'admin'
            ],
            [
                'name' => 'Staff',
                'email' => 'staff@dashboard.com',
                'password' => '12345678',
                'role' => 'staff'
            ]
        ];

        foreach ($users as $userData) {
            $user = User::create([
                'name' => $userData['name'],
                'email' => $userData['email'],
                'password' => Hash::make($userData['password'])
            ]);
            
            $user->assignRole($userData['role']);
        }
    }
}