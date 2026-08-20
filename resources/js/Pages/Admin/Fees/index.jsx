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
import { formatDateIndo } from '@/lib/utils';
import { IconArrowsDownUp, IconMoneybag, IconRefresh } from '@tabler/icons-react';
import { useState } from 'react';

export default function Index(props) {
    const { data: fees, meta, links } = props.fees;
    const [params, setParams] = useState(props.state);
    const onSortable = (field) => {
        setParams((prev) => ({
            // setParams({
            ...params,
            sort: field,
            // direction: params.direction == 'asc' ? 'desc' : 'asc',
            direction: prev.direction == 'asc' ? 'desc' : 'asc', // pakai ini dan bawah
            page: 1, // untuk searchnya bisa di halaman mana aja
        }));
    };

    UseFilter({
        route: route('admin.fees.index'),
        values: params,
        only: ['fees'],
    });
    return (
        <div className="flex w-full flex-col pb-32">
            <div className="mb-8 flex flex-col items-start justify-between gap-y-4 lg:flex-row lg:items-center">
                <HeaderTitle
                    title={props.page_settings.title}
                    subtitle={props.page_settings.subtitle}
                    icon={IconMoneybag}
                ></HeaderTitle>
                {/* <Button variant="orange" size="xl" className="w-full lg:w-auto" asChild>
                    <Link href={route('admin.departments.create')}>
                        <IconPlus className="size-4" />
                        Tambah
                    </Link>
                </Button> */}
            </div>
            <Card>
                <CardHeader className="mb-4 p-0">
                    {/*filter*/}
                    <div className="flex w-full flex-col gap-4 px-6 py-4 lg:flex-row lg:items-center">
                        <Input
                            className="w-full sm:w-1/4"
                            placeholder="Search...."
                            value={params?.search}
                            // onChange={(e) => setParams((prev) => ({ ...prev, search: e.target.value }))}
                            onChange={(e) => setParams((prev) => ({ ...prev, search: e.target.value, page: 1 }))} // ini ditambah
                        />
                        {/* <Select value={params?.load} onValueChange={(e) => setParams({ ...params, load: e })}> */}
                        <Select
                            value={String(params?.load)}
                            onValueChange={(val) => setParams((prev) => ({ ...prev, load: val, page: 1 }))}
                        >
                            <SelectTrigger className="w-full sm:w-24">
                                <SelectValue placeholder="Load" />
                            </SelectTrigger>
                            <SelectContent>
                                {/* {[10, 25, 50, 75, 100].map((number) => (
                                    <SelectItem key={number} value={String(number)}> */}
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
                    <ShowFilter params={params} />
                </CardHeader>
                <CardContent className="p-0 [&-td]:whitespace-nowrap [&-td]:px-6 [&-th]:py-6">
                    {fees.length == 0 ? (
                        <EmptyState
                            icon={IconMoneybag}
                            title="Tidak ada uang kuliah tunggal"
                            subctitle="Mulailah atau Silahkan uang kuliah tunggal"
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
                                        Fakultas
                                        {/* <Button
                                            variant="ghost"
                                            className="incline-flex group"
                                            onClick={() => onSortable('faculty_id')}
                                        >
                                            Fakultas
                                            <span className="text-mute-foreground ml-2 flex-none rounded">
                                                <IconArrowsDownUp className="size-4" />
                                            </span>
                                        </Button> */}
                                    </TableHead>
                                    <TableHead>
                                        <Button
                                            variant="ghost"
                                            className="incline-flex group"
                                            onClick={() => onSortable('name')}
                                        >
                                            Nama
                                            <span className="text-mute-foreground ml-2 flex-none rounded">
                                                <IconArrowsDownUp className="size-4" />
                                            </span>
                                        </Button>
                                    </TableHead>
                                    <TableHead>N.I.M</TableHead>
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
                                    {/* <TableHead>Logo</TableHead> */}
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
                                {fees.map((fee, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{index + 1 + (meta.current_page - 1) * meta.per_page}</TableCell>
                                        <TableCell>{fee.student.faculty}</TableCell>
                                        <TableCell>{fee.student.department}</TableCell>
                                        <TableCell>{fee.student.student_number}</TableCell>
                                        <TableCell>{fee.semester}</TableCell>
                                        <TableCell>{fee.status}</TableCell>
                                        {/* <TableCell>
                                            <Avatar>
                                                <AvatarImage src={faculty.logo} />
                                                <AvatarFallback>{faculty.name.substring(0, 1)}</AvatarFallback>
                                            </Avatar>
                                        </TableCell> */}
                                        <TableCell>{formatDateIndo(fee.created_at)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
                <CardFooter className="flex w-full flex-col items-center justify-between gap-y-2 border-t py-3 lg:flex-row">
                    <p className="text-sm text-muted-foreground">
                        Menampilkan <span className="font-medium text-blue-600">{meta.from ?? 0}</span> dari{' '}
                        {meta.total} uang kuliah tunggal
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
