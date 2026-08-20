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
import { useRef } from 'react';

export default function Edit(props) {
    const fileInputAvatar = useRef(null);

    const { data, setData, post, processing, reset, errors } = useForm({
        faculty_id: props.course.faculty_id ? String(props.course.faculty_id) : '',
        department_id: props.course.department_id ? String(props.course.department_id) : '',
        teacher_id: props.course.teacher_id ? String(props.course.teacher_id) : '',
        name: props.course.name ?? '',
        code: props.course.code ?? '',
        credit: props.course.credit ?? 1,
        semester: props.course.semester ?? 1,
        _method: props.page_settings.method,
    });

    const onHandleChange = (e) => setData(e.target.name, e.target.value);

    const onHandleSubmit = (e) => {
        e.preventDefault();
        post(props.page_settings.action, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {},
        });
    };

    // const onHandleSubmit = (e) => {
    //   e.preventDefault();

    //   console.log('ACTION:', props.page_settings.action);
    //   console.log('DATA DIKIRIM:', data);

    //   post(props.page_settings.action, {
    //     preserveScroll: true,
    //     preserveState: true,

    //     onSuccess: (success) => {
    //       console.log('BERHASIL:', success);

    //       const flash = flashMessage(success);
    //       if (flash) toast[flash.type](flash.message);
    //     },

    //     onError: (errors) => {
    //       console.log('ERROR VALIDASI:', errors);
    //       toast.error('Data gagal disimpan. Cek console browser.');
    //     },

    //     onFinish: () => {
    //       console.log('REQUEST SELESAI');
    //     },
    //   });
    // };
    const onHandleReset = () => {
        reset();
        if (fileInputAvatar.current) fileInputAvatar.current.value = null;
    };

    return (
        <div className="flex w-full flex-col pb-32">
            <div className="mb-8 flex flex-col items-start justify-between gap-y-4 lg:flex-row lg:items-center">
                <HeaderTitle
                    title={props.page_settings.title}
                    subtitle={props.page_settings.subtitle}
                    icon={IconBooks}
                />
                <Button variant="orange" size="xl" className="w-full lg:w-auto" asChild>
                    <Link href={route('admin.courses.index')}>
                        <IconArrowLeft className="size-4" />
                        Kembali
                    </Link>
                </Button>
            </div>

            <Card>
                <CardContent className="p-6">
                    <form onSubmit={onHandleSubmit}>
                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
                            <div className="col-span-full">
                                <Label htmlFor="faculty_id">Fakultas :</Label>
                                <Select value={data.faculty_id} onValueChange={(value) => setData('faculty_id', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Fakultas" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {props.faculties.map((f, i) => (
                                            <SelectItem key={i} value={String(f.value)}>
                                                {f.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.faculty_id && <InputError message={errors.faculty_id} />}
                            </div>

                            <div className="col-span-full">
                                <Label htmlFor="department_id">Program Studi :</Label>
                                <Select
                                    value={data.department_id}
                                    onValueChange={(value) => setData('department_id', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Program Studi" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {props.departments.map((d, i) => (
                                            <SelectItem key={i} value={String(d.value)}>
                                                {d.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.department_id && <InputError message={errors.department_id} />}
                            </div>

                            <div className="col-span-full">
                                <Label htmlFor="teacher_id">Dosen :</Label>
                                <Select value={data.teacher_id} onValueChange={(value) => setData('teacher_id', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Dosen" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {props.teachers.map((t, i) => (
                                            <SelectItem key={i} value={String(t.value)}>
                                                {t.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.teacher_id && <InputError message={errors.teacher_id} />}
                            </div>

                            <div className="col-span-full">
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

                            <div className="col-span-full">
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

                            <div className="col-span-full lg:col-span-2">
                                <Label htmlFor="credit">SKS :</Label>
                                <Input
                                    type="number"
                                    name="credit"
                                    id="credit"
                                    value={data.credit}
                                    onChange={onHandleChange}
                                    placeholder="Masukkan Jumlah SKS"
                                />
                                {errors.credit && <InputError message={errors.credit} />}
                            </div>

                            <div className="col-span-full lg:col-span-2">
                                <Label htmlFor="semester">Semester :</Label>
                                <Input
                                    type="number"
                                    name="semester"
                                    id="semester"
                                    value={data.semester}
                                    onChange={onHandleChange}
                                    placeholder="Masukkan Semester"
                                />
                                {errors.semester && <InputError message={errors.semester} />}
                            </div>
                        </div>

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
