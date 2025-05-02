import { useState } from "react";
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

export default function Create({ auth, permissions, can }) {
    const [formData, setFormData] = useState({
        name: '',
        permissions: []
    });
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setProcessing(true);
        
        router.post(route('roles.store'), formData, {
            onSuccess: () => {
                router.visit(route('roles.index'));
            },
            onError: (errors) => {
                setErrors(errors);
                setProcessing(false);
            }
        });
    };

    const handlePermissionChange = (permissionId) => {
        setFormData(prevState => ({
            ...prevState,
            permissions: prevState.permissions.includes(permissionId)
                ? prevState.permissions.filter(id => id !== permissionId)
                : [...prevState.permissions, permissionId]
        }));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Create Role</h2>}
        >
            <Head title="Create Role" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                    {errors.name && <InputError message={errors.name} />}
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Permissions
                                    </label>
                                    <div className="mt-2 space-y-2">
                                        {permissions.map((permission) => (
                                            <label key={permission.id} className="inline-flex items-center mr-6 mb-2">
                                                <input
                                                    type="checkbox"
                                                    className="form-checkbox h-4 w-4 text-indigo-600"
                                                    checked={formData.permissions.includes(permission.id)}
                                                    onChange={() => handlePermissionChange(permission.id)}
                                                />
                                                <span className="ml-2">{permission.name}</span>
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
                                        Create Role
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