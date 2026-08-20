import EmptyState from '@/Components/EmptyState';
import HeaderTitle from '@/Components/HeaderTitle';
import PaginationTable from '@/Components/PaginationTable';
import ShowFilter from '@/Components/ShowFilter';
import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/Components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/Components/ui/dialog';
import { Input } from '@/Components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import UseFilter from '@/hooks/UseFilter';
import AppLayout from '@/Layouts/AppLayout';
import { formatDateIndo } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { IconArrowLeft, IconArrowsDownUp, IconBuilding, IconEye, IconRefresh, IconUsers } from '@tabler/icons-react';
import { useState } from 'react';
import Approve from './Approve';

export default function Index(props) {
    const { data: studyPlans, meta, links } = props.studyPlans;
    const [params, setParams] = useState(props.state);
    const [selectedStudyPlan, setSelectedStudyPlan] = useState(null);
    const [openDetail, setOpenDetail] = useState(false);

    const onSortable = (field) => {
        setParams({
            ...params,
            sort: field,
            direction: params.direction == 'asc' ? 'desc' : 'asc',
        });
    };

    const onShowDetail = (studyPlan) => {
        setSelectedStudyPlan(studyPlan);
        setOpenDetail(true);
    };

    const getStatusBadge = (status) => {
        const variants = {
            Pending: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
            Approved: 'bg-green-100 text-green-800 hover:bg-green-100',
            Rejected: 'bg-red-100 text-red-800 hover:bg-red-100',
        };

        const labels = {
            Pending: 'Pending',
            Approved: 'Disetujui',
            Rejected: 'Ditolak',
        };

        return (
            <Badge className={variants[status] ?? 'bg-gray-100 text-gray-800 hover:bg-gray-100'}>
                {labels[status] ?? status}
            </Badge>
        );
    };

    UseFilter({
        route: route('operators.study-plans.index', props.student),
        values: params,
        only: ['studyPlans'],
    });

    return (
        <div className="flex w-full flex-col pb-32">
            <div className="mb-8 flex flex-col items-start justify-between gap-y-4 lg:flex-row lg:items-center">
                <HeaderTitle
                    title={props.page_settings.title}
                    subtitle={props.page_settings.subtitle}
                    icon={IconBuilding}
                ></HeaderTitle>
                <Button variant="orange" size="xl" className="w-full lg:w-auto" asChild>
                    <Link href={route('operators.students.index')}>
                        <IconArrowLeft className="size-4" />
                        Kembali
                    </Link>
                </Button>
            </div>
            <Card>
                <CardHeader className="mb-4 p-0">
                    {/*filter*/}
                    <div className="flex w-full flex-col gap-4 px-6 py-4 lg:flex-row lg:items-center">
                        <Input
                            className="w-full sm:w-1/4"
                            placeholder="Search...."
                            value={params?.search}
                            onChange={(e) => setParams((prev) => ({ ...prev, search: e.target.value }))}
                        />
                        <Select value={params?.load} onValueChange={(e) => setParams({ ...params, load: e })}>
                            <SelectTrigger className="w-full sm:w-24">
                                <SelectValue placeholder="Load" />
                            </SelectTrigger>
                            <SelectContent>
                                {[10, 25, 50, 75, 100].map((number, index) => (
                                    <SelectItem key={index} value={number}>
                                        {number}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button variant="red" onClick={() => setParams(props.state)} size="xl">
                            <IconRefresh className="size-4" />
                            Bersihkan
                        </Button>
                    </div>
                    {/*show filter*/}
                    <ShowFilter params={params} />
                </CardHeader>
                <CardContent className="p-0 [&-td]:whitespace-nowrap [&-td]:px-6 [&-th]:py-6">
                    {studyPlans.length == 0 ? (
                        <EmptyState
                            icon={IconBuilding}
                            title="Tidak ada kartu rencana studi"
                            subtitle="Mulailah atau Silahkan tambahkan kartu rencana studi"
                        />
                    ) : (
                        <Table className="w-full">
                            <TableHeader>
                                <TableRow>
                                    <TableHead>
                                        <Button
                                            variant="ghost"
                                            className="incline-flex group"
                                            onClick={() => onSortable('id')}
                                        >
                                            #
                                            <span className="text-mute-foreground ml-2 flex-none rounded">
                                                <IconArrowsDownUp className="size-4" />
                                            </span>
                                        </Button>
                                    </TableHead>
                                    <TableHead>Nama</TableHead>
                                    <TableHead>Kelas</TableHead>

                                    <TableHead>
                                        <Button
                                            variant="ghost"
                                            className="incline-flex group"
                                            onClick={() => onSortable('student_number')}
                                        >
                                            Nomor Pokok Mahasiswa
                                            <span className="text-mute-foreground ml-2 flex-none rounded">
                                                <IconArrowsDownUp className="size-4" />
                                            </span>
                                        </Button>
                                    </TableHead>
                                    <TableHead>
                                        <Button
                                            variant="ghost"
                                            className="incline-flex group"
                                            onClick={() => onSortable('academic_year_id')}
                                        >
                                            Tahun Akademik
                                            <span className="text-mute-foreground ml-2 flex-none rounded">
                                                <IconArrowsDownUp className="size-4" />
                                            </span>
                                        </Button>
                                    </TableHead>

                                    <TableHead>
                                        <Button
                                            variant="ghost"
                                            className="incline-flex group"
                                            onClick={() => onSortable('status')}
                                        >
                                            Status
                                            <span className="text-mute-foreground ml-2 flex-none rounded">
                                                <IconArrowsDownUp className="size-4" />
                                            </span>
                                        </Button>
                                    </TableHead>

                                    <TableHead>
                                        <Button
                                            variant="ghost"
                                            className="incline-flex group"
                                            onClick={() => onSortable('notes')}
                                        >
                                            Catatan
                                            <span className="text-mute-foreground ml-2 flex-none rounded">
                                                <IconArrowsDownUp className="size-4" />
                                            </span>
                                        </Button>
                                    </TableHead>

                                    <TableHead>
                                        <Button
                                            variant="ghost"
                                            className="incline-flex group"
                                            onClick={() => onSortable('semester')}
                                        >
                                            Semester
                                            <span className="text-mute-foreground ml-2 flex-none rounded">
                                                <IconArrowsDownUp className="size-4" />
                                            </span>
                                        </Button>
                                    </TableHead>

                                    <TableHead>
                                        <Button
                                            variant="ghost"
                                            className="incline-flex group"
                                            onClick={() => onSortable('created_at')}
                                        >
                                            Dibuat Pada
                                            <span className="text-mute-foreground ml-2 flex-none rounded">
                                                <IconArrowsDownUp className="size-4" />
                                            </span>
                                        </Button>
                                    </TableHead>
                                    <TableHead>Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {studyPlans.map((studyPlan, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{index + 1 + (meta.current_page - 1) * meta.per_page}</TableCell>
                                        <TableCell className="flex items-center gap-2">
                                            <Avatar>
                                                <AvatarImage src={studyPlan.student.avatar} />
                                                <AvatarFallback>
                                                    {studyPlan.student.name.substring(0, 1)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span>{studyPlan.student.name}</span>
                                        </TableCell>
                                        <TableCell>{studyPlan.student.classroom}</TableCell>
                                        <TableCell>{studyPlan.student.student_number}</TableCell>
                                        <TableCell>{studyPlan.academicYear?.name}</TableCell>
                                        <TableCell>{getStatusBadge(studyPlan.status)}</TableCell>
                                        <TableCell>{studyPlan.notes}</TableCell>
                                        <TableCell>{studyPlan.semester}</TableCell>
                                        <TableCell>{formatDateIndo(studyPlan.created_at)}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-x-1">
                                                <Button
                                                    variant="purple"
                                                    size="icon"
                                                    onClick={() => onShowDetail(studyPlan)}
                                                >
                                                    <IconEye className="size-4" />
                                                </Button>
                                                {/* approve */}
                                                <Approve
                                                    name={studyPlan.student.name}
                                                    statuses={props.statuses}
                                                    action={route('operators.study-plans.approve', [
                                                        props.student,
                                                        studyPlan,
                                                    ])}
                                                />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
                <CardFooter className="flex w-full flex-col items-center justify-between gap-y-2 border-t py-3 lg:flex-row">
                    <p className="text-sm text-muted-foreground">
                        Menampilkan <span className="font-medium text-blue-600">{meta.from ?? 0}</span> dari{' '}
                        {meta.total} Kartu Rencana Studi
                    </p>
                    <div className="overflow-x-auto">
                        {meta.has_pages && <PaginationTable meta={meta} links={links} />}
                    </div>
                </CardFooter>
            </Card>

            {/* Dialog Detail KRS */}
            <Dialog open={openDetail} onOpenChange={setOpenDetail}>
                <DialogContent className="max-w-3xl overflow-hidden p-0">
                    {/* Header with gradient */}
                    <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 px-6 py-5 text-white">
                        <DialogHeader className="space-y-1">
                            <DialogTitle className="text-lg font-semibold text-white">
                                Detail Kartu Rencana Studi
                            </DialogTitle>
                            <DialogDescription className="text-purple-100">
                                Informasi lengkap KRS mahasiswa yang diajukan
                            </DialogDescription>
                        </DialogHeader>
                    </div>

                    <div className="space-y-4 px-6 py-4">
                        {/* Student Info Card */}
                        <div className="flex flex-col items-start gap-4 rounded-xl border bg-gradient-to-br from-slate-50 to-white p-4 shadow-sm sm:flex-row sm:items-center">
                            <Avatar className="h-14 w-14 ring-2 ring-purple-200 ring-offset-2">
                                <AvatarImage src={selectedStudyPlan?.student?.avatar} />
                                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-indigo-600 text-lg font-bold text-white">
                                    {selectedStudyPlan?.student?.name?.substring(0, 1)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-1">
                                <h3 className="text-base font-semibold text-gray-900">
                                    {selectedStudyPlan?.student?.name}
                                </h3>
                                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                                    <span>
                                        NIM:{' '}
                                        <span className="font-medium text-gray-700">
                                            {selectedStudyPlan?.student?.student_number}
                                        </span>
                                    </span>
                                    <span>
                                        Kelas:{' '}
                                        <span className="font-medium text-gray-700">
                                            {selectedStudyPlan?.student?.classroom}
                                        </span>
                                    </span>
                                    <span>
                                        Semester:{' '}
                                        <span className="font-medium text-gray-700">{selectedStudyPlan?.semester}</span>
                                    </span>
                                </div>
                                <div className="flex flex-wrap items-center gap-2 pt-1">
                                    <Badge
                                        variant="outline"
                                        className="border-indigo-200 bg-indigo-50 text-xs text-indigo-700"
                                    >
                                        {selectedStudyPlan?.academicYear?.name}
                                    </Badge>
                                    {getStatusBadge(selectedStudyPlan?.status)}
                                </div>
                            </div>
                        </div>

                        {/* Rejection Note */}
                        {selectedStudyPlan?.status === 'Rejected' && selectedStudyPlan?.notes && (
                            <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-3.5">
                                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-100">
                                    <span className="text-xs font-bold text-red-600">!</span>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-red-800">Catatan Penolakan</p>
                                    <p className="mt-0.5 text-sm text-red-700">{selectedStudyPlan.notes}</p>
                                </div>
                            </div>
                        )}

                        {/* SKS Summary */}
                        {selectedStudyPlan?.schedules?.length > 0 && (
                            <div className="flex items-center justify-between rounded-lg border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3">
                                <div className="flex items-center gap-2">
                                    <IconUsers className="size-4 text-blue-600" />
                                    <span className="text-sm font-medium text-blue-900">
                                        Total Mata Kuliah:{' '}
                                        <span className="font-bold">{selectedStudyPlan.schedules.length}</span>
                                    </span>
                                </div>
                                <div className="text-sm font-medium text-blue-900">
                                    Total SKS:{' '}
                                    <span className="font-bold text-blue-700">
                                        {selectedStudyPlan.schedules.reduce(
                                            (sum, s) => sum + (s.course?.credit || 0),
                                            0,
                                        )}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Table */}
                        <div className="max-h-[350px] overflow-y-auto rounded-lg border">
                            <Table className="w-full">
                                <TableHeader>
                                    <TableRow className="bg-gray-50/80">
                                        <TableHead className="w-12 text-center font-semibold">#</TableHead>
                                        <TableHead className="font-semibold">Mata Kuliah</TableHead>
                                        <TableHead className="w-16 text-center font-semibold">SKS</TableHead>
                                        <TableHead className="font-semibold">Kelas</TableHead>
                                        <TableHead className="font-semibold">Tahun Ajaran</TableHead>
                                        <TableHead className="font-semibold">Waktu</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {selectedStudyPlan?.schedules?.length > 0 ? (
                                        selectedStudyPlan.schedules.map((schedule, index) => (
                                            <TableRow
                                                key={schedule.id ?? index}
                                                className="transition-colors hover:bg-purple-50/50"
                                            >
                                                <TableCell className="text-center font-medium text-gray-500">
                                                    {index + 1}
                                                </TableCell>
                                                <TableCell className="font-medium text-gray-900">
                                                    {schedule.course?.name}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 text-xs font-bold text-purple-700">
                                                        {schedule.course?.credit}
                                                    </span>
                                                </TableCell>
                                                <TableCell>{schedule.classroom?.name}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="text-xs font-normal">
                                                        {schedule.academicYear?.name}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                                                            {schedule.day_of_week}
                                                        </span>
                                                        <span className="text-xs text-gray-500">
                                                            {schedule.start_time} - {schedule.end_time}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={6} className="py-8 text-center">
                                                <div className="flex flex-col items-center gap-2">
                                                    <IconUsers className="size-8 text-gray-300" />
                                                    <p className="text-sm text-muted-foreground">
                                                        Tidak ada jadwal yang diajukan
                                                    </p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

Index.layout = (page) => <AppLayout title={page.props.page_settings.title} children={page} />;
