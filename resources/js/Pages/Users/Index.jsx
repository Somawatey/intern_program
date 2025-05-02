import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';

export default function Index({ users, roles, can }) {
    const [showingModal, setShowingModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    
    // Simplified form state without permissions
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        role: ''
    });

    const handleCloseModal = () => {
        setShowingModal(false);
        setEditingUser(null);
        reset();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingUser) {
            put(route('users.update', editingUser.id), {
                onSuccess: () => handleCloseModal()
            });
        } else {
            post(route('users.store'), {
                onSuccess: () => handleCloseModal()
            });
        }
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setData({
            name: user.name,
            email: user.email,
            role: user.roles[0]?.id || '',
            password: ''
        });
        setShowingModal(true);
    };

    const handleDelete = (user) => {
        if (confirm(`Are you sure you want to delete ${user.name}?`)) {
            router.delete(route('users.destroy', user.id));
        }
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Users Management</h2>}
        >
            <Head title="Users" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* Header with Add Button */}
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-medium text-gray-900">
                                    Users List ({users.length})
                                </h3>
                                {can?.create && (
                                    <PrimaryButton onClick={() => {
                                        reset();
                                        setEditingUser(null);
                                        setShowingModal(true);
                                    }}>
                                        Add User
                                    </PrimaryButton>
                                )}
                            </div>

                            {/* Users Table */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {users.map((user) => (
                                            <tr key={user.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {user.roles.map(role => role.name).join(', ')}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap space-x-2">
                                                    {can?.edit && (
                                                        <SecondaryButton onClick={() => handleEdit(user)}>
                                                            Edit
                                                        </SecondaryButton>
                                                    )}
                                                    {can?.delete && (
                                                        <DangerButton onClick={() => handleDelete(user)}>
                                                            Delete
                                                        </DangerButton>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Create/Edit User Modal */}
                            <Modal show={showingModal} onClose={handleCloseModal}>
                                <form onSubmit={handleSubmit} className="p-6">
                                    <h2 className="text-lg font-medium text-gray-900">
                                        {editingUser ? 'Edit User' : 'Create New User'}
                                    </h2>

                                    {/* Name Field */}
                                    <div className="mt-6">
                                        <InputLabel htmlFor="name" value="Name" />
                                        <TextInput
                                            id="name"
                                            type="text"
                                            className="mt-1 block w-full"
                                            value={data.name}
                                            onChange={e => setData('name', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.name} className="mt-2" />
                                    </div>

                                    {/* Email Field */}
                                    <div className="mt-6">
                                        <InputLabel htmlFor="email" value="Email" />
                                        <TextInput
                                            id="email"
                                            type="email"
                                            className="mt-1 block w-full"
                                            value={data.email}
                                            onChange={e => setData('email', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.email} className="mt-2" />
                                    </div>

                                    {/* Password Field - Only for new users */}
                                    {!editingUser && (
                                        <div className="mt-6">
                                            <InputLabel htmlFor="password" value="Password" />
                                            <TextInput
                                                id="password"
                                                type="password"
                                                className="mt-1 block w-full"
                                                value={data.password}
                                                onChange={e => setData('password', e.target.value)}
                                                required
                                            />
                                            <InputError message={errors.password} className="mt-2" />
                                        </div>
                                    )}

                                    {/* Role Selection */}
                                    <div className="mt-6">
                                        <InputLabel htmlFor="role" value="Role" />
                                        <select
                                            id="role"
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                            value={data.role}
                                            onChange={e => setData('role', e.target.value)}
                                            required
                                        >
                                            <option value="">Select a role</option>
                                            {roles.map(role => (
                                                <option key={role.id} value={role.id}>
                                                    {role.name}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError message={errors.role} className="mt-2" />
                                    </div>

                                    {/* Form Actions */}
                                    <div className="mt-6 flex justify-end space-x-2">
                                        <SecondaryButton type="button" onClick={handleCloseModal}>
                                            Cancel
                                        </SecondaryButton>
                                        <PrimaryButton type="submit" disabled={processing}>
                                            {editingUser ? 'Update User' : 'Create User'}
                                        </PrimaryButton>
                                    </div>
                                </form>
                            </Modal>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}