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
import { Link } from '@inertiajs/react';
import { IconArrowsDownUp, IconCalendar, IconPencil, IconPlus, IconRefresh, IconTrash } from '@tabler/icons-react';
import { useState } from 'react';

export default function Index(props) {
    const { data: schedules, meta, links } = props.schedules;
    const [params, setParams] = useState(props.state);

    const onSortable = (field) => {
        setParams({
            ...params,
            sort: field,
            direction: params.direction == 'asc' ? 'desc' : 'asc',
        });
    };

    UseFilter({
        route: route('admin.schedules.index'),
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
                ></HeaderTitle>
                <Button variant="orange" size="xl" className="w-full lg:w-auto" asChild>
                    <Link href={route('admin.schedules.create')}>
                        <IconPlus className="size-4" />
                        Tambah
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
                    {schedules.length == 0 ? (
                        <EmptyState
                            icon={IconCalendar}
                            title="Tidak Ada Data Jadwal"
                            subctitle="Mulailah atau Silahkan tambahkan Jadwal baru"
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
                                            onClick={() => onSortable('faculty_id')}
                                        >
                                            Fakultas
                                            <span className="text-mute-foreground ml-2 flex-none rounded">
                                                <IconArrowsDownUp className="size-4" />
                                            </span>
                                        </Button>
                                    </TableHead>
                                    <TableHead>
                                        <Button
                                            variant="ghost"
                                            className="incline-flex group"
                                            onClick={() => onSortable('department_id')}
                                        >
                                            Prodi
                                            <span className="text-mute-foreground ml-2 flex-none rounded">
                                                <IconArrowsDownUp className="size-4" />
                                            </span>
                                        </Button>
                                    </TableHead>

                                    <TableHead>
                                        <Button
                                            variant="ghost"
                                            className="incline-flex group"
                                            onClick={() => onSortable('course_id')}
                                        >
                                            Matkul
                                            <span className="text-mute-foreground ml-2 flex-none rounded">
                                                <IconArrowsDownUp className="size-4" />
                                            </span>
                                        </Button>
                                    </TableHead>

                                    <TableHead>
                                        <Button
                                            variant="ghost"
                                            className="incline-flex group"
                                            onClick={() => onSortable('classroom_id')}
                                        >
                                            Kelas
                                            <span className="text-mute-foreground ml-2 flex-none rounded">
                                                <IconArrowsDownUp className="size-4" />
                                            </span>
                                        </Button>
                                    </TableHead>

                                    <TableHead>
                                        <Button
                                            variant="ghost"
                                            className="incline-flex group"
                                            onClick={() => onSortable('academicYear_id')}
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
                                            onClick={() => onSortable('start_time')}
                                        >
                                            Waktu Mulai
                                            <span className="text-mute-foreground ml-2 flex-none rounded">
                                                <IconArrowsDownUp className="size-4" />
                                            </span>
                                        </Button>
                                    </TableHead>

                                    <TableHead>
                                        <Button
                                            variant="ghost"
                                            className="incline-flex group"
                                            onClick={() => onSortable('end_time')}
                                        >
                                            Waktu Akhir
                                            <span className="text-mute-foreground ml-2 flex-none rounded">
                                                <IconArrowsDownUp className="size-4" />
                                            </span>
                                        </Button>
                                    </TableHead>

                                    <TableHead>
                                        <Button
                                            variant="ghost"
                                            className="incline-flex group"
                                            onClick={() => onSortable('day_of_week')}
                                        >
                                            Hari
                                            <span className="text-mute-foreground ml-2 flex-none rounded">
                                                <IconArrowsDownUp className="size-4" />
                                            </span>
                                        </Button>
                                    </TableHead>

                                    <TableHead>
                                        <Button
                                            variant="ghost"
                                            className="incline-flex group"
                                            onClick={() => onSortable('quote')}
                                        >
                                            Kouta
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
                                {schedules.map((schedules, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{index + 1 + (meta.current_page - 1) * meta.per_page}</TableCell>
                                        <TableCell>{schedules.faculty.name}</TableCell>
                                        <TableCell>{schedules.department.name}</TableCell>
                                        <TableCell>{schedules.course.name}</TableCell>
                                        <TableCell>{schedules.classroom.name}</TableCell>
                                        <TableCell>{schedules.academicYear.name}</TableCell>
                                        <TableCell>{schedules.start_time}</TableCell>
                                        <TableCell>{schedules.end_time}</TableCell>
                                        <TableCell>{schedules.day_of_week}</TableCell>
                                        <TableCell>{schedules.quote}</TableCell>
                                        <TableCell>{formatDateIndo(schedules.created_at)}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-x-1">
                                                <Button variant="blue" size="sm" asChild>
                                                    <Link href={route('admin.schedules.edit', [schedules])}>
                                                        <IconPencil className="size-4" />
                                                        {/* Edit */}
                                                    </Link>
                                                </Button>
                                                <AlertAction
                                                    trigger={
                                                        <Button variant="red" size="sm">
                                                            <IconTrash className="size-4" />
                                                        </Button>
                                                    }
                                                    action={() =>
                                                        deleteAction(route('admin.schedules.destroy', [schedules]), {
                                                            closeModal: () =>
                                                                setParams({ ...params, page: meta.current_page }),
                                                        })
                                                    }
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
                        Menampilkan Seluruh <span className="font-medium text-blue-600">{meta.from ?? 0}</span> dari{' '}
                        {meta.total} Jadwal
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
