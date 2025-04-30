<?php

namespace App\Http\Controllers;
use Inertia\Inertia;
use App\Models\StudentsModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;  
use Illuminate\Support\Facades\auth;

class StudentsModelController extends Controller
{
    /* Read */
public function index(StudentsModel $model)
{
    return Inertia::render('StudentsDashboard', [
        'auth' => [
            'user' => auth()->user()
        ],
        'studentsData' => $model->paginate(10),
        'count' => $model->count(),
    ]);
}
/* Create */
    public function store(Request $request, StudentsModel $model)
    {
        $model->create($request->validate([
            'first_name' => 'required|max:255|min:2',
            'last_name' => 'required|max:255|min:2',
            'department' => 'required|max:255|min:2',
            'email' => 'required|email|max:255|unique:students_models,email',
        ]));

        return back()->with('message', 'Student added successfully');
    }
/* Update */
public function update(Request $request, StudentsModel $model, $student_id)
{
    // You need this for encountering Log the incoming request data
    // And you can view this logs at storage/logs/laravel.log
    Log::info('Update request received for student ID: ' . $student_id);
    Log::info('Update request data: ', $request->all());


    $validatedData = $request->validate( // Validate the incoming request data
        [
            'first_name' => 'required|max:255|min:2',
            'last_name' => 'required|max:255|min:2',
            'department' => 'required|max:255|min:2',
            'email' => 'required|email|max:255',
        ],
        [
            'email.unique' => 'The email has already been taken.', // Custom error message for unique rule
        ]
    );

    $student = $model->findOrFail($student_id);

    $student->update($validatedData);

    return back()->with('message', 'Student updated successfully');
}
/* Delete */
public function destroy(StudentsModel $model, $student_id)
{
    $student = $model->findOrFail($student_id);

    $student->delete();

    // You can also use redirect()->route('your_directory')
    return back()->with('message', 'Student deleted successfully');
}
}
