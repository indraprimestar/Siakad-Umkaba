import HeaderTitle from '@/Components/HeaderTitle';
import { Alert, AlertDescription } from '@/Components/ui/alert';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import StudentLayout from '@/Layouts/StudentLayout';
import { Link } from '@inertiajs/react';
import { IconArrowLeft, IconBook } from '@tabler/icons-react';
import { useState } from 'react';

const DAY_LABELS = {
    monday: 'Senin',
    tuesday: 'Selasa',
    wednesday: 'Rabu',
    thursday: 'Kamis',
    friday: 'Jumat',
    saturday: 'Sabtu',
    sunday: 'Minggu',
};

const STATUS_BADGE = {
    approved: { label: 'Approve', className: 'bg-green-100 text-green-700' },
    accepted: { label: 'Approve', className: 'bg-green-100 text-green-700' },
    rejected: { label: 'Reject', className: 'bg-red-100 text-red-700' },
    pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-700' },
};

const formatDay = (day) => {
    if (!day) return '-';
    return DAY_LABELS[day.toLowerCase()] || day;
};

const formatTime = (time) => {
    if (!time) return '';
    // antisipasi format "07:00:00" dari backend, ambil HH:mm saja
    return time.slice(0, 5);
};

export default function Show({ studyPlan }) {
    const [search, setSearch] = useState('');

    const schedules = studyPlan?.schedules ?? [];

    const filteredSchedules = schedules.filter((schedule) => {
        const courseName = schedule.course?.name?.toLowerCase() ?? '';
        const classroomName = schedule.classroom?.name?.toLowerCase() ?? '';
        const keyword = search.toLowerCase();
        return courseName.includes(keyword) || classroomName.includes(keyword);
    });

    const statusKey = studyPlan?.status?.toLowerCase();
    const statusBadge = STATUS_BADGE[statusKey] || {
        label: studyPlan?.status ?? '-',
        className: 'bg-gray-100 text-gray-700',
    };

    return (
        <div className="flex w-full flex-col pb-32">
            <div className="mb-8 flex flex-col items-start justify-between gap-y-4 lg:flex-row lg:items-center">
                <HeaderTitle
                    title="Detail kartu rencana studi"
                    subtitle="Anda dapat melihat kartu rencana studi yang sudah anda ajukan sebelumnya"
                    icon={IconBook}
                />
                <Button variant="orange" size="xl" className="w-full lg:w-auto" asChild>
                    <Link href={route('students.study-plans.index')}>
                        <IconArrowLeft className="size-4" />
                        Kembali
                    </Link>
                </Button>
            </div>

            <Card>
                <CardContent className="p-6">
                    <div className="mb-6">
                        <Input
                            type="text"
                            placeholder="Cari mata kuliah atau kelas..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="text-base"
                        />
                    </div>

                    <div className="overflow-x-auto">
                        {studyPlan?.status?.toLowerCase() === 'rejected' && (
                            <Alert variant="destructive" className="mb-4">
                                <AlertDescription>
                                    {studyPlan?.notes ??
                                        'KRS Anda ditolak oleh Dosen Wali. Silakan lakukan perbaikan dan ajukan kembali.'}
                                </AlertDescription>
                            </Alert>
                        )}
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b">
                                    <th className="px-2 py-3 font-medium text-muted-foreground">#</th>
                                    <th className="px-2 py-3 font-medium text-muted-foreground">Mata Kuliah</th>
                                    <th className="px-2 py-3 font-medium text-muted-foreground">SKS</th>
                                    <th className="px-2 py-3 font-medium text-muted-foreground">Kelas</th>
                                    <th className="px-2 py-3 font-medium text-muted-foreground">Tahun Ajaran</th>
                                    <th className="px-2 py-3 font-medium text-muted-foreground">Waktu</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredSchedules.length > 0 ? (
                                    filteredSchedules.map((schedule, index) => (
                                        <tr key={schedule.id} className="border-b last:border-0">
                                            <td className="px-2 py-3">{index + 1}</td>
                                            <td className="px-2 py-3">{schedule.course?.name ?? '-'}</td>
                                            <td className="px-2 py-3">{schedule.course?.credit ?? '-'}</td>
                                            <td className="px-2 py-3">{schedule.classroom?.name ?? '-'}</td>
                                            <td className="px-2 py-3">{studyPlan.academicYear?.name ?? '-'}</td>
                                            <td className="px-2 py-3">
                                                {formatDay(schedule.day_of_week)}, {formatTime(schedule.start_time)} -{' '}
                                                {formatTime(schedule.end_time)}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-2 py-6 text-center text-muted-foreground">
                                            Belum ada jadwal pada KRS ini.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-6 flex flex-col items-start justify-between gap-2 lg:flex-row lg:items-center">
                        <p className="text-sm">
                            Tahun ajaran:{' '}
                            <span className="font-semibold text-blue-600">{studyPlan.academicYear?.name ?? '-'}</span>
                        </p>
                        <p className="text-sm">
                            Status:{' '}
                            <span className={`rounded px-2 py-1 text-xs font-semibold ${statusBadge.className}`}>
                                {statusBadge.label}
                            </span>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

Show.layout = (page) => <StudentLayout title="Detail KRS" children={page} />;
