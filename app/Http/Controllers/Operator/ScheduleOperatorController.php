<?php

namespace App\Http\Controllers\Operator;

use App\Http\Controllers\Controller;
use Inertia\Response;
use App\Models\Schedule;
use App\Models\Course;
use App\Models\Classroom;
use App\Enums\ScheduleDay;
use App\Enums\MessageType;
use Illuminate\Http\RedirectResponse;
use Throwable;
use App\Http\Resources\Operator\ScheduleOperatorResource;
use App\Http\Requests\Operator\ScheduleOperatorRequest;

class ScheduleOperatorController extends Controller
{
    /**
     * Display a listing of schedules
     */
    public function index(): Response
    {
        $operator = auth()->user()->operator;

        $schedules = Schedule::query()
            ->select([
                'schedules.id',
                'schedules.faculty_id',
                'schedules.department_id',
                'schedules.course_id',
                'schedules.classroom_id',
                'schedules.academic_year_id',
                'schedules.day_of_week',
                'schedules.start_time',
                'schedules.end_time',
                'schedules.quote',
                'schedules.created_at'
            ])
            ->filter(request()->only(['search']))
            ->sorting(request()->only(['field', 'direction']))
            ->where('schedules.faculty_id', $operator->faculty_id)
            ->where('schedules.department_id', $operator->department_id)
            ->with(['course', 'classroom', 'academicYear'])
            ->withCount(['studyPlan as taken_quota' => function ($query) {
                $query->whereNot('status', \App\Enums\StudyPlanStatus::REJECTED);
            }])
            ->paginate(request()->get('load') ?? 10);

        return inertia('Operators/Schedules/Index', [
            'page_settings' => [
                'title' => 'Jadwal',
                'subtitle' => 'Menampilkan semua data jadwal yang tersedia',
            ],
            'schedules' => ScheduleOperatorResource::collection($schedules)->additional([
                'meta' => [
                    'has_pages' => $schedules->hasPages(),
                ],
            ]),
            'state' => [
                'page' => request()->get('page') ?? 1,
                'search' => request()->get('search') ?? '',
                'load' => 10,
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource
     */
    public function create(): Response
    {
        $operator = auth()->user()->operator;

        return inertia('Operators/Schedules/Create', [
            'page_settings' => [
                'title' => 'Tambah Jadwal',
                'subtitle' => 'Buat jadwal baru disini. Klik simpan setelah selesai',
                'method' => 'POST',
                'action' => route('operators.schedules.store'),
            ],
            'courses' => Course::query()
                ->select(['id', 'name'])
                ->orderBy('name')
                ->where('faculty_id', $operator->faculty_id)
                ->where('department_id', $operator->department_id)
                ->get()
                ->map(fn($item) => [
                    'value' => (string) $item->id,
                    'label' => $item->name,
                ])
                ->toArray(),
            'classrooms' => Classroom::query()
                ->select(['id', 'name'])
                ->orderBy('name')
                ->where('faculty_id', $operator->faculty_id)
                ->where('department_id', $operator->department_id)
                ->get()
                ->map(fn($item) => [
                    'value' => (string) $item->id,
                    'label' => $item->name,
                ])
                ->toArray(),
            'days' => ScheduleDay::options(),
        ]);
    }

    /**
     * Store a newly created resource in storage
     */
    public function store(ScheduleOperatorRequest $request): RedirectResponse
    {
        try {
            $operator = auth()->user()->operator;

            Schedule::create([
                'faculty_id' => $operator->faculty_id,
                'department_id' => $operator->department_id,
                'course_id' => $request->course_id,
                'classroom_id' => $request->classroom_id,
                'academic_year_id' => activeAcademicYear()->id,
                'day_of_week' => $request->day_of_week,
                'start_time' => $request->start_time,
                'end_time' => $request->end_time,
                'quote' => $request->quote,
            ]);

            flashMessage(MessageType::CREATED->message('Jadwal'));

            return to_route('operators.schedules.index');
        } catch (Throwable $e) {
            flashMessage(MessageType::ERROR->message(error: $e->getMessage()), 'error');

            return to_route('operators.schedules.index');
        }
    }

    /**
     * Show the form for editing the specified resource
     */
    public function edit(Schedule $schedule): Response
    {
        $operator = auth()->user()->operator;
        if (
            $schedule->faculty_id !== $operator->faculty_id ||
            $schedule->department_id !== $operator->department_id
        ) {
            abort(403, 'Unauthorized action.');
        }

        return inertia('Operators/Schedules/Edit', [
            'page_settings' => [
                'title' => 'Edit Jadwal',
                'subtitle' => 'Edit data jadwal. Klik simpan setelah selesai',
                'method' => 'PUT',
                'action' => route('operators.schedules.update', $schedule->id),
            ],
            'schedule' => [
                'id' => $schedule->id,
                'course_id' => (string) $schedule->course_id,
                'classroom_id' => (string) $schedule->classroom_id,
                'start_time' => \Carbon\Carbon::parse($schedule->start_time)->format('H:i'),
                'end_time' => \Carbon\Carbon::parse($schedule->end_time)->format('H:i'),
                'day_of_week' => $schedule->day_of_week,
                'quote' => (int) $schedule->quote,
            ],
            'courses' => Course::query()
                ->select(['id', 'name'])
                ->orderBy('name')
                ->where('faculty_id', $operator->faculty_id)
                ->where('department_id', $operator->department_id)
                ->get()
                ->map(fn($item) => [
                    'value' => (string) $item->id,
                    'label' => $item->name,
                ])
                ->toArray(),
            'classrooms' => Classroom::query()
                ->select(['id', 'name'])
                ->orderBy('name')
                ->where('faculty_id', $operator->faculty_id)
                ->where('department_id', $operator->department_id)
                ->get()
                ->map(fn($item) => [
                    'value' => (string) $item->id,
                    'label' => $item->name,
                ])
                ->toArray(),
            'days' => ScheduleDay::options(),
        ]);
    }

    /**
     * Update the specified resource in storage
     */
    public function update(ScheduleOperatorRequest $request, Schedule $schedule): RedirectResponse
    {
        // Authorization check
        $operator = auth()->user()->operator;
        if (
            $schedule->faculty_id !== $operator->faculty_id ||
            $schedule->department_id !== $operator->department_id
        ) {
            abort(403, 'Unauthorized action.');
        }

        try {
            $schedule->update([
                'course_id' => $request->course_id,
                'classroom_id' => $request->classroom_id,
                'day_of_week' => $request->day_of_week,
                'start_time' => $request->start_time,
                'end_time' => $request->end_time,
                'quote' => $request->quote,
            ]);

            flashMessage(MessageType::UPDATED->message('Jadwal'));

            return to_route('operators.schedules.index');
        } catch (Throwable $e) {
            flashMessage(MessageType::ERROR->message(error: $e->getMessage()), 'error');

            return to_route('operators.schedules.index');
        }
    }

    /**
     * Remove the specified resource from storage
     */
    public function destroy(Schedule $schedule): RedirectResponse
    {
        // Authorization check
        $operator = auth()->user()->operator;
        if (
            $schedule->faculty_id !== $operator->faculty_id ||
            $schedule->department_id !== $operator->department_id
        ) {
            abort(403, 'Unauthorized action.');
        }

        try {
            $schedule->delete();

            flashMessage(MessageType::DELETED->message('Jadwal'));

            return to_route('operators.schedules.index');
        } catch (Throwable $e) {
            flashMessage(MessageType::ERROR->message(error: $e->getMessage()), 'error');

            return to_route('operators.schedules.index');
        }
    }
}