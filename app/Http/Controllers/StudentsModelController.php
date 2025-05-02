<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\StudentsModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;


class StudentsModelController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'verified']);
        $this->middleware(['role:admin|staff']);
        $this->middleware('permission:view students')->only(['index']);
        $this->middleware('permission:create students')->only(['store']);
        $this->middleware('permission:edit students')->only(['update']);
        $this->middleware('permission:delete students')->only(['destroy']);
    }

    public function index()
    {
        try {
            $students = StudentsModel::latest()->paginate(10);
            $count = StudentsModel::count();

            return Inertia::render('StudentsDashboard', [
                'studentsData' => $students,
                'count' => $count,
                'can' => [
                    'create' => Auth::user()->can('create students'),
                    'edit' => Auth::user()->can('edit students'),
                    'delete' => Auth::user()->can('delete students'),
                    'view' => Auth::user()->can('view students'),
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Error in StudentsModelController@index: ' . $e->getMessage());
            return back()->with('error', 'Error loading students data');
        }
    }

    public function store(Request $request)
    {
        Log::info('Permission check for user:', [
            'user_id' => Auth::id(),
            'user_name' => Auth::user()->name,
            'roles' => Auth::user()->getRoleNames(),
            'permissions' => Auth::user()->getAllPermissions()->pluck('name'),
            'can_create_students' => Auth::user()->can('create students')
        ]);

        if (!Auth::user()->can('create students')) {
            Log::warning('Unauthorized attempt to create student by user:', [
                'user_id' => Auth::id()
            ]);
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'first_name' => 'required|string|max:255|min:2',
            'last_name' => 'required|string|max:255|min:2',
            'department' => 'required|string|max:255|min:2',
            'email' => 'required|email|max:255|unique:students_models,email',
        ]);

        $student = StudentsModel::create($validated);

        Log::info('Student created successfully', [
            'student_id' => $student->id,
            'created_by' => Auth::id()
        ]);

        return back()->with('success', 'Student added successfully');
    }

    public function update(Request $request, $student_id)
{
    try {
        $student = StudentsModel::findOrFail($student_id);
        
        $validated = $request->validate([
            'first_name' => 'required|string|max:255|min:2',
            'last_name' => 'required|string|max:255|min:2',
            'department' => 'required|string|max:255|min:2',
            'email' => 'required|email|max:255|unique:students_models,email,' . $student->student_id . ',student_id',
        ]);

        if (!$student->update($validated)) {
            throw new \Exception('Failed to update student record');
        }

        return back()->with('success', 'Student updated successfully');
    } catch (\Exception $e) {
        \Log::error('Update failed:', [
            'error' => $e->getMessage(),
            'student_id' => $student_id,
            'data' => $request->all()
        ]);
        
        return back()->withErrors(['error' => 'Failed to update student: ' . $e->getMessage()]);
    }
}

    public function destroy($student_id)
    {
        try {
            $student = StudentsModel::findOrFail($student_id);
            $student->delete();

            return back()->with('success', 'Student deleted successfully');
        } catch (\Exception $e) {
            Log::error('Error in StudentsModelController@destroy: ' . $e->getMessage());
            return back()->with('error', 'Failed to delete student');
        }
    }
}