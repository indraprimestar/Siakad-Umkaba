import HeaderTitle from '@/Components/HeaderTitle';
import InputError from '@/Components/InputError';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import AppLayout from '@/Layouts/AppLayout';
import { Link, useForm } from '@inertiajs/react';
import { IconArrowLeft, IconBooks, IconCheck } from '@tabler/icons-react';
import { toast } from 'sonner';

export default function Edit(props) {
    const { data, setData, put, processing, reset, errors } = useForm({
        teacher_id: props.course?.teacher_id ?? null,
        department_id: props.course?.department_id ?? null,
        code: props.course?.code ?? '',
        name: props.course?.name ?? '',
        credit: props.course?.credit ?? 1,
        semester: props.course?.semester ?? 1,
        _method: props.page_settings.method,
    });

    const onHandleChange = (e) => setData(e.target.name, e.target.value);

    const onHandleSubmit = (e) => {
        e.preventDefault();
        put(props.page_settings.action, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {},
            onError: (errors) => {
                console.error('Validation errors:', errors);
                toast.error('Validasi gagal. Cek kembali form Anda.');
            },
        });
    };

    const onHandleReset = () => {
        reset();
    };

    const teachers = props.teachers || [];

    return (
        <div className="flex w-full flex-col pb-32">
            <div className="mb-8 flex flex-col items-start justify-between gap-y-4 lg:flex-row lg:items-center">
                <HeaderTitle
                    title={props.page_settings.title}
                    subtitle={props.page_settings.subtitle}
                    icon={IconBooks}
                />
                <Button variant="orange" size="xl" className="w-full lg:w-auto" asChild>
                    <Link href={route('operators.courses.index')}>
                        <IconArrowLeft className="size-4" />
                        Kembali
                    </Link>
                </Button>
            </div>

            <Card>
                <CardContent className="p-6">
                    <form onSubmit={onHandleSubmit}>
                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
                            {/* Teacher Select */}
                            <div className="col-span-full">
                                <Label htmlFor="teacher_id">Dosen :</Label>
                                <Select
                                    value={data.teacher_id ? String(data.teacher_id) : ''}
                                    onValueChange={(value) => setData('teacher_id', value)}
                                >
                                    <SelectTrigger id="teacher_id">
                                        <SelectValue placeholder="Pilih Dosen" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {teachers.length > 0 ? (
                                            teachers.map((teacher, index) => (
                                                <SelectItem key={index} value={String(teacher.value)}>
                                                    {teacher.label}
                                                </SelectItem>
                                            ))
                                        ) : (
                                            <div className="p-2 text-sm text-gray-500">Tidak ada dosen tersedia</div>
                                        )}
                                    </SelectContent>
                                </Select>
                                {errors.teacher_id && <InputError message={errors.teacher_id} />}
                            </div>

                            {/* Course Code */}
                            <div className="col-span-full lg:col-span-2">
                                <Label htmlFor="code">Kode Matkul :</Label>
                                <Input
                                    type="text"
                                    name="code"
                                    id="code"
                                    value={data.code}
                                    onChange={onHandleChange}
                                    placeholder="Masukkan Kode Mata Kuliah"
                                />
                                {errors.code && <InputError message={errors.code} />}
                            </div>

                            {/* Course Name */}
                            <div className="col-span-full lg:col-span-2">
                                <Label htmlFor="name">Nama Mata Kuliah :</Label>
                                <Input
                                    type="text"
                                    name="name"
                                    id="name"
                                    value={data.name}
                                    onChange={onHandleChange}
                                    placeholder="Masukkan Nama Mata Kuliah"
                                />
                                {errors.name && <InputError message={errors.name} />}
                            </div>

                            {/* Credit (SKS) */}
                            <div className="col-span-full lg:col-span-2">
                                <Label htmlFor="credit">SKS :</Label>
                                <Input
                                    type="number"
                                    name="credit"
                                    id="credit"
                                    value={data.credit}
                                    onChange={onHandleChange}
                                    placeholder="Masukkan Jumlah SKS"
                                    min="1"
                                    max="6"
                                />
                                {errors.credit && <InputError message={errors.credit} />}
                            </div>

                            {/* Semester */}
                            <div className="col-span-full lg:col-span-2">
                                <Label htmlFor="semester">Semester :</Label>
                                <Input
                                    type="number"
                                    name="semester"
                                    id="semester"
                                    value={data.semester}
                                    onChange={onHandleChange}
                                    placeholder="Masukkan Semester"
                                    min="1"
                                    max="8"
                                />
                                {errors.semester && <InputError message={errors.semester} />}
                            </div>
                        </div>

                        {/* Submit Buttons */}
                        <div className="mt-8 flex flex-col gap-2 lg:flex-row lg:justify-end">
                            <Button type="button" variant="ghost" size="xl" onClick={onHandleReset}>
                                Reset
                            </Button>

                            <Button type="submit" variant="blue" size="xl" disabled={processing}>
                                <IconCheck className="size-4" />
                                Simpan Perubahan
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

Edit.layout = (page) => <AppLayout children={page} title={page.props.page_settings.title} />;
