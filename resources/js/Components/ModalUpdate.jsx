import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import { useForm } from "@inertiajs/react";


export default function ModalUpdate({ student ,onUpdate}) {
    const { data, setData, put, processing, errors, reset } = useForm({
        first_name: student.first_name,
        last_name: student.last_name,
        department: student.department,
        email: student.email,
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        put(route('studentsdashboard.update', student.student_id), data,{
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                reset();
                document.getElementById(`modal_update_${student.student_id}`).close();
                if (onUpdate) onUpdate();
            },
            onError: (errors) => {
                console.error('Update failed:', errors);
            },
            onFinish: () => {
                // Ensure form is reset even if there's an error
                if (!errors) {
                    reset();
                }
            }
        });
    };

    const handleClose = () => {
        reset();
        document.getElementById(`modal_update_${student.student_id}`).close();
    };
    return (
        <>
            <button
                onClick={() => document.getElementById(`modal_update_${student.student_id}`).showModal()}
                className="inline-flex items-center px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-white rounded-md text-sm"
            >
                Edit
            </button>

            <dialog id={`modal_update_${student.student_id}`} className="modal">
                <div className="modal-box bg-slate-50">
                    <div className="modal-header">
                        <h3 className="font-bold text-lg">
                            Edit {student.first_name}'s Details
                            <small className="block text-gray-500">ID: {student.student_id}</small>
                        </h3>
                        <button
                        className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                        onClick={handleClose}
                        type="button"
                    >
                        ✕
                    </button>
                    </div>

                    <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                        {/* Form fields */}
                        <div>
                            <InputLabel htmlFor="first_name" value="First Name" />
                            <TextInput
                                id="first_name"
                                value={data.first_name}
                                onChange={e => setData('first_name', e.target.value)}
                                className="mt-1 block w-full"
                                required
                            />
                            <InputError message={errors.first_name} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="last_name" value="Last Name" />
                            <TextInput
                                id="last_name"
                                value={data.last_name}
                                onChange={e => setData('last_name', e.target.value)}
                                className="mt-1 block w-full"
                                required
                            />
                            <InputError message={errors.last_name} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="department" value="Department" />
                            <TextInput
                                id="department"
                                value={data.department}
                                onChange={e => setData('department', e.target.value)}
                                className="mt-1 block w-full"
                                required
                            />
                            <InputError message={errors.department} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="email" value="Email" />
                            <TextInput
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                className="mt-1 block w-full"
                                required
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div className="flex justify-end gap-2">
                        <button
                                type="button"
                                onClick={handleClose}
                                className="btn text-black border-0 bg-gray-300 hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="btn bg-yellow-400 hover:bg-yellow-500 text-white"
                            >
                                {processing ? 'Updating...' : 'Update'}
                            </button>
                        </div>
                    </form>
                </div>
            </dialog>
        </>
    );
}