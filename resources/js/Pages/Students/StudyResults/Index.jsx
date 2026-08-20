import EmptyState from '@/Components/EmptyState';
import Grades from '@/Components/Grades';
import HeaderTitle from '@/Components/HeaderTitle';
import PaginationTable from '@/Components/PaginationTable';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import UseFilter from '@/hooks/UseFilter';
import StudentLayout from '@/Layouts/StudentLayout';
import { formatDateIndo } from '@/lib/utils';
import { usePage } from '@inertiajs/react';
import { IconArrowsDownUp, IconBuilding, IconRefresh } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function Index(props) {
    const auth = usePage().props.auth.user;
    const { data: studyResults, meta, links } = props.studyResults;
    const { flash } = usePage().props;
    const [params, setParams] = useState(props.state);

    // Handle flash message dari redirect/create
    useEffect(() => {
        if (flash?.message) {
            toast[flash.type || 'info'](flash.message);
        }
    }, [flash?.message, flash?.type]);

    const onSortable = (field) => {
        setParams((prev) => ({
            ...prev,
            sort: field,
            direction: prev.direction === 'asc' ? 'desc' : 'asc',
            page: 1,
        }));
    };

    UseFilter({
        route: route('students.study-results.index'),
        values: params,
        only: ['studyResults'],
    });

    return (
        <div className="flex w-full flex-col pb-32">
            <div className="mb-8 flex flex-col items-start justify-between gap-y-4 lg:flex-row lg:items-center">
                <HeaderTitle
                    title={props.page_settings.title}
                    subtitle={props.page_settings.subtitle}
                    icon={IconBuilding}
                />
            </div>
            <div className="flex flex-col gap-y-8">
                {/*filter*/}
                <div className="flex w-full flex-col gap-4 lg:flex-row lg:items-center">
                    <Input
                        className="w-full sm:w-1/4"
                        placeholder="Search...."
                        value={params?.search}
                        onChange={(e) => setParams((prev) => ({ ...prev, search: e.target.value, page: 1 }))}
                    />
                    <Select
                        value={String(params?.load)}
                        onValueChange={(val) => setParams((prev) => ({ ...prev, load: val, page: 1 }))}
                    >
                        <SelectTrigger className="w-full sm:w-24">
                            <SelectValue placeholder="Load" />
                        </SelectTrigger>
                        <SelectContent>
                            {[10, 25, 50, 75, 100].map((number) => (
                                <SelectItem key={number} value={String(number)}>
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
                {studyResults.length == 0 ? (
                    <EmptyState
                        icon={IconBuilding}
                        title="Tidak ada Kartu Hasil Studi"
                        subctitle="Belum ada data Kartu Hasil Studi yang tersedia."
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
                                <TableHead>Status Penilaian</TableHead>
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
                            {studyResults.map((studyResult, index) => {
                                const hasGrades = studyResult.grades?.some((g) => g.letter && g.letter !== '-');
                                return (
                                    <TableRow key={index}>
                                        <TableCell>{index + 1 + (meta.current_page - 1) * meta.per_page}</TableCell>
                                        <TableCell className="font-medium">{studyResult.academicYear?.name}</TableCell>
                                        <TableCell>{studyResult.semester}</TableCell>
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
                                        <TableCell>{formatDateIndo(studyResult.created_at)}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-x-1">
                                                <Grades
                                                    studyResult={studyResult}
                                                    grades={studyResult.grades}
                                                    name={auth?.name}
                                                />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                )}
                <div className="flex w-full flex-col items-center justify-between py-3 lg:flex-row">
                    <p className="text-sm text-muted-foreground">
                        Menampilkan <span className="font-medium text-blue-600">{meta.from ?? 0}</span> dari{' '}
                        {meta.total} kartu hasil studi
                    </p>
                    <div className="overflow-x-auto">
                        {meta.has_pages && <PaginationTable meta={meta} links={links} />}
                    </div>
                </div>
            </div>
        </div>
    );
}

Index.layout = (page) => <StudentLayout title={page.props.page_settings.title} children={page} />;
