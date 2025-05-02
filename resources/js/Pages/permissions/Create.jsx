import React, {useEffect, useState} from "react";
import {router, usePage} from "@inertiajs/react";

export default function CreatePermission({onClose, permission}){
    const { errors } = usePage().props;
    const [form, setForm] = useState({
        name: '',
        guard_name: 'web'
    });

    // Predefined student permissions
    const studentPermissions = [
        'view students',
        'create students', 
        'edit students',
        'delete students'
    ];

    useEffect(() => {
        if(permission && permission.hasOwnProperty('name')) {
            setForm({...form, name: permission.name});
        }
    }, [permission]);

    const handleSubmit = e => {
        e.preventDefault();
        if(permission === true) {
            router.post("/permissions", form, {
                onSuccess: () => onClose()
            });
            return;
        }
        router.put(`/permissions/${permission.id}`, form, {
            onSuccess: () => onClose()
        });
    }

    const selectPresetPermission = (preset) => {
        setForm({...form, name: preset});
    }

    return (
        <>
            <div id="create-permission-modal" tabIndex="-1" aria-hidden="true"
                 className="overflow-y-auto overflow-x-hidden fixed inset-0 z-50 flex justify-center items-center">
                <div className="relative p-4 w-full max-w-md">
                    <div className="relative bg-white rounded-lg shadow">
                        <div className="flex items-center justify-between p-4 border-b">
                            <h3 className="text-xl font-semibold">
                                {permission === true ? 'Create Permission' : 'Edit Permission'}
                            </h3>
                            <button type="button"
                                    onClick={onClose}
                                    className="text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 flex justify-center items-center">
                                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                     fill="none" viewBox="0 0 14 14">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                          strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                </svg>
                            </button>
                        </div>

                        <div className="p-4">
                            {/* Quick select for student permissions */}
                            {permission === true && (
                                <div className="mb-4">
                                    <label className="block mb-2 text-sm font-medium text-gray-900">
                                        Quick Select Student Permissions
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {studentPermissions.map(perm => (
                                            <button
                                                key={perm}
                                                type="button"
                                                onClick={() => selectPresetPermission(perm)}
                                                className="text-sm px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded"
                                            >
                                                {perm}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <form className="space-y-4" onSubmit={handleSubmit}>
                                <div>
                                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">
                                        Permission Name
                                    </label>
                                    <input 
                                        type="text" 
                                        name="name" 
                                        value={form.name} 
                                        onChange={e => setForm({...form, name: e.target.value})}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                    />
                                    {errors.name && (
                                        <div className="text-sm text-red-600 mt-1">{errors.name}</div>
                                    )}
                                </div>

                                <button type="submit"
                                        className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                                    {permission === true ? 'Create Permission' : 'Update Permission'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div className="fixed inset-0 z-40 bg-black/50"></div>
        </>
    );
}