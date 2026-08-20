import HeaderTitle from '@/Components/HeaderTitle';
import InputError from '@/Components/InputError';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import AppLayout from '@/Layouts/AppLayout';
import { flashMessage } from '@/lib/utils';
import { Link, useForm } from '@inertiajs/react';
import { IconArrowLeft, IconCheck, IconUser } from '@tabler/icons-react';
import { useRef } from 'react';
import { toast } from 'sonner';

export default function Edit(props) {
    //   console.log(props.teacher)
    const fileInputAvatar = useRef(null);

    const { data, setData, post, processing, reset, errors } = useForm({
        faculty_id: props.operator.faculty_id ?? null,
        department_id: props.operator.department_id ?? null,
        name: props.operator.user.name ?? '',
        email: props.operator.user.email ?? '',
        password: '',
        avatar: null,
        employee_number: props.operator.employee_number ?? '',
        _method: props.page_settings.method,
    });

    const onHandleChange = (e) => setData(e.target.name, e.target.value);

    const onHandleSubmit = (e) => {
        e.preventDefault();
        post(props.page_settings.action, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: (success) => {
                const flash = flashMessage(success);
                if (flash) toast[flash.type](flash.message);
            },
        });
    };

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
                    icon={IconUser}
                />
                <Button variant="orange" size="xl" className="w-full lg:w-auto" asChild>
                    <Link href={route('admin.operators.index')}>
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
                                <Label htmlFor="name">Nama Operator :</Label>
                                <Input
                                    type="text"
                                    name="name"
                                    id="name"
                                    value={data.name}
                                    onChange={onHandleChange}
                                    placeholder="Masukkan Nama Operator"
                                />
                                {errors.name && <InputError message={errors.name} />}
                            </div>

                            <div className="col-span-2">
                                <Label htmlFor="email">Email Operator :</Label>
                                <Input
                                    type="email"
                                    name="email"
                                    id="email"
                                    value={data.email}
                                    onChange={onHandleChange}
                                    placeholder="Masukkan email operator"
                                />
                                {errors.email && <InputError message={errors.email} />}
                            </div>

                            <div className="col-span-2">
                                <Label htmlFor="password">Password :</Label>
                                <Input
                                    type="password"
                                    name="password"
                                    id="password"
                                    value={data.password}
                                    onChange={onHandleChange}
                                    placeholder="*********"
                                />
                                {errors.password && <InputError message={errors.password} />}
                            </div>

                            <div className="col-span-full">
                                <Label htmlFor="faculty_id">Fakultas :</Label>
                                <Select
                                    defaultValue={data.faculty_id}
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

                            <div className="col-span-full">
                                <Label htmlFor="department_id">Program Studi :</Label>
                                <Select
                                    defaultValue={data.department_id}
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

                            {/* <div className="col-span-full">
                <Label htmlFor="classroom_id">Kelas :</Label>
                <Select
                  defaultValue={data.classroom_id}
                  onValueChange={(value) => setData('classroom_id', value)}
                >
                  <SelectTrigger>
                    <SelectValue>
                      {props.classrooms.find((c) => c.value == data.classroom_id)?.label ?? 'Pilih Kelas'}
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

              <div className="col-span-full">
                <Label htmlFor="fee_group_id">Golongan UKT :</Label>
                <Select
                  defaultValue={data.fee_group_id}
                  onValueChange={(value) => setData('fee_group_id', value)}
                >
                  <SelectTrigger>
                    <SelectValue>
                      {props.feeGroups.find((g) => g.value == data.fee_group_id)?.label ?? 'Pilih Golongan UKT'}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {props.feeGroups.map((g, i) => (
                      <SelectItem key={i} value={g.value}>
                        {g.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.fee_group_id && <InputError message={errors.fee_group_id} />}
              </div> */}

                            <div className="col-span-2">
                                <Label htmlFor="employee_number">Nomer Induk Pegawai :</Label>
                                <Input
                                    type="text"
                                    name="employee_number"
                                    id="employee_number"
                                    value={data.employee_number}
                                    onChange={onHandleChange}
                                    placeholder="Masukkan Nomer Induk Pegawai"
                                />
                                {errors.employee_number && <InputError message={errors.employee_number} />}
                            </div>

                            {/* <div className="col-span-2">
                <Label htmlFor="semester">Semester :</Label>
                <Input
                  type="number"
                  name="semester"
                  id="semester"
                  value={data.semester}
                  onChange={(e) => setData('semester', Number(e.target.value))}
                  min={1}
                />
                {errors.semester && <InputError message={errors.semester} />}
              </div> */}

                            <div className="col-span-2">
                                <Label htmlFor="avatar">Foto :</Label>
                                <Input
                                    type="file"
                                    name="avatar"
                                    id="avatar"
                                    accept="image/*"
                                    onChange={(e) => setData('avatar', e.target.files?.[0] ?? null)}
                                    ref={fileInputAvatar}
                                />
                                {errors.avatar && <InputError message={errors.avatar} />}
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
