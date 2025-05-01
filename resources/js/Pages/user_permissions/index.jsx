import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Index({ auth, users, roles, permissions }) {
    const [editingUser, setEditingUser] = useState(null);
    const { data, setData, post, processing } = useForm({
        roles: [],
        permissions: []
    });

    const handleEdit = (user) => {
        setEditingUser(user);
        setData({
            roles: user.roles.map(role => role.id),
            permissions: user.permissions.map(perm => perm.id)
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(`/user-permissions/${editingUser.id}`, {
            preserveScroll: true,
            onSuccess: () => setEditingUser(null)
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="User Permissions" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h2 className="text-2xl font-bold mb-4">Manage User Permissions</h2>
                            
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Roles</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {users.data.map(user => (
                                        <tr key={user.id}>
                                            <td className="px-6 py-4">{user.name}</td>
                                            <td className="px-6 py-4">{user.email}</td>
                                            <td className="px-6 py-4">
                                                {user.roles.map(role => role.name).join(', ')}
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => handleEdit(user)}
                                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                                >
                                                    Edit Permissions
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {editingUser && (
                                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
                                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                                        <h3 className="text-lg font-medium mb-4">
                                            Edit Permissions for {editingUser.name}
                                        </h3>
                                        
                                        <form onSubmit={handleSubmit}>
                                            <div className="mb-4">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Roles
                                                </label>
                                                {roles.map(role => (
                                                    <label key={role.id} className="flex items-center mt-2">
                                                        <input
                                                            type="checkbox"
                                                            checked={data.roles.includes(role.id)}
                                                            onChange={(e) => {
                                                                const newRoles = e.target.checked
                                                                    ? [...data.roles, role.id]
                                                                    : data.roles.filter(id => id !== role.id);
                                                                setData('roles', newRoles);
                                                            }}
                                                            className="mr-2"
                                                        />
                                                        {role.name}
                                                    </label>
                                                ))}
                                            </div>

                                            <div className="mb-4">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Direct Permissions
                                                </label>
                                                {permissions.map(permission => (
                                                    <label key={permission.id} className="flex items-center mt-2">
                                                        <input
                                                            type="checkbox"
                                                            checked={data.permissions.includes(permission.id)}
                                                            onChange={(e) => {
                                                                const newPermissions = e.target.checked
                                                                    ? [...data.permissions, permission.id]
                                                                    : data.permissions.filter(id => id !== permission.id);
                                                                setData('permissions', newPermissions);
                                                            }}
                                                            className="mr-2"
                                                        />
                                                        {permission.name}
                                                    </label>
                                                ))}
                                            </div>

                                            <div className="flex justify-end gap-4">
                                                <button
                                                    type="button"
                                                    onClick={() => setEditingUser(null)}
                                                    className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="submit"
                                                    disabled={processing}
                                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                                                >
                                                    Save Changes
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}