import { useState, useEffect } from "react";
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

export default function Edit({ auth, role, allPermissions, can }) {
    const [formData, setFormData] = useState({
        name: role.name,
        permissions: role.permissions || []
    });
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);

    const handlePermissionChange = (permissionId) => {
        setFormData(prevState => ({
            ...prevState,
            permissions: prevState.permissions.includes(permissionId)
                ? prevState.permissions.filter(id => id !== permissionId)
                : [...prevState.permissions, permissionId]
        }));
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        setProcessing(true);
        
        router.put(route('roles.update', role.id), formData, {
            onSuccess: () => {
                router.visit(route('roles.index'));
            },
            onError: (errors) => {
                setErrors(errors);
                setProcessing(false);
            }
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Edit Role</h2>}
        >
            <Head title="Edit Role" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <form onSubmit={handleSubmit}>
                                {/* ... name input ... */}

                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Permissions
                                    </label>
                                    <div className="mt-2 grid grid-cols-3 gap-4">
                                        {allPermissions.map((permission) => (
                                            <label key={permission.id} className="inline-flex items-center">
                                                <input
                                                    type="checkbox"
                                                    className="form-checkbox h-4 w-4 text-indigo-600"
                                                    value={permission.id}
                                                    checked={formData.permissions.includes(permission.id)}
                                                    onChange={() => handlePermissionChange(permission.id)}
                                                />
                                                <span className="ml-2 text-sm text-gray-600">
                                                    {permission.name}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                    {errors.permissions && <InputError message={errors.permissions} />}
                                </div>

                                <div className="flex items-center justify-end space-x-2">
                                    <SecondaryButton
                                        type="button"
                                        onClick={() => router.visit(route('roles.index'))}
                                    >
                                        Cancel
                                    </SecondaryButton>
                                    <PrimaryButton
                                        type="submit"
                                        disabled={processing}
                                    >
                                        Update Role
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

