import HeaderTitle from '@/Components/HeaderTitle';
import { Button } from '@/Components/ui/button';
import { Checkbox } from '@/Components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import StudentLayout from '@/Layouts/StudentLayout';
import { cn } from '@/lib/utils';
import { Link, useForm } from '@inertiajs/react';
import { IconArrowBack, IconBuilding } from '@tabler/icons-react';

export default function Create(props) {
    const { data, setData, post, processing, reset } = useForm({
        schedule_id: [],
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('students.study-plans.store'));
    };

    const handleReset = () => {
        reset('schedule_id');
    };

    return (
        <div className="flex w-full flex-col pb-32">
            <div className="mb-8 flex flex-col items-start justify-between gap-y-4 lg:flex-row lg:items-center">
                <HeaderTitle
                    title={props.page_settings.title}
                    subtitle={props.page_settings.subtitle}
                    icon={IconBuilding}
                />

                <Button variant="orange" size="lg" className="w-full lg:w-auto" asChild>
                    <Link href={route('students.study-plans.index')}>
                        <IconArrowBack className="size-4" />
                        Kembali
                    </Link>
                </Button>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="rounded-lg bg-white p-6 shadow">
                    <Table className="w-full">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-12">#</TableHead>
                                <TableHead>Mata Kuliah</TableHead>
                                <TableHead>Kelas</TableHead>
                                <TableHead>Hari</TableHead>
                                <TableHead>Jam</TableHead>
                                <TableHead className="text-right">Kuota</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {props.schedules?.length > 0 ? (
                                props.schedules.map((schedule, index) => (
                                    <TableRow
                                        key={schedule.id ?? index}
                                        className={cn(
                                            'hover:bg-gray-50',
                                            schedule.taken_quota === schedule.quote && 'bg-red-50',
                                        )}
                                    >
                                        <TableCell>
                                            <Checkbox
                                                id={`schedule_id_${schedule.id}`}
                                                checked={data.schedule_id?.includes(schedule.id) || false}
                                                disabled={schedule.taken_quota === schedule.quote}
                                                onCheckedChange={(checked) => {
                                                    if (checked) {
                                                        setData('schedule_id', [...data.schedule_id, schedule.id]);
                                                    } else {
                                                        setData(
                                                            'schedule_id',
                                                            data.schedule_id.filter((id) => id !== schedule.id),
                                                        );
                                                    }
                                                }}
                                            />
                                        </TableCell>

                                        <TableCell className="font-medium">{schedule.course?.name ?? '-'}</TableCell>
                                        <TableCell>{schedule.classroom?.name ?? '-'}</TableCell>
                                        <TableCell>{schedule.day_of_week ?? '-'}</TableCell>
                                        <TableCell>
                                            {schedule.start_time ?? '-'} - {schedule.end_time ?? '-'}
                                        </TableCell>
                                        <TableCell
                                            className={cn(
                                                'text-right font-semibold',
                                                schedule.taken_quota === schedule.quote
                                                    ? 'text-red-600'
                                                    : 'text-green-600',
                                            )}
                                        >
                                            {schedule.taken_quota ?? 0} / {schedule.quote ?? 0}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="py-8 text-center text-gray-500">
                                        Tidak ada jadwal tersedia.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <div className="mt-8 flex items-center justify-end gap-3">
                    <Button type="button" variant="outline" onClick={handleReset} disabled={processing}>
                        Reset
                    </Button>
                    <Button
                        type="submit"
                        size="lg"
                        className="bg-blue-600 hover:bg-blue-700"
                        disabled={processing || data.schedule_id.length === 0}
                    >
                        ✓ Save
                    </Button>
                </div>
            </form>
        </div>
    );
}

Create.layout = (page) => <StudentLayout children={page} title={page.props.page_settings.title} />;
