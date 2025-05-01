import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';

export default function Dashboard() {
    const { auth } = usePage().props;
    const user = auth.user;

    // Helper function to get user role display name
    const getUserRole = () => {
        if (user.roles && user.roles.length > 0) {
            return user.roles[0].charAt(0).toUpperCase() + user.roles[0].slice(1);
        }
        return 'User';
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h3 className="text-lg font-medium mb-4">
                                Welcome, {user.name}!
                            </h3>
                            <div className="mb-4">
                                <p className="text-sm text-gray-600">
                                    Role: {getUserRole()}
                                </p>
                                <p className="text-sm text-gray-600">
                                    Email: {user.email}
                                </p>
                            </div>
                            <div className="text-sm text-gray-600">
                                <p>Your permissions:</p>
                                <ul className="list-disc list-inside mt-2">
                                    {user.permissions.map((permission, index) => (
                                        <li key={index}>{permission}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}