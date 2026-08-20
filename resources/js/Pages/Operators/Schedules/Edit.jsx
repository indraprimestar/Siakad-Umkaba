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
    const { data, setData, put, processing, reset, errors } = useForm({
        course_id: props.schedule?.course_id ? String(props.schedule.course_id) : '',
        classroom_id: props.schedule?.classroom_id ? String(props.schedule.classroom_id) : '',
        start_time: props.schedule?.start_time ?? '07:00',
        end_time: props.schedule?.end_time ?? '15:00',
        day_of_week: props.schedule?.day_of_week ?? '',
        quote: props.schedule?.quote ?? 0,
    });

    const debounceTimerRef = useRef(null);

    // Debounce onChange untuk mencegah auto-submit
    const onHandleTimeChange = (fieldName, value) => {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = setTimeout(() => {
            setData(fieldName, value);
        }, 300); // Delay 300ms sebelum update state
    };

    const onHandleChange = (e) => {
        const { name, value, type } = e.target;
        if (type === 'number') {
            setData(name, value === '' ? 0 : parseInt(value));
        } else {
            setData(name, value);
        }
    };

    const onHandleSubmit = (e) => {
        e.preventDefault();

        put(props.page_settings.action, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: (success) => {
                const flash = flashMessage(success);
                if (flash) toast[flash.type](flash.message);
            },
            onError: () => {
                toast.error('Data gagal disimpan.');
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
                    <Link href={route('operators.schedules.index')}>
                        <IconArrowLeft className="size-4" />
                        Kembali
                    </Link>
                </Button>
            </div>

            <Card>
                {/* ✅ CardHeader - HANYA KOSONG, JANGAN TAMBAH APAPUN */}
                <CardHeader className="border-b pb-4"></CardHeader>

                <CardContent className="p-6">
                    <form onSubmit={onHandleSubmit}>
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
                            {/* Course Select */}
                            <div className="col-span-full">
                                <Label htmlFor="course_id">Mata Kuliah :</Label>
                                <Select
                                    value={data.course_id ?? ''}
                                    onValueChange={(value) => setData('course_id', value)}
                                >
                                    <SelectTrigger id="course_id">
                                        <SelectValue placeholder="Pilih Mata Kuliah" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {props.courses && props.courses.length > 0 ? (
                                            props.courses.map((course, index) => (
                                                <SelectItem key={index} value={String(course.value)}>
                                                    {course.label}
                                                </SelectItem>
                                            ))
                                        ) : (
                                            <div className="p-2 text-sm text-gray-500">
                                                Tidak ada mata kuliah tersedia
                                            </div>
                                        )}
                                    </SelectContent>
                                </Select>
                                {errors.course_id && <InputError message={errors.course_id} />}
                            </div>

                            {/* Classroom Select */}
                            <div className="col-span-full">
                                <Label htmlFor="classroom_id">Kelas :</Label>
                                <Select
                                    value={data.classroom_id ?? ''}
                                    onValueChange={(value) => setData('classroom_id', value)}
                                >
                                    <SelectTrigger id="classroom_id">
                                        <SelectValue placeholder="Pilih Kelas" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {props.classrooms && props.classrooms.length > 0 ? (
                                            props.classrooms.map((classroom, index) => (
                                                <SelectItem key={index} value={String(classroom.value)}>
                                                    {classroom.label}
                                                </SelectItem>
                                            ))
                                        ) : (
                                            <div className="p-2 text-sm text-gray-500">Tidak ada kelas tersedia</div>
                                        )}
                                    </SelectContent>
                                </Select>
                                {errors.classroom_id && <InputError message={errors.classroom_id} />}
                            </div>

                            {/* Start Time */}
                            <div className="col-span-full">
                                <Label className="mb-3 block">Waktu Mulai :</Label>
                                <TimePicker
                                    value={data.start_time}
                                    onChange={(value) => onHandleTimeChange('start_time', value)}
                                />
                                {errors.start_time && <InputError message={errors.start_time} />}
                            </div>

                            {/* End Time */}
                            <div className="col-span-full">
                                <Label className="mb-3 block">Waktu Selesai :</Label>
                                <TimePicker
                                    value={data.end_time}
                                    onChange={(value) => onHandleTimeChange('end_time', value)}
                                />
                                {errors.end_time && <InputError message={errors.end_time} />}
                            </div>

                            {/* Day of Week Select */}
                            <div className="col-span-full">
                                <Label htmlFor="day_of_week">Hari :</Label>
                                <Select
                                    value={data.day_of_week ?? ''}
                                    onValueChange={(value) => setData('day_of_week', value)}
                                >
                                    <SelectTrigger id="day_of_week">
                                        <SelectValue placeholder="Pilih Hari" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {props.days && props.days.length > 0 ? (
                                            props.days.map((day, index) => (
                                                <SelectItem key={index} value={String(day.value)}>
                                                    {day.label}
                                                </SelectItem>
                                            ))
                                        ) : (
                                            <div className="p-2 text-sm text-gray-500">Tidak ada hari tersedia</div>
                                        )}
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
                                    value={data.quote || 0}
                                    onChange={onHandleChange}
                                    placeholder="Masukkan Kuota"
                                    min="1"
                                    max="100"
                                    className="text-base"
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
