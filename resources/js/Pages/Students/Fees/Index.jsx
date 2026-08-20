import EmptyState from '@/Components/EmptyState';
import HeaderTitle from '@/Components/HeaderTitle';
import PaginationTable from '@/Components/PaginationTable';
import ShowFilter from '@/Components/ShowFilter';
import { Alert, AlertDescription, AlertTitle } from '@/Components/ui/alert';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import UseFilter from '@/hooks/UseFilter';
import StudentLayout from '@/Layouts/StudentLayout';
import { feeCodeGenerator, formatDateIndo, formatRupiah } from '@/lib/utils';
import { router, usePage } from '@inertiajs/react';
import { IconArrowsDownUp, IconMoneybag, IconRefresh } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function Index(props) {
    const auth = usePage().props.auth.user;
    const { data: fees, meta, links } = props.fees;
    const { flash } = usePage().props;
    const [params, setParams] = useState(props.state);
    const handlePayment = async () => {
        try {
            const response = await axios.post(route('payments.create'), {
                fee_code: feeCodeGenerator(),
                gross_amount: auth.student?.feegroup?.amount,
                first_name: auth.name,
                last_name: 'UMKABA',
                email: auth.email,
            });
            const snapToken = response.data.snapToken;
            window.snap.pay(snapToken, {
                onSuccess: function (result) {
                    toast['success']('Pembayaran Berhasil');
                    router.get(route('payments.success'));
                },
                onPending: function (result) {
                    toast['warning']('Pembayaran Tertunda');
                },
                onError: function (result) {
                    toast['error'](`Pembayaran Gagal ${error}`);
                },
                onClose: function () {
                    toast['info']('Anda menutup jendela pembayaran');
                },
            });
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.message;
            toast['error'](`Kesalahan pembayaran: ${errorMessage}`);
        }
    };
    console.log(props.checkFee);

    // Handle flash message dari redirect/create
    useEffect(() => {
        if (flash?.message) {
            toast[flash.type || 'info'](flash.message);
        }
    }, [flash?.message, flash?.type]);

    // Check apakah student sudah bayar UKT di semester ini
    const isPaid = Boolean(
        props.checkFee ||
            (props.fee && (props.fee.status === 'Sukses' || props.fee.status === 'Berhasil')) ||
            (fees &&
                fees.some(
                    (f) => f.semester === auth.student?.semester && (f.status === 'Sukses' || f.status === 'Berhasil'),
                )),
    );

    const onSortable = (field) => {
        setParams((prev) => ({
            ...params,
            sort: field,
            direction: prev.direction === 'asc' ? 'desc' : 'asc',
            page: 1,
        }));
    };

    UseFilter({
        route: route('students.fees.index'),
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
                />
            </div>
            <div className="flex flex-col gap-y-8">
                {/* Pembayaran */}
                {!props.academic_year ? (
                    <div>
                        <Alert variant="orange">
                            <AlertTitle>Tidak Ada Tahun Ajaran Aktif</AlertTitle>
                            <AlertDescription>
                                Harap hubungi admin untuk mengaktifkan tahun ajaran berjalan terlebih dahulu.
                            </AlertDescription>
                        </Alert>
                    </div>
                ) : (
                    !isPaid && (
                        <>
                            <div>
                                <Alert variant="orange">
                                    <AlertTitle>
                                        Periode Pembayaran UKT Tahun Ajaran {props.academic_year.name}
                                    </AlertTitle>
                                    <AlertDescription>
                                        Silahkan melakukan pembayaran UKT terlebih dahulu agar anda dapat mengajukan
                                        Kartu Rencana Studi
                                    </AlertDescription>
                                </Alert>
                            </div>
                            <Card>
                                <CardContent className="space-y-20 p-6">
                                    <div>
                                        <Table className="w-full">
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Nama</TableHead>
                                                    <TableHead>NPM</TableHead>
                                                    <TableHead>Semester</TableHead>
                                                    <TableHead>Kelas</TableHead>
                                                    <TableHead>Program Studi</TableHead>
                                                    <TableHead>Fakultas</TableHead>
                                                    <TableHead>Golongan</TableHead>
                                                    <TableHead>Total Tagihan</TableHead>
                                                    <TableHead>Aksi</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell>{auth.name}</TableCell>
                                                    <TableCell>{auth.student?.student_number}</TableCell>
                                                    <TableCell>{auth.student?.semester}</TableCell>
                                                    <TableCell>{auth.student?.classroom?.name}</TableCell>
                                                    <TableCell>{auth.student?.department?.name}</TableCell>
                                                    <TableCell>{auth.student?.faculty?.name}</TableCell>
                                                    <TableCell>{auth.student?.feegroup?.group}</TableCell>
                                                    <TableCell>
                                                        {formatRupiah(auth.student?.feegroup?.amount)}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Button variant="orange" onClick={handlePayment}>
                                                            Bayar Sekarang
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </div>
                                </CardContent>
                            </Card>
                        </>
                    )
                )}
                {/*filter*/}
                <div className="flex w-full flex-col gap-4 lg:flex-row lg:items-center">
                    <Input
                        className="w-full sm:w-1/4"
                        placeholder="Search...."
                        value={params?.search}
                        onChange={(e) => setParams((prev) => ({ ...prev, search: e.target.value, page: 1 }))}
                    />
                    <Select
                        value={String(params?.load)}
                        onValueChange={(val) => setParams((prev) => ({ ...prev, load: val, page: 1 }))}
                    >
                        <SelectTrigger className="w-full sm:w-24">
                            <SelectValue placeholder="Load" />
                        </SelectTrigger>
                        <SelectContent>
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
                {fees.length == 0 ? (
                    <EmptyState
                        icon={IconMoneybag}
                        title="Tidak ada Pembayaran"
                        subctitle="Silahkan tambahkan Kartu Hasil Studi"
                    />
                ) : (
                    <Table className="w-full">
                        <TableHeader>
                            <TableRow>
                                <TableHead>
                                    <Button
                                        variant="ghost"
                                        className="group inline-flex"
                                        onClick={() => onSortable('id')}
                                    >
                                        #
                                        <span className="ml-2 flex-none rounded text-muted-foreground">
                                            <IconArrowsDownUp className="size-4" />
                                        </span>
                                    </Button>
                                </TableHead>
                                <TableHead>
                                    <Button
                                        variant="ghost"
                                        className="group inline-flex"
                                        onClick={() => onSortable('fee_code')}
                                    >
                                        Kode Pembayaran
                                        <span className="ml-2 flex-none rounded text-muted-foreground">
                                            <IconArrowsDownUp className="size-4" />
                                        </span>
                                    </Button>
                                </TableHead>
                                <TableHead>
                                    <Button
                                        variant="ghost"
                                        className="group inline-flex"
                                        onClick={() => onSortable('fee_group_id')}
                                    >
                                        Golongan
                                        <span className="ml-2 flex-none rounded text-muted-foreground">
                                            <IconArrowsDownUp className="size-4" />
                                        </span>
                                    </Button>
                                </TableHead>
                                <TableHead>
                                    <Button
                                        variant="ghost"
                                        className="group inline-flex"
                                        onClick={() => onSortable('academic_year_id')}
                                    >
                                        Tahun Ajaran
                                        <span className="ml-2 flex-none rounded text-muted-foreground">
                                            <IconArrowsDownUp className="size-4" />
                                        </span>
                                    </Button>
                                </TableHead>
                                <TableHead>
                                    <Button
                                        variant="ghost"
                                        className="group inline-flex"
                                        onClick={() => onSortable('semester')}
                                    >
                                        Semester
                                        <span className="ml-2 flex-none rounded text-muted-foreground">
                                            <IconArrowsDownUp className="size-4" />
                                        </span>
                                    </Button>
                                </TableHead>
                                <TableHead>
                                    <Button
                                        variant="ghost"
                                        className="group inline-flex"
                                        onClick={() => onSortable('status')}
                                    >
                                        Status
                                        <span className="ml-2 flex-none rounded text-muted-foreground">
                                            <IconArrowsDownUp className="size-4" />
                                        </span>
                                    </Button>
                                </TableHead>
                                <TableHead>
                                    <Button
                                        variant="ghost"
                                        className="group inline-flex"
                                        onClick={() => onSortable('created_at')}
                                    >
                                        Dibuat Pada
                                        <span className="ml-2 flex-none rounded text-muted-foreground">
                                            <IconArrowsDownUp className="size-4" />
                                        </span>
                                    </Button>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {fees.map((fee, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1 + (meta.current_page - 1) * meta.per_page}</TableCell>
                                    <TableCell>{fee.fee_code}</TableCell>
                                    <TableCell>{fee.feeGroup?.group}</TableCell>
                                    <TableCell>{fee.academicYear?.name}</TableCell>
                                    <TableCell>{fee.semester}</TableCell>
                                    <TableCell>
                                        {fee.status === 'Sukses' || fee.status === 'Berhasil' ? (
                                            <span className="rounded-md bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                                                Sukses
                                            </span>
                                        ) : fee.status === 'Tertunda' || fee.status === 'Pending' ? (
                                            <span className="rounded-md bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
                                                Tertunda
                                            </span>
                                        ) : (
                                            <span className="rounded-md bg-rose-100 px-2.5 py-1 text-xs font-semibold text-rose-700">
                                                {fee.status}
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell>{formatDateIndo(fee.created_at)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
                <div className="flex w-full flex-col items-center justify-between py-3 lg:flex-row">
                    <p className="text-sm text-muted-foreground">
                        Menampilkan <span className="font-medium text-blue-600">{meta.from ?? 0}</span> dari{' '}
                        {meta.total} pembayaran
                    </p>
                    <div className="overflow-x-auto">
                        {meta.has_pages && <PaginationTable meta={meta} links={links} />}
                    </div>
                </div>
            </div>
        </div>
    );
}

Index.layout = (page) => <StudentLayout title={page.props.page_settings.title} children={page} />;
