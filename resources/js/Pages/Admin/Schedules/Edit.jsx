import HeaderTitle from '@/Components/HeaderTitle';
import InputError from '@/Components/InputError';
import TimePicker from '@/Components/TimePicker';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import AppLayout from '@/Layouts/AppLayout';
import { flashMessage } from '@/lib/utils';
import { Link, useForm } from '@inertiajs/react';
import { IconArrowLeft, IconCalendar, IconCheck } from '@tabler/icons-react';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

export default function Edit(props) {
    const { data, setData, post, processing, reset, errors } = useForm({
        faculty_id: props.schedule.faculty_id ?? null,
        department_id: props.schedule.department_id ?? null,
        course_id: props.schedule.course_id ?? null,
        classroom_id: props.schedule.classroom_id ?? null,
        start_time: props.schedule.start_time ?? '07:00',
        end_time: props.schedule.end_time ?? '15:00',
        day_of_week: props.schedule.day_of_week ?? null,
        quote: props.schedule.quote ?? 0,
        _method: props.page_settings.method,
    });

    const debounceTimerRef = useRef(null);

    // Debounce onChange untuk mencegah auto-submit
    const onHandleTimeChange = (fieldName, value) => {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = setTimeout(() => {
            setData(fieldName, value);
        }, 300);
    };

    const onHandleChange = (e) => setData(e.target.name, e.target.value);

    const onHandleSubmit = (e) => {
        e.preventDefault();

        console.log('ACTION:', props.page_settings.action);
        console.log('DATA DIKIRIM:', data);

        post(props.page_settings.action, {
            preserveScroll: true,
            preserveState: true,

            onSuccess: (success) => {
                console.log('BERHASIL:', success);

                const flash = flashMessage(success);
                if (flash) toast[flash.type](flash.message);
            },

            onError: (errors) => {
                console.log('ERROR VALIDASI:', errors);
                toast.error('Data gagal disimpan. Cek console browser.');
            },

            onFinish: () => {
                console.log('REQUEST SELESAI');
            },
        });
    };

    const onHandleReset = () => {
        reset();
    };

    // Cleanup debounce timer saat unmount
    useEffect(() => {
        return () => clearTimeout(debounceTimerRef.current);
    }, []);

    return (
        <div className="flex w-full flex-col pb-32">
            <div className="mb-8 flex flex-col items-start justify-between gap-y-4 lg:flex-row lg:items-center">
                <HeaderTitle
                    title={props.page_settings.title}
                    subtitle={props.page_settings.subtitle}
                    icon={IconCalendar}
                />
                <Button variant="orange" size="xl" className="w-full lg:w-auto" asChild>
                    <Link href={route('admin.schedules.index')}>
                        <IconArrowLeft className="size-4" />
                        Kembali
                    </Link>
                </Button>
            </div>

            <Card>
                {/* ✅ CardHeader - Garis pembatas */}
                <CardHeader className="border-b pb-4"></CardHeader>

                <CardContent className="p-6">
                    <form onSubmit={onHandleSubmit}>
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
                            {/* Faculty */}
                            <div className="col-span-full">
                                <Label htmlFor="faculty_id">Fakultas :</Label>
                                <Select
                                    value={data.faculty_id ?? ''}
                                    onValueChange={(value) => setData('faculty_id', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue>
                                            {props.faculties.find((f) => f.value == data.faculty_id)?.label ??
                                                'Pilih Fakultas'}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {props.faculties.map((f, i) => (
                                            <SelectItem key={i} value={f.value}>
                                                {f.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.faculty_id && <InputError message={errors.faculty_id} />}
                            </div>

                            {/* Department */}
                            <div className="col-span-full">
                                <Label htmlFor="department_id">Program Studi :</Label>
                                <Select
                                    value={data.department_id ?? ''}
                                    onValueChange={(value) => setData('department_id', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue>
                                            {props.departments.find((d) => d.value == data.department_id)?.label ??
                                                'Pilih Program Studi'}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {props.departments.map((d, i) => (
                                            <SelectItem key={i} value={d.value}>
                                                {d.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.department_id && <InputError message={errors.department_id} />}
                            </div>

                            {/* Course */}
                            <div className="col-span-full">
                                <Label htmlFor="course_id">Mata Kuliah :</Label>
                                <Select
                                    value={data.course_id ?? ''}
                                    onValueChange={(value) => setData('course_id', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue>
                                            {props.courses.find((c) => c.value == data.course_id)?.label ??
                                                'Pilih Mata Kuliah'}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {props.courses.map((c, i) => (
                                            <SelectItem key={i} value={c.value}>
                                                {c.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.course_id && <InputError message={errors.course_id} />}
                            </div>

                            {/* Classroom */}
                            <div className="col-span-full">
                                <Label htmlFor="classroom_id">Kelas :</Label>
                                <Select
                                    value={data.classroom_id ?? ''}
                                    onValueChange={(value) => setData('classroom_id', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue>
                                            {props.classrooms.find((c) => c.value == data.classroom_id)?.label ??
                                                'Pilih Kelas'}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {props.classrooms.map((c, i) => (
                                            <SelectItem key={i} value={c.value}>
                                                {c.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.classroom_id && <InputError message={errors.classroom_id} />}
                            </div>

                            {/* Start Time - TimePicker */}
                            <div className="col-span-full">
                                <Label className="mb-3 block">Waktu Mulai :</Label>
                                <TimePicker
                                    value={data.start_time}
                                    onChange={(value) => onHandleTimeChange('start_time', value)}
                                />
                                {errors.start_time && <InputError message={errors.start_time} />}
                            </div>

                            {/* End Time - TimePicker */}
                            <div className="col-span-full">
                                <Label className="mb-3 block">Waktu Selesai :</Label>
                                <TimePicker
                                    value={data.end_time}
                                    onChange={(value) => onHandleTimeChange('end_time', value)}
                                />
                                {errors.end_time && <InputError message={errors.end_time} />}
                            </div>

                            {/* Day of Week */}
                            <div className="col-span-full">
                                <Label htmlFor="day_of_week">Hari :</Label>
                                <Select
                                    value={data.day_of_week ?? ''}
                                    onValueChange={(value) => setData('day_of_week', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue>
                                            {props.days.find((c) => c.value == data.day_of_week)?.label ?? 'Pilih Hari'}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {props.days.map((day, i) => (
                                            <SelectItem key={i} value={day.value}>
                                                {day.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.day_of_week && <InputError message={errors.day_of_week} />}
                            </div>

                            {/* Quote */}
                            <div className="col-span-full">
                                <Label htmlFor="quote">Kuota :</Label>
                                <Input
                                    type="number"
                                    name="quote"
                                    id="quote"
                                    value={data.quote}
                                    onChange={onHandleChange}
                                    placeholder="Masukkan Kuota"
                                />
                                {errors.quote && <InputError message={errors.quote} />}
                            </div>
                        </div>

                        {/* Submit Buttons */}
                        <div className="mt-8 flex flex-col gap-2 lg:flex-row lg:justify-end">
                            <Button type="button" variant="ghost" size="xl" onClick={onHandleReset}>
                                Reset
                            </Button>
                            <Button type="submit" variant="blue" size="xl" disabled={processing}>
                                <IconCheck className="size-4" />
                                Simpan
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

Edit.layout = (page) => <AppLayout children={page} title={page.props.page_settings.title} />;
