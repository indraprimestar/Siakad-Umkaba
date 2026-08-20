import EmptyState from '@/Components/EmptyState';
import Grades from '@/Components/Grades';
import HeaderTitle from '@/Components/HeaderTitle';
import PaginationTable from '@/Components/PaginationTable';
import ShowFilter from '@/Components/ShowFilter';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import UseFilter from '@/hooks/UseFilter';
import AppLayout from '@/Layouts/AppLayout';
import { formatDateIndo } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { IconArrowLeft, IconArrowsDownUp, IconRefresh, IconSchool } from '@tabler/icons-react';
import { useState } from 'react';

export default function Index(props) {
    const { data: studyResults, meta, links } = props.studyResults;
    const [params, setParams] = useState(props.state);
    const onSortable = (field) => {
        setParams({
            ...params,
            sort: field,
            direction: params.direction == 'asc' ? 'desc' : 'asc',
        });
    };

    UseFilter({
        route: route('operators.study-results.index', props.student),
        values: params,
        only: ['studyResults'],
    });

    return (
        <div className="flex w-full flex-col pb-32">
            <div className="mb-8 flex flex-col items-start justify-between gap-y-4 lg:flex-row lg:items-center">
                <HeaderTitle
                    title={props.page_settings.title}
                    subtitle={props.page_settings.subtitle}
                    icon={IconSchool}
                ></HeaderTitle>
                <Button variant="orange" size="xl" className="w-full lg:w-auto" asChild>
                    <Link href={route('operators.students.index', props.student)}>
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
                    {studyResults.length == 0 ? (
                        <EmptyState
                            icon={IconSchool}
                            title="Tidak ada KHS"
                            subtitle="Belum ada Kartu Hasil Studi untuk mahasiswa ini."
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
                                    <TableHead>
                                        <Button
                                            variant="ghost"
                                            className="incline-flex group"
                                            onClick={() => onSortable('student_id')}
                                        >
                                            Nama
                                            <span className="text-mute-foreground ml-2 flex-none rounded">
                                                <IconArrowsDownUp className="size-4" />
                                            </span>
                                        </Button>
                                    </TableHead>
                                    <TableHead>Nomor Pokok Mahasiswa</TableHead>
                                    <TableHead>
                                        <Button
                                            variant="ghost"
                                            className="incline-flex group"
                                            onClick={() => onSortable('academic_year_id')}
                                        >
                                            Tahun Ajaran
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
                                    <TableHead>Status Penilaian</TableHead>
                                    <TableHead>Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {studyResults.map((studyResult, index) => {
                                    const hasGrades = studyResult.grades?.some((g) => g.letter && g.letter !== '-');
                                    return (
                                        <TableRow key={index}>
                                            <TableCell>{index + 1 + (meta.current_page - 1) * meta.per_page}</TableCell>
                                            <TableCell>{studyResult.student.name}</TableCell>
                                            <TableCell>{studyResult.student.student_number}</TableCell>
                                            <TableCell>{studyResult.academicYear.name}</TableCell>
                                            <TableCell>{studyResult.semester}</TableCell>
                                            <TableCell>{formatDateIndo(studyResult.created_at)}</TableCell>
                                            <TableCell>
                                                {hasGrades ? (
                                                    <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                                                        Sudah Dinilai
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 ring-1 ring-inset ring-amber-600/20">
                                                        Belum Dinilai
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-x-1">
                                                    <Grades
                                                        studyResult={studyResult}
                                                        grades={studyResult.grades}
                                                        name={studyResult.student.name}
                                                    />
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
                <CardFooter className="flex w-full flex-col items-center justify-between gap-y-2 border-t py-3 lg:flex-row">
                    <p className="text-sm text-muted-foreground">
                        Menampilkan <span className="font-medium text-blue-600">{meta.from ?? 0}</span> dari{' '}
                        {meta.total} Kartu Hasil Studi
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
