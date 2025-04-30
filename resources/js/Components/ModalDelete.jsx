import { useForm } from "@inertiajs/react";

export default function ModalDelete({ student }) {
    if (!student) return null; // Guard clause for undefined student

    const { delete: destroy, processing } = useForm();

    const handleDelete = (e) => {
        e.preventDefault();
        
        if (confirm(`Are you sure you want to delete ${student.first_name}'s record?`)) {
            destroy(`/studentsdashboard/delete/${student.student_id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    document.getElementById(`modal_delete_${student.student_id}`).close();
                },
            });
        }
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
                    <div className="modal-header">
                        <h3 className="font-bold text-lg">
                            Delete Confirmation
                            <small className="block text-gray-500">ID: {student.student_id}</small>
                        </h3>
                    </div>

                    <div className="py-4">
                        <p>Are you sure you want to delete <strong>{student.first_name} {student.last_name}</strong>?</p>
                        <p className="text-sm text-gray-500 mt-1">This action cannot be undone.</p>
                    </div>

                    <div className="modal-action">
                        <button
                            onClick={() => document.getElementById(`modal_delete_${student.student_id}`).close()}
                            className="btn text-black border-0 bg-gray-300 hover:bg-gray-400"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={processing}
                            className="btn bg-red-600 hover:bg-red-700 text-white"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </dialog>
        </>
    );
}