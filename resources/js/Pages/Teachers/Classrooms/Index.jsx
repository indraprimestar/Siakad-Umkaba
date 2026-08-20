import EmptyState from '@/Components/EmptyState';
import HeaderTitle from '@/Components/HeaderTitle';
import PaginationTable from '@/Components/PaginationTable';
import ShowFilter from '@/Components/ShowFilter';
import { Alert, AlertDescription } from '@/Components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/Components/ui/card';
import { Checkbox } from '@/Components/ui/checkbox';
import { Input } from '@/Components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import UseFilter from '@/hooks/UseFilter';
import AppLayout from '@/Layouts/AppLayout';
import { flashMessage } from '@/lib/utils';
import { useForm } from '@inertiajs/react';
import { IconDoor, IconRefresh, IconUsers } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function Index(props) {
    console.log('props.students:', props.students);
    const { data: students, meta, links } = props.students;
    console.log('students (destructured):', students);
    const [params, setParams] = useState(props.state);

    UseFilter({
        route: route('teachers.classrooms.index', [props.course, props.classroom]),
        values: params,
        only: ['students'],
    });

    const { data, setData, post, errors, processing, reset } = useForm({
        student_ids: [],
        attendances: [],
        grades: [],
        _method: props.page_settings.method,
    });

    useEffect(() => {
        if (students) {
            setData({
                ...data,
                student_ids: students.map((student) => student.id),
                attendances: students.flatMap((student) =>
                    (student.attendances || []).map((att) => ({
                        student_id: student.id,
                        course_id: props.course.id,
                        classroom_id: props.classroom.id,
                        section: att.section,
                        status: !!att.status,
                    })),
                ),
                grades: students.flatMap((student) =>
                    (student.grades || []).map((g) => ({
                        student_id: student.id,
                        course_id: props.course.id,
                        classroom_id: props.classroom.id,
                        category: g.category,
                        section: g.section,
                        grade: g.grade,
                    })),
                ),
            });
        }
    }, [props.students]);

    const onHandleSubmit = (e) => {
        e.preventDefault();

        post(props.page_settings.action, {
            preserveScroll: true,
            onSuccess: (success) => {
                const flash = flashMessage(success);
                if (flash) toast[flash.type](flash.message);
            },
        });
    };

    const isAttendanceChecked = (attendances, studentId, section) => {
        return attendances.some(
            (attendance) => attendance.student_id === studentId && attendance.section === section && attendance.status,
        );
    };

    const updateAttendance = (attendances, setData, studentId, section, checked) => {
        const updatedAttendance = attendances.filter(
            (attendance) => !(attendance.student_id === studentId && attendance.section === section),
        );

        if (checked) {
            updatedAttendance.push({
                student_id: studentId,
                course_id: props.course.id,
                classroom_id: props.classroom.id,
                section: section,
                status: true,
            });
        }

        setData('attendances', updatedAttendance);
    };

    const getGradeValue = (grades, studentId, category, section) => {
        const found = grades.find(
            (grade) => grade.student_id === studentId && grade.category === category && grade.section === section,
        );
        // Tampilkan kosong jika tidak ada nilai atau nilainya 0
        return found && found.grade > 0 ? found.grade : '';
    };

    const updateGrade = (grades, setData, studentId, category, section, gradeValue) => {
        const updatedGrades = grades.filter(
            (grade) => !(grade.student_id === studentId && grade.category === category && grade.section === section),
        );

        // Batasi nilai antara 0 dan 100
        const parsed = parseInt(gradeValue, 10);
        const clamped = isNaN(parsed) ? 0 : Math.min(100, Math.max(0, parsed));

        updatedGrades.push({
            student_id: studentId,
            course_id: props.course.id,
            classroom_id: props.classroom.id,
            category: category,
            section: section,
            grade: clamped,
        });

        setData('grades', updatedGrades);
    };

    const roundToTwo = (num) => {
        return Math.round((num + Number.EPSILON) * 100) / 100;
    };

    const getLetterGrade = (grade) => {
        if (grade >= 80) return 'A';
        if (grade >= 75) return 'AB';
        if (grade >= 70) return 'B';
        if (grade >= 65) return 'BC';
        if (grade >= 60) return 'C';
        if (grade >= 55) return 'CD';
        if (grade >= 50) return 'D';
        if (grade >= 45) return 'DE';
        return 'E';
    };

    return (
        <div className="flex w-full flex-col pb-32">
            <div className="mb-8 flex flex-col items-start justify-between gap-y-4 lg:flex-row lg:items-center">
                <HeaderTitle
                    title={props.page_settings.title}
                    subtitle={props.page_settings.subtitle}
                    icon={IconDoor}
                />
                <Button form="grade-form" type="submit" disabled={processing}>
                    {processing ? 'Menyimpan...' : 'Simpan Nilai'}
                </Button>
            </div>
            <Card>
                <CardHeader className="mb-4 p-0">
                    <div className="flex w-full flex-col gap-4 px-6 py-4 lg:flex-row lg:items-center">
                        <Input
                            className="w-full sm:w-1/4"
                            placeholder="Cari nama mahasiswa..."
                            value={params?.search}
                            onChange={(e) => setParams((prev) => ({ ...prev, search: e.target.value }))}
                        />

                        <Button type="button" variant="red" onClick={(e) => setParams(props.state)}>
                            <IconRefresh className="size-4" />
                            Bersihkan
                        </Button>
                    </div>
                    <div className="space-y-4 px-6">
                        <Alert variant="destructive">
                            <AlertDescription>
                                Harap isi dengan teliti, data yang sudah disimpan tidak dapat diubah kembali
                            </AlertDescription>
                        </Alert>
                        {errors && Object.keys(errors).length > 0 && (
                            <Alert variant="red">
                                <AlertDescription>
                                    {typeof errors === 'string' ? (
                                        errors
                                    ) : (
                                        <ul>
                                            {Object.entries(errors).map(([key, message]) => (
                                                <li key={key}>{message}</li>
                                            ))}
                                        </ul>
                                    )}
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>
                    <div className="px-6 py-2">
                        <ShowFilter params={params} />
                    </div>
                </CardHeader>
                <CardContent className="p-0 [&_td]:whitespace-nowrap [&_td]:px-6 [&_th]:px-6">
                    {students.length === 0 ? (
                        <EmptyState
                            icon={IconUsers}
                            title="Tidak ada mahasiswa"
                            subtitle="Tidak ada mahasiswa yang tergabung di kelas ini"
                        />
                    ) : (
                        <form id="grade-form" onSubmit={onHandleSubmit}>
                            <Table className="w-full border">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead rowSpan="2">#</TableHead>
                                        <TableHead rowSpan="2">Nama</TableHead>
                                        <TableHead rowSpan="2">Nomor Pokok Mahasiswa</TableHead>
                                        <TableHead colSpan="12" className="border text-center">
                                            Absensi
                                        </TableHead>
                                        <TableHead colSpan="10" className="border text-center">
                                            Tugas
                                        </TableHead>
                                        <TableHead rowSpan="2" className="border text-center">
                                            UTS
                                        </TableHead>
                                        <TableHead rowSpan="2" className="border text-center">
                                            UAS
                                        </TableHead>
                                        <TableHead colSpan="4" className="border text-center">
                                            Total
                                        </TableHead>
                                        <TableHead colSpan="4" className="border text-center">
                                            Presentase Nilai
                                        </TableHead>
                                        <TableHead rowSpan="2" className="border text-center">
                                            Nilai Akhir
                                        </TableHead>
                                        <TableHead rowSpan="2" className="border text-center">
                                            Huruf Mutu
                                        </TableHead>
                                        <TableHead rowSpan="2" className="border text-center">
                                            Status
                                        </TableHead>
                                    </TableRow>
                                    <TableRow className="border">
                                        {Array.from({ length: 12 }).map((_, i) => (
                                            <TableHead key={i} className="border text-center">
                                                {i + 1}
                                            </TableHead>
                                        ))}
                                        {Array.from({ length: 10 }).map((_, i) => (
                                            <TableHead key={i} className="border text-center">
                                                {i + 1}
                                            </TableHead>
                                        ))}
                                        <TableHead className="border text-center">Absen</TableHead>
                                        <TableHead className="border text-center">Tugas</TableHead>
                                        <TableHead className="border text-center">UTS</TableHead>
                                        <TableHead className="border text-center">UAS</TableHead>
                                        <TableHead className="border text-center">Absen (10%)</TableHead>
                                        <TableHead className="border text-center">Tugas (20%)</TableHead>
                                        <TableHead className="border text-center">UTS (30%)</TableHead>
                                        <TableHead className="border text-center">UAS (40%)</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {students.map((student, index) => {
                                        const studentAttendances = data.attendances.filter(
                                            (att) => att.student_id === student.id && att.status,
                                        ).length;

                                        const studentTasksSum = data.grades
                                            .filter((g) => g.student_id === student.id && g.category === 'tugas')
                                            .reduce((acc, curr) => acc + (curr.grade || 0), 0);

                                        const studentUts =
                                            data.grades.find((g) => g.student_id === student.id && g.category === 'uts')
                                                ?.grade || 0;

                                        const studentUas =
                                            data.grades.find((g) => g.student_id === student.id && g.category === 'uas')
                                                ?.grade || 0;

                                        const attendancePercentage = roundToTwo((studentAttendances / 12) * 10);
                                        const taskPercentage = roundToTwo((studentTasksSum / 10) * 0.2);
                                        const utsPercentage = roundToTwo(studentUts * 0.3);
                                        const uasPercentage = roundToTwo(studentUas * 0.4);

                                        const finalScore = roundToTwo(
                                            attendancePercentage + taskPercentage + utsPercentage + uasPercentage,
                                        );

                                        const letterGrade = getLetterGrade(finalScore);

                                        return (
                                            <TableRow key={index}>
                                                <TableCell className="border text-center">{index + 1}</TableCell>
                                                <TableCell className="border">
                                                    <div className="flex items-center gap-2">
                                                        <Avatar>
                                                            <AvatarImage src={student.user?.avatar} />
                                                            <AvatarFallback>
                                                                {student.user?.name?.substring(0, 1)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <span>{student.user?.name}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="border">{student.student_number}</TableCell>

                                                {/* Absensi */}
                                                {Array.from({ length: 12 }).map((_, i) => {
                                                    const section = i + 1;
                                                    return (
                                                        <TableCell key={`att-${i}`} className="border text-center">
                                                            <Checkbox
                                                                checked={isAttendanceChecked(
                                                                    data.attendances,
                                                                    student.id,
                                                                    section,
                                                                )}
                                                                onCheckedChange={(checked) =>
                                                                    updateAttendance(
                                                                        data.attendances,
                                                                        setData,
                                                                        student.id,
                                                                        section,
                                                                        checked,
                                                                    )
                                                                }
                                                            />
                                                        </TableCell>
                                                    );
                                                })}

                                                {/* Tugas */}
                                                {Array.from({ length: 10 }).map((_, i) => {
                                                    const section = i;
                                                    return (
                                                        <TableCell key={`task-${i}`} className="border p-1">
                                                            <Input
                                                                type="number"
                                                                min="0"
                                                                max="100"
                                                                className="h-8 w-16 text-center"
                                                                value={getGradeValue(
                                                                    data.grades,
                                                                    student.id,
                                                                    'tugas',
                                                                    section,
                                                                )}
                                                                onChange={(e) =>
                                                                    updateGrade(
                                                                        data.grades,
                                                                        setData,
                                                                        student.id,
                                                                        'tugas',
                                                                        section,
                                                                        e.target.value,
                                                                    )
                                                                }
                                                            />
                                                        </TableCell>
                                                    );
                                                })}

                                                {/* UTS */}
                                                <TableCell className="border p-1">
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        max="100"
                                                        className="h-8 w-16 text-center"
                                                        value={getGradeValue(data.grades, student.id, 'uts', null)}
                                                        onChange={(e) =>
                                                            updateGrade(
                                                                data.grades,
                                                                setData,
                                                                student.id,
                                                                'uts',
                                                                null,
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                </TableCell>

                                                {/* UAS */}
                                                <TableCell className="border p-1">
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        max="100"
                                                        className="h-8 w-16 text-center"
                                                        value={getGradeValue(data.grades, student.id, 'uas', null)}
                                                        onChange={(e) =>
                                                            updateGrade(
                                                                data.grades,
                                                                setData,
                                                                student.id,
                                                                'uas',
                                                                null,
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                </TableCell>

                                                {/* Total */}
                                                <TableCell className="border bg-gray-50/50 text-center font-medium">
                                                    {studentAttendances}
                                                </TableCell>
                                                <TableCell className="border bg-gray-50/50 text-center font-medium">
                                                    {studentTasksSum}
                                                </TableCell>
                                                <TableCell className="border bg-gray-50/50 text-center font-medium">
                                                    {studentUts}
                                                </TableCell>
                                                <TableCell className="border bg-gray-50/50 text-center font-medium">
                                                    {studentUas}
                                                </TableCell>

                                                {/* Presentase */}
                                                <TableCell className="border bg-gray-100/50 text-center font-medium">
                                                    {attendancePercentage}
                                                </TableCell>
                                                <TableCell className="border bg-gray-100/50 text-center font-medium">
                                                    {taskPercentage}
                                                </TableCell>
                                                <TableCell className="border bg-gray-100/50 text-center font-medium">
                                                    {utsPercentage}
                                                </TableCell>
                                                <TableCell className="border bg-gray-100/50 text-center font-medium">
                                                    {uasPercentage}
                                                </TableCell>

                                                {/* Nilai Akhir & Huruf Mutu */}
                                                <TableCell className="border bg-blue-50/30 text-center font-bold text-blue-600">
                                                    {finalScore}
                                                </TableCell>
                                                <TableCell className="border bg-green-50/30 text-center font-bold text-green-600">
                                                    {letterGrade}
                                                </TableCell>
                                                <TableCell className="border text-center">
                                                    {studentAttendances > 0 ||
                                                    studentTasksSum > 0 ||
                                                    studentUts > 0 ||
                                                    studentUas > 0 ? (
                                                        <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                                                            Sudah Diisi
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 ring-1 ring-inset ring-amber-600/20">
                                                            Belum Diisi
                                                        </span>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </form>
                    )}
                </CardContent>
                <CardFooter className="flex w-full flex-col items-center justify-between gap-y-2 border-t py-3 lg:flex-row">
                    <p className="text-sm text-muted-foreground">
                        Menampilkan Seluruh <span className="font-medium text-blue-600">{meta.from ?? 0}</span> dari{' '}
                        {meta.total} Mahasiswa
                    </p>
                    <div className="overflow-x-auto">
                        {meta.has_pages && <PaginationTable meta={meta} links={links} />}
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}

Index.layout = (page) => <AppLayout title={page.props.page_settings.title} children={page} />;
