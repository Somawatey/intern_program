import { useState } from "react";
import { Head, Link, router } from '@inertiajs/react';
import CreatePermission from "./Create.jsx";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Index({ auth, permissions, can }) {
    const [showModal, setShowModal] = useState(undefined);

    const handleDelete = (id) => {
        if(confirm("Are you sure you want to delete?")) {
            router.delete(`/permissions/${id}`);
        }
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Manage Permissions
                </h2>
            }
        >
            <Head title="Permissions" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between mb-6">
                                <h3 className="text-lg font-semibold">All Permissions</h3>
                                {can?.create && (
                                    <button 
                                        type="button" 
                                        onClick={() => setShowModal(true)} 
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    >
                                        Create Permission
                                    </button>
                                )}
                            </div>

                            <table className="w-full text-sm text-left text-gray-500">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3">#</th>
                                        <th className="px-6 py-3">Name</th>
                                        <th className="px-6 py-3">Guard</th>
                                        <th className="px-6 py-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Array.isArray(permissions) && permissions.map((permission, index) => (
                                        <tr key={permission.id} className="bg-white border-b hover:bg-gray-50">
                                            <td className="px-6 py-4">{index + 1}</td>
                                            <td className="px-6 py-4">{permission.name}</td>
                                            <td className="px-6 py-4">{permission.guard_name}</td>
                                            <td className="px-6 py-4 space-x-2">
                                                {can?.edit && (
                                                    <button
                                                        onClick={() => setShowModal(permission)}
                                                        className="px-3 py-1.5 bg-green-600 text-white rounded hover:bg-green-700"
                                                    >
                                                        Edit
                                                    </button>
                                                )}
                                                {can?.delete && (
                                                    <button
                                                        onClick={() => handleDelete(permission.id)}
                                                        className="px-3 py-1.5 bg-red-600 text-white rounded hover:bg-red-700"
                                                    >
                                                        Delete
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {showModal !== undefined && (
                <CreatePermission 
                    onClose={() => setShowModal(undefined)} 
                    permission={showModal}
                    can={can}
                />
            )}
        </AuthenticatedLayout>
    );
}