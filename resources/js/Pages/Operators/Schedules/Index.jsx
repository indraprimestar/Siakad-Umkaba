import AlertAction from '@/Components/AlertAction';
import EmptyState from '@/Components/EmptyState';
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
import { deleteAction, formatDateIndo } from '@/lib/utils';
import { Link, usePage } from '@inertiajs/react';
import { IconArrowsDownUp, IconCalendar, IconPencil, IconPlus, IconRefresh, IconTrash } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function Index(props) {
    const { data: schedules, meta, links } = props.schedules;
    const [params, setParams] = useState(props.state);
    const { flash } = usePage().props;

    // Handle flash message dari redirect/delete
    useEffect(() => {
        if (flash?.message) {
            toast[flash.type || 'info'](flash.message);
        }
    }, [flash]);

    const onSortable = (field) => {
        setParams({
            ...params,
            sort: field,
            direction: params.direction == 'asc' ? 'desc' : 'asc',
        });
    };

    UseFilter({
        route: route('operators.schedules.index'),
        values: params,
        only: ['schedules'],
    });

    return (
        <div className="flex w-full flex-col pb-32">
            <div className="mb-8 flex flex-col items-start justify-between gap-y-4 lg:flex-row lg:items-center">
                <HeaderTitle
                    title={props.page_settings.title}
                    subtitle={props.page_settings.subtitle}
                    icon={IconCalendar}
                />
                <Button variant="orange" size="lg" className="w-full lg:w-auto" asChild>
                    <Link href={route('operators.schedules.create')}>
                        <IconPlus className="size-4" />
                        Tambah
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader className="border-b">
                    <div className="flex w-full flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <Input
                            className="w-full lg:w-64"
                            placeholder="Cari jadwal..."
                            value={params?.search ?? ''}
                            onChange={(e) => setParams((prev) => ({ ...prev, search: e.target.value }))}
                        />
                        <div className="flex gap-2">
                            <Select
                                value={String(params?.load ?? 10)}
                                onValueChange={(e) => setParams({ ...params, load: parseInt(e) })}
                            >
                                <SelectTrigger className="w-24">
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
                            <Button variant="outline" onClick={() => setParams(props.state)} size="sm">
                                <IconRefresh className="size-4" />
                                Reset
                            </Button>
                        </div>
                    </div>
                    <ShowFilter params={params} />
                </CardHeader>

                <CardContent className="p-0">
                    {schedules.length == 0 ? (
                        <EmptyState
                            icon={IconCalendar}
                            title="Tidak Ada Data Jadwal"
                            subctitle="Mulailah atau Silahkan tambahkan Jadwal baru"
                        />
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-gray-50">
                                        <TableHead className="w-12 text-center">#</TableHead>
                                        <TableHead>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-auto p-0"
                                                onClick={() => onSortable('course_id')}
                                            >
                                                Mata Kuliah
                                                <IconArrowsDownUp className="ml-2 size-4" />
                                            </Button>
                                        </TableHead>
                                        <TableHead>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-auto p-0"
                                                onClick={() => onSortable('classroom_id')}
                                            >
                                                Kelas
                                                <IconArrowsDownUp className="ml-2 size-4" />
                                            </Button>
                                        </TableHead>
                                        <TableHead>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-auto p-0"
                                                onClick={() => onSortable('academicYear_id')}
                                            >
                                                Tahun Ajaran
                                                <IconArrowsDownUp className="ml-2 size-4" />
                                            </Button>
                                        </TableHead>
                                        <TableHead className="text-center">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-auto p-0"
                                                onClick={() => onSortable('start_time')}
                                            >
                                                Mulai
                                                <IconArrowsDownUp className="ml-2 size-4" />
                                            </Button>
                                        </TableHead>
                                        <TableHead className="text-center">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-auto p-0"
                                                onClick={() => onSortable('end_time')}
                                            >
                                                Selesai
                                                <IconArrowsDownUp className="ml-2 size-4" />
                                            </Button>
                                        </TableHead>
                                        <TableHead className="text-center">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-auto p-0"
                                                onClick={() => onSortable('day_of_week')}
                                            >
                                                Hari
                                                <IconArrowsDownUp className="ml-2 size-4" />
                                            </Button>
                                        </TableHead>
                                        <TableHead className="text-center">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-auto p-0"
                                                onClick={() => onSortable('quote')}
                                            >
                                                Kuota
                                                <IconArrowsDownUp className="ml-2 size-4" />
                                            </Button>
                                        </TableHead>
                                        <TableHead>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-auto p-0"
                                                onClick={() => onSortable('created_at')}
                                            >
                                                Dibuat
                                                <IconArrowsDownUp className="ml-2 size-4" />
                                            </Button>
                                        </TableHead>
                                        <TableHead className="text-center">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {schedules.map((schedule, index) => (
                                        <TableRow key={schedule.id} className="hover:bg-gray-50">
                                            <TableCell className="text-center font-medium">
                                                {index + 1 + (meta.current_page - 1) * meta.per_page}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {schedule.course?.name || '-'}
                                            </TableCell>
                                            <TableCell>{schedule.classroom?.name || '-'}</TableCell>
                                            <TableCell>{schedule.academicYear?.name || '-'}</TableCell>
                                            <TableCell className="text-center">{schedule.start_time}</TableCell>
                                            <TableCell className="text-center">{schedule.end_time}</TableCell>
                                            <TableCell className="text-center">{schedule.day_of_week}</TableCell>
                                            <TableCell className="text-center font-semibold text-blue-600">
                                                {schedule.quote}
                                            </TableCell>
                                            <TableCell className="text-sm text-gray-600">
                                                {formatDateIndo(schedule.created_at)}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center justify-center gap-2">
                                                    <Button variant="blue" size="sm" asChild>
                                                        <Link href={route('operators.schedules.edit', schedule.id)}>
                                                            <IconPencil className="size-4" />
                                                        </Link>
                                                    </Button>
                                                    <AlertAction
                                                        trigger={
                                                            <Button variant="red" size="sm">
                                                                <IconTrash className="size-4" />
                                                            </Button>
                                                        }
                                                        action={() =>
                                                            deleteAction(
                                                                route('operators.schedules.destroy', schedule.id),
                                                                {
                                                                    closeModal: () =>
                                                                        setParams({
                                                                            ...params,
                                                                            page: meta.current_page,
                                                                        }),
                                                                },
                                                            )
                                                        }
                                                    />
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>

                <CardFooter className="border-t">
                    <div className="flex w-full items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            Menampilkan <span className="font-semibold text-blue-600">{meta.from ?? 0}</span> -
                            <span className="font-semibold text-blue-600"> {meta.to ?? 0}</span> dari
                            <span className="font-semibold text-blue-600"> {meta.total}</span> jadwal
                        </p>
                        {meta.has_pages && <PaginationTable meta={meta} links={links} />}
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}

Index.layout = (page) => <AppLayout title={page.props.page_settings.title} children={page} />;
