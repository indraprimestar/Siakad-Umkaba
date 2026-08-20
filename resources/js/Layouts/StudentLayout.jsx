import Banner from '@/Components/Banner';
import { Card, CardContent } from '@/Components/ui/card';
import { flashMessage } from '@/lib/utils';
import { Head, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import HeaderStudentLayout from './Partials/HeaderStudentLayout';

export default function StudentLayout({ children, title }) {
    const page = usePage();
    const checkFee = page.props.checkFee;
    const { url } = page;
    const auth = page.props.auth.user;

    const flash = flashMessage(page);

    useEffect(() => {
        // Handle SEMUA tipe flash message (warning, success, error, info)
        if (flash && flash.message && flash.type) {
            toast[flash.type](flash.message);
        }
    }, [page]);

    return (
        <>
            <Head title={title} />
            <div className="min-h-full">
                <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 pb-32">
                    {/*header layout*/}
                    <HeaderStudentLayout auth={auth} url={url} />
                </div>
                <main className="-mt-32 px-6 pb-12 lg:px-28">
                    <Card>
                        <CardContent className="p-6">{children}</CardContent>
                    </Card>
                    {/*chekFee*/}

                    {checkFee == false && (
                        <Banner message="Harap Melakukan Pembayaran Uang Kuliah Tunggal Terlebih Dahulu" />
                    )}
                </main>
            </div>
        </>
    );
}
