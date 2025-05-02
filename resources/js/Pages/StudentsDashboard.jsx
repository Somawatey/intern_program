import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import AddStudentButton from "@/Components/AddStudentButton";
import ModalUpdate from "@/Components/ModalUpdate";
import ModalDelete from "@/Components/ModalDelete";

export default function StudentsDashboard({ auth, studentsData, count }) {
    const [loading, setLoading] = useState(false);
    const [students, setStudents] = useState(studentsData || { data: [] });

    useEffect(() => {
        if (studentsData) {
            setStudents(studentsData);
            setLoading(false);
        }
    }, [studentsData]);

    const handleStudentUpdate = () => {
        setLoading(true);
        router.reload({ 
            only: ['studentsData', 'count'],
            onFinish: () => setLoading(false)
        });
    };

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
                        {/* Header with Add Button */}
                        <div className="p-6 text-gray-900 flex justify-between items-center">
                            <span className="text-lg font-medium">
                                Student Management
                            </span>
                            {auth.user.can['create students'] && (
                                <AddStudentButton onSuccess={handleStudentUpdate} />
                            )}
                        </div>
                        
                        {/* Loading State */}
                        {loading ? (
                            <div className="p-6 text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                            </div>
                        ) : students?.data?.length > 0 ? (
                            // Table View
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
                                        {students.data.map((student) => (
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
                                                    {auth.user.can['edit students'] && (
                                                        <ModalUpdate
                                                            student={student}
                                                            onUpdate={handleStudentUpdate}
                                                        />
                                                    )}
                                                    {auth.user.can['delete students'] && (
                                                        <ModalDelete
                                                            id={`delete_${student.student_id}`}
                                                            student={student}
                                                            onDelete={handleStudentUpdate}
                                                        />
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {/* Pagination Section */}
                                {students.last_page > 1 && (
                                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                                        <nav className="flex items-center justify-between">
                                            <div className="flex-1 flex justify-between">
                                                {students.prev_page_url && (
                                                    <button
                                                        onClick={() => router.visit(students.prev_page_url)}
                                                        className="relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                                                    >
                                                        Previous
                                                    </button>
                                                )}
                                                {students.next_page_url && (
                                                    <button
                                                        onClick={() => router.visit(students.next_page_url)}
                                                        className="ml-3 relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                                                    >
                                                        Next
                                                    </button>
                                                )}
                                            </div>
                                        </nav>
                                    </div>
                                )}
                            </div>
                        ) : (
                            // Empty State
                            <div className="p-6 text-gray-900 text-center">
                                <p>No students found.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}