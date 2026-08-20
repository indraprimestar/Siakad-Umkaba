<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Response;
use App\Models\Schedule;
use App\Models\Faculty;
use App\Models\Department;
use App\Models\Course;
use App\Models\Classroom;
use App\Models\AcademicYear;
use App\Enums\ScheduleDay;
use Illuminate\Http\RedirectResponse;
use Throwable;
use App\Enums\MessageType;
use App\Http\Resources\Admin\ScheduleResource;
use Illuminate\Http\Request;
use App\Http\Requests\Admin\ScheduleRequest;
use App\Http\Requests\Admin\ScheduleStoreRequest;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;



class ScheduleController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('validateClassroom', only:['store', 'update']),
            new Middleware('validateCourse', only:['store', 'update']),
            new Middleware('validateDepartment', only:['store', 'update']),
        ];
    }

    public function index(): Response
    {
        $schedule = Schedule::query()
            ->select(['schedules.id', 'schedules.faculty_id', 'schedules.department_id', 'schedules.course_id', 
                'schedules.classroom_id','schedules.academic_year_id','schedules.day_of_week', 'schedules.start_time',
                'schedules.end_time', 'schedules.quote', 'schedules.created_at'])
                ->filter(request()->only(['search']))
                ->sorting(request()->only(['sort', 'direction']))
                ->with(['faculty', 'department', 'course', 'classroom', 'academicYear'])
                ->withCount(['studyPlan as taken_quota' => function ($query) {
                    $query->whereNot('status', \App\Enums\StudyPlanStatus::REJECTED);
                }])
                ->paginate(request()->load ?? 10);

        return inertia('Admin/Schedules/index', [
            'page_settings' => [
                'title' => 'Jadwal',
                'subtitle' => 'Menampilkan Semua data jadwal yang ada di UMKABA',
            ],
            'schedules' => ScheduleResource::collection($schedule)->additional([
                'meta' => [
                    'has_pages' => $schedule->hasPages(),
                ],
            ]),
            'state' => [
                'page' => request()->page ?? 1,
                'search' => request()->search ?? '',
                'load' => 10, //kalau ganti disini aja karena ini tampilan
            ],
            
        ]);
    }

    public function create():Response
    {
        return inertia('Admin/Schedules/Create',  [
            'page_settings' => [
                'title' => 'Tambah Jadwal',
                'subtitle' => 'Buat jadwal baru disini. klik simpan untuk menyimpan data.',
                'method' => 'POST',
                'action' => route('admin.schedules.store'),
            ],
            'faculties' => Faculty::query()->select(['id', 'name'])->orderBy('name')->get()->map(fn($item) =>[
                'value' => $item->id,
                'label' => $item->name,
            ]),
            'departments' => Department::query()->select(['id', 'name'])->orderBy('name')->get()->map(fn($item) =>[
                'value' => $item->id,
                'label' => $item->name,
            ]),
            'courses' => Course::query()->select(['id', 'name'])->orderBy('name')->get()->map(fn($item) =>[
                'value' => $item->id,
                'label' => $item->name,
            ]),
            'classrooms' => Classroom::query()->select(['id', 'name'])->orderBy('name')->get()->map(fn($item) =>[
                'value' => $item->id,
                'label' => $item->name,
            ]),
            'days' => ScheduleDay::options(),
        ]);
    }
    public function store(ScheduleRequest $request):RedirectResponse
    {
       try{
        Schedule::create([
            'faculty_id' => $request->faculty_id,
            'department_id' => $request->department_id,
            'course_id' => $request->course_id,
            'classroom_id' => $request->classroom_id,
            'academic_year_id' => activeAcademicYear()->id,
            'day_of_week' => $request->day_of_week,
            'start_time' => $request->start_time,
            'end_time' => $request->end_time,
            'quote' => $request->quote
        ]);

        flashMessage(MessageType::CREATED->message('Jadwal'));
        return to_route('admin.schedules.index');

       }catch(Throwable $e){
            flashMessage (MessageType::ERROR->message(error: $e->getMessage()), 'error');
            return to_route('admin.schedules.index');
       }
    }

    public function edit(Schedule $schedule):Response
    {
        return inertia('Admin/Schedules/Edit',  [
            'page_settings' => [
                'title' => 'Edit Jadwal',
                'subtitle' => 'Edit jadwal disini. klik simpan untuk menyimpan data.',
                'method' => 'PUT',
                'action' => route('admin.schedules.update', $schedule),
            ],
            'schedule' => $schedule,
            'faculties' => Faculty::query()->select(['id', 'name'])->orderBy('name')->get()->map(fn($item) =>[
                'value' => $item->id,
                'label' => $item->name,
            ]),
            'departments' => Department::query()->select(['id', 'name'])->orderBy('name')->get()->map(fn($item) =>[
                'value' => $item->id,
                'label' => $item->name,
            ]),
            'courses' => Course::query()->select(['id', 'name'])->orderBy('name')->get()->map(fn($item) =>[
                'value' => $item->id,
                'label' => $item->name,
            ]),
            'classrooms' => Classroom::query()->select(['id', 'name'])->orderBy('name')->get()->map(fn($item) =>[
                'value' => $item->id,
                'label' => $item->name,
            ]),
            'days' => ScheduleDay::options(),
        ]);
    }

    public function update(Schedule $schedule, ScheduleRequest $request):RedirectResponse
    {
       try{
        $schedule->update([
            'faculty_id' => $request->faculty_id,
            'department_id' => $request->department_id,
            'course_id' => $request->course_id,
            'classroom_id' => $request->classroom_id,
            // 'academic_year_id' => activeAcademicYear()->id,
            'day_of_week' => $request->day_of_week,
            'start_time' => $request->start_time,
            'end_time' => $request->end_time,
            'quote' => $request->quote
        ]);

        flashMessage(MessageType::UPDATED->message('Jadwal'));
        return to_route('admin.schedules.index');

       }catch(Throwable $e){
            flashMessage (MessageType::ERROR->message(error: $e->getMessage()), 'error');
            return to_route('admin.schedules.index');
       }
    }
    public function destroy(Schedule $schedule):RedirectResponse
    {
        try{
            $schedule->delete();
            flashMessage(MessageType::DELETED->message('Jadwal'));
            return to_route('admin.schedules.index');
        }catch (Throwable $e) {
            flashMessage(MessageType::ERROR-> message(error: $e->getMessage()), 'error');
            return to_route('admin.schedules.index');
        }
    }
}
