import EmptyState from '@/Components/EmptyState';
import HeaderTitle from '@/Components/HeaderTitle';
import PaginationTable from '@/Components/PaginationTable';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import UseFilter from '@/hooks/UseFilter';
import StudentLayout from '@/Layouts/StudentLayout';
import { formatDateIndo } from '@/lib/utils';
import { Link, router, usePage } from '@inertiajs/react';
import { IconArrowsDownUp, IconBuilding, IconEye, IconPlus, IconRefresh } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function Index(props) {
    const { data: studyPlans, meta, links } = props.studyPlans;
    const { flash } = usePage().props;
    const [params, setParams] = useState(props.state);

    // Handle flash message dari redirect/create
    useEffect(() => {
        if (flash?.message) {
            toast[flash.type || 'info'](flash.message);
        }
    }, [flash?.message, flash?.type]);

    // Check apakah user sudah punya KRS active (status tidak rejected)
    const hasActiveKRS =
        studyPlans && studyPlans.length > 0 && studyPlans.some((krs) => krs.status?.toLowerCase() !== 'rejected');

    const onSortable = (field) => {
        setParams((prev) => ({
            ...params,
            sort: field,
            direction: prev.direction === 'asc' ? 'desc' : 'asc',
            page: 1,
        }));
    };

    UseFilter({
        route: route('students.study-plans.index'),
        values: params,
        only: ['study-plans'],
    });

    return (
        <div className="flex w-full flex-col pb-32">
            <div className="mb-8 flex flex-col items-start justify-between gap-y-4 lg:flex-row lg:items-center">
                <HeaderTitle
                    title={props.page_settings.title}
                    subtitle={props.page_settings.subtitle}
                    icon={IconBuilding}
                />
                <Button
                    variant="orange"
                    size="xl"
                    className="w-full lg:w-auto"
                    onClick={(e) => {
                        if (hasActiveKRS) {
                            e.preventDefault();
                            toast.warning('Anda sudah memiliki KRS aktif untuk semester ini', {
                                id: 'krs-active-warning',
                            });
                            return;
                        }
                        router.visit(route('students.study-plans.create'));
                    }}
                >
                    <IconPlus className="size-4" />
                    Tambah
                </Button>
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
                {studyPlans.length == 0 ? (
                    <EmptyState
                        icon={IconBuilding}
                        title="Tidak ada KRS"
                        subctitle="Mulailah atau Silahkan tambahkan KRS baru"
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
                                    <TableCell className="font-medium">{studyPlan.academicYear?.name ?? '-'}</TableCell>
                                    <TableCell>
                                        <span
                                            className={`rounded px-2 py-1 text-sm font-medium ${
                                                studyPlan.status?.toLowerCase() === 'approved'
                                                    ? 'bg-green-100 text-green-800'
                                                    : studyPlan.status?.toLowerCase() === 'rejected'
                                                      ? 'bg-red-100 text-red-800'
                                                      : 'bg-yellow-100 text-yellow-800'
                                            }`}
                                        >
                                            {studyPlan.status}
                                        </span>
                                    </TableCell>
                                    <TableCell>{formatDateIndo(studyPlan.created_at)}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-x-1">
                                            <Button variant="blue" size="sm" asChild>
                                                <Link href={route('students.study-plans.show', [studyPlan])}>
                                                    <IconEye className="size-4" />
                                                </Link>
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
                <div className="flex w-full flex-col items-center justify-between py-3 lg:flex-row">
                    <p className="text-sm text-muted-foreground">
                        Menampilkan <span className="font-medium text-blue-600">{meta.from ?? 0}</span> dari{' '}
                        {meta.total} kartu rencana studi
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
