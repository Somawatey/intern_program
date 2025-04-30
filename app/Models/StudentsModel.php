<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudentsModel extends Model
{
    protected $table = 'students_models'; // Define the table name
    protected $primaryKey = 'student_id'; 
    protected $fillable = [
        'first_name',
        'last_name',
        'department',
        'email',
];
}
