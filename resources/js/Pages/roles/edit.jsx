import { useEffect, useState } from "react";
import { Head, Link, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function EditRole({ auth, permissions, role }) {
    const { errors } = usePage().props;
    const [form, setForm] = useState({ name: role.name, permissions: [] });

    useEffect(() => {
        if(role) {
            const permIds = role.permissions.map(p => p.id);
            setForm({...form, permissions: permIds});
        }
    }, [role]);

    const handleSubmit = e => {
        e.preventDefault();
        router.put(`/roles/${role.id}`, form);
    }

    const handleSelectPermission = e => {
        if(e.target.checked) {
            const checkExist = form.permissions.find(p => p == e.target.value);
            if(!checkExist) {
                setForm({...form, permissions: [...form.permissions, parseInt(e.target.value)] });
            }
        } else {
            const filtered = form.permissions.filter(p => p != parseInt(e.target.value));
            setForm({...form, permissions: filtered});
        }
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Update Role #{role.id}
                </h2>
            }
        >
            <Head title="Edit Role" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium leading-6 text-gray-900">Role Name</label>
                                        <input 
                                            type="text" 
                                            name="name" 
                                            value={form.name} 
                                            onChange={e => setForm({...form, name: e.target.value})}
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                        {errors.name && <div className="text-sm mt-1 text-red-600">{errors.name}</div>}
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-bold">Permissions</h3>
                                        <div className="grid grid-cols-2 gap-2 mt-4">
                                            {permissions.map(permission => (
                                                <div key={permission.id}>
                                                    <input 
                                                        type="checkbox" 
                                                        name="permissions" 
                                                        value={permission.id} 
                                                        id={permission.name} 
                                                        onChange={handleSelectPermission} 
                                                        checked={form.permissions.includes(permission.id)}
                                                        className="mx-2" 
                                                    />
                                                    <label
                                                        className="text-sm font-medium leading-6 text-gray-900" 
                                                        htmlFor={permission.name}
                                                    >
                                                        {permission.name}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <button 
                                    type="submit"
                                    className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                                >
                                    Update Role
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}