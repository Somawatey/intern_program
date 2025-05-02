import { useForm } from '@inertiajs/react';
import React from 'react';


export default function ModalDelete({ student, onDelete }) {
    const { delete: destroy, processing } = useForm();

    const handleDelete = (e) => {
        e.preventDefault();
        
        destroy(route('studentsdashboard.destroy', student.student_id), {
            preserveScroll: true,
            onSuccess: () => {
                document.getElementById(`modal_delete_${student.student_id}`).close();
                if (onDelete) onDelete();
            },
            onError: (errors) => {
                console.error('Delete failed:', errors);
            }
        });
    };

    return (
        <>
            <button
                onClick={() => document.getElementById(`modal_delete_${student.student_id}`).showModal()}
                className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm"
            >
                Delete
            </button>

            <dialog id={`modal_delete_${student.student_id}`} className="modal">
                <div className="modal-box bg-slate-50">
                    <h3 className="font-bold text-lg">Confirm Delete</h3>
                    <p className="py-4">Are you sure you want to delete {student.first_name} {student.last_name}?</p>
                    <div className="modal-action">
                        <button
                            type="button"
                            onClick={() => document.getElementById(`modal_delete_${student.student_id}`).close()}
                            className="btn btn-outline"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={processing}
                            className="btn btn-error text-white"
                        >
                            {processing ? 'Deleting...' : 'Delete'}
                        </button>
                    </div>
                </div>
            </dialog>
        </>
    );
}