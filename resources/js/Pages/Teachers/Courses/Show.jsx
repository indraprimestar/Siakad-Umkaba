import EmptyState from '@/Components/EmptyState';
import HeaderTitle from '@/Components/HeaderTitle';
import { Card, CardContent, CardHeader } from '@/Components/ui/card';
import AppLayout from '@/Layouts/AppLayout';
import { Link } from '@inertiajs/react';
import { IconBooks, IconDoor } from '@tabler/icons-react';

export default function Show(props) {
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
                <CardHeader>
                    <h3 className="text-base font-semibold">Daftar Kelas</h3>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                    {props.course.schedules.length == 0 ? (
                        <EmptyState
                            icon={IconDoor}
                            title="Tidak Ada Kelas"
                            subctitle="Mulailah Dengan Menambahkan Kelas Baru"
                        />
                    ) : (
                        <ul role="list" className="grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-3">
                            {props.course.schedules.map((schedule, index) => (
                                <li key={index} className="overflow-hidden rounded-xl border">
                                    <Link
                                        href={route('teachers.classrooms.index', [
                                            props.course.id,
                                            schedule.classroom.id,
                                        ])}
                                        className="gap-x4 flex flex-col bg-gray-50 p-6 hover:bg-blue-50"
                                    >
                                        <div className="text-lg font-bold leading-relaxed text-foreground">
                                            <div className="flex items-center justify-between gap-4">
                                                {schedule.classroom.name}
                                            </div>
                                            <div className="text-sm font-medium leading-relaxed text-muted-foreground">
                                                {schedule.faculty.name} - {schedule.department.name}
                                                <br />
                                                {props.course.name}
                                            </div>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

Show.layout = (page) => <AppLayout title={page.props.page_settings.title} children={page} />;
