import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import AddStudentButton from "@/Components/AddStudentButton";
import ModalUpdate from "@/Components/ModalUpdate";
import ModalDelete from "@/Components/ModalDelete";
import { useEffect, useState } from "react";

export default function StudentsDashboard({ auth, studentsData, count }) {
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (studentsData) {
            setLoading(false);
            console.log('Students Data:', studentsData);
        }
    }, [studentsData]);

    if (loading) {
        return <div>Loading...</div>;
    }
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Students Dashboard ({count || 0} Students)
                </h2>
            }
        >
            <Head title="Students Dashboard" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 flex justify-between items-center">
                            <span className="text-lg font-medium">
                                 Student Management
                            </span>
                            {auth.user.roles.includes('admin') && <AddStudentButton />}
                        </div>
                        
                        {studentsData?.data?.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {studentsData?.data?.map((student) => (
                                        <tr key={student.student_id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">{student.student_id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="font-medium text-gray-900">
                                                    {student.first_name} {student.last_name}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">{student.department}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{student.email}</td>
                                            <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                                            {auth.user.roles.includes('admin') && (
                                                        <>
                                                            <ModalUpdate
                                                                id={`update_${student.student_id}`}
                                                                student={student}
                                                            />
                                                            <ModalDelete
                                                                id={`delete_${student.student_id}`}
                                                                student={student}
                                                            />
                                                        </>
                                                    )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        ) : (
                            <div className="p-6 text-gray-900">
                                <p>No students found.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}