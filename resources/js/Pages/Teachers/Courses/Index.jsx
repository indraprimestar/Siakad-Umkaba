import EmptyState from '@/Components/EmptyState';
import HeaderTitle from '@/Components/HeaderTitle';
import PaginationTable from '@/Components/PaginationTable';
import ShowFilter from '@/Components/ShowFilter';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/Components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';
import { Input } from '@/Components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import UseFilter from '@/hooks/UseFilter';
import AppLayout from '@/Layouts/AppLayout';
import { Link } from '@inertiajs/react';
import { IconBooks, IconDotsVertical, IconRefresh } from '@tabler/icons-react';
import { useState } from 'react';

export default function Index(props) {
    const { data: courses, meta, links } = props.courses;
    const [params, setParams] = useState(props.state);
    const onSortable = (field) => {
        setParams({
            ...params,
            sort: field,
            direction: params.direction == 'asc' ? 'desc' : 'asc',
        });
    };

    UseFilter({
        route: route('teachers.courses.index'),
        values: params,
        only: ['courses'],
    });

    return (
        <div className="flex w-full flex-col pb-32">
            <div className="mb-8 flex flex-col items-start justify-between gap-y-4 lg:flex-row lg:items-center">
                <HeaderTitle
                    title={props.page_settings.title}
                    subtitle={props.page_settings.subtitle}
                    icon={IconBooks}
                ></HeaderTitle>
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
                                    <SelectItem key={index} value={number.toString()}>
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
                <CardContent className="p-6">
                    {courses.length == 0 ? (
                        <EmptyState
                            icon={IconBooks}
                            title="Tidak Ada Mata Kuliah"
                            subctitle="Mulailah atau Silahkan Tambahkan Mata Kuliah Baru"
                        />
                    ) : (
                        <ul role="list" className="grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-3">
                            {courses.map((course, index) => (
                                <li
                                    key={index}
                                    className="overflow-hidden rounded-xl border border-secondary bg-background transition-colors hover:bg-accent/50"
                                >
                                    <div className="flex items-center justify-between border-b border-secondary p-6">
                                        <Link
                                            href={route('teachers.courses.show', [course])}
                                            className="text-base font-bold leading-relaxed text-foreground transition-colors hover:text-blue-600"
                                        >
                                            {course.name}
                                        </Link>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                                >
                                                    <IconDotsVertical className="size-4"></IconDotsVertical>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-48">
                                                <DropdownMenuItem asChild>
                                                    <Link href={route('teachers.courses.show', [course])}>
                                                        <IconBooks className="mr-2 size-4" />
                                                        Lihat Kelas
                                                    </Link>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                    <div className="flex flex-col gap-4 p-6 text-sm">
                                        <div className="flex items-center justify-between">
                                            <span className="font-semibold text-muted-foreground">Fakultas</span>
                                            <span className="text-right font-semibold text-foreground">
                                                {course.faculty?.name ?? '-'}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="font-semibold text-muted-foreground">Program Studi</span>
                                            <span className="text-right font-semibold text-foreground">
                                                {course.department?.name ?? '-'}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="font-semibold text-muted-foreground">
                                                Satuan Kredit Semester (SKS)
                                            </span>
                                            <span className="text-right font-semibold text-foreground">
                                                {course.credit}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="font-semibold text-muted-foreground">Semester</span>
                                            <span className="text-right font-semibold text-foreground">
                                                {course.semester}
                                            </span>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </CardContent>
                <CardFooter className="flex w-full flex-col items-center justify-between gap-y-2 border-t py-3 lg:flex-row">
                    <p className="text-sm text-muted-foreground">
                        Menampilkan Seluruh <span className="font-medium text-blue-600">{meta.from ?? 0}</span> dari{' '}
                        {meta.total} Mata kuliah
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
