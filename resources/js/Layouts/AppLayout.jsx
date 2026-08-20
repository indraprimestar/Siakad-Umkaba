import { Avatar, AvatarFallback } from '@/Components/ui/avatar';
import { flashMessage } from '@/lib/utils';
import { Dialog, Transition } from '@headlessui/react';
import { Head, Link, usePage } from '@inertiajs/react';
import { IconLayoutSidebar, IconX } from '@tabler/icons-react';
import { Fragment, useEffect, useState } from 'react';
import { toast } from 'sonner';
import Sidebar from './Partials/Sidebar';
import SidebarResponsive from './Partials/SidebarResponsive';

export default function AppLayout({ title, children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const page = usePage();
    const { url } = page;
    const flash = flashMessage(page);

    const auth = page.props.auth.user;

    useEffect(() => {
        if (flash?.message && flash?.type) {
            toast[flash.type](flash.message);
        }
    }, [page]);

    return (
        <>
            <Head title={title} />

            {/* WRAPPER
         Sebelumnya: <div>
         Menjadi   : <div className="min-h-screen ... lg:grid lg:grid-cols-[20rem_1fr]">
         Alasan    : Tinggi penuh + latar abu halus + layout grid 2 kolom (sidebar 20rem, konten fleksibel)
      */}
            <div className="min-h-dvh overflow-x-hidden bg-gradient-to-b from-neutral-100 to-neutral-200 lg:grid lg:grid-cols-[20rem_1fr]">
                {/* MOBILE SIDEBAR (drawer) – tetap sama */}
                <Transition.Root show={sidebarOpen} as={Fragment}>
                    <Dialog as="div" className="relative z-50 md:hidden" onClose={setSidebarOpen}>
                        <Transition.Child
                            as={Fragment}
                            enter="transition-opacity ease-linear duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="transition-opacity ease-linear duration-300"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0 bg-gray-900/80" />
                        </Transition.Child>

                        <div className="fixed inset-0 flex">
                            <Transition.Child
                                as={Fragment}
                                enter="transition ease-in-out duration-300 transform"
                                enterFrom="-translate-x-full"
                                enterTo="translate-x-0"
                                leave="transition ease-in-out duration-300 transform"
                                leaveFrom="translate-x-0"
                                leaveTo="-translate-x-full"
                            >
                                <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                                    <Transition.Child
                                        as={Fragment}
                                        enter="ease-in-out duration-300"
                                        enterFrom="opacity-0"
                                        enterTo="opacity-100"
                                        leave="ease-in-out duration-300"
                                        leaveFrom="opacity-100"
                                        leaveTo="opacity-0"
                                    >
                                        <div className="absolute left-full top-0 mr-16 flex justify-center pt-5">
                                            <button
                                                type="button"
                                                className="-m-2.5 p-2.5"
                                                onClick={() => setSidebarOpen(false)}
                                                aria-label="Close sidebar"
                                            >
                                                <IconX className="size-6 text-white" />
                                            </button>
                                        </div>
                                    </Transition.Child>

                                    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gradient-to-b from-blue-500 via-blue-600 to-blue-700 px-6 pb-2">
                                        {/* sidebar responsive */}

                                        <SidebarResponsive auth={auth} url={url} />
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </Dialog>
                </Transition.Root>

                {/* DESKTOP SIDEBAR
           Sebelumnya: <div className="hidden p-2.5 lg:flex lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col"> ... (fixed/rounded tidak pas)
           Menjadi   : <aside className="hidden lg:block lg:sticky lg:top-4 lg:self-start p-4">
           Alasan    : Sticky → “elastis” saat scroll (seperti video), ada jarak putih tipis (p-4)
        */}
                <aside className="hidden p-4 lg:sticky lg:top-4 lg:block lg:self-start">
                    {/* PANEL BIRU
             Sebelumnya: tinggi mengandalkan konten, ada border abunya & rounded kecil
             Menjadi   : h-[calc(100vh-2rem)] (viewport - jarak atas+bawah 2rem), rounded besar, shadow + ring
             Alasan    : Proporsi penuh, elegan, dan scroll-nya di dalam panel bila menu panjang
          */}
                    <div className="flex h-[calc(100vh-2rem)] flex-col overflow-y-auto rounded-2xl bg-gradient-to-b from-blue-500 via-blue-600 to-blue-700 shadow-2xl ring-1 ring-black/10">
                        {/* sidebar */}
                        <Sidebar auth={auth} url={url} />
                    </div>
                </aside>

                {/* TOP BAR (mobile only) – tetap sama */}
                <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-white p-4 shadow-sm sm:px-6 lg:hidden">
                    <button
                        type="button"
                        className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
                        onClick={() => setSidebarOpen(true)}
                        aria-label="Open sidebar"
                    >
                        <IconLayoutSidebar className="size-6" />
                    </button>
                    <div className="flex-1 text-sm font-semibold leading-6 text-foreground">{title}</div>
                    <Link href="#">
                        <Avatar>
                            <AvatarFallback>X</AvatarFallback>
                        </Avatar>
                    </Link>
                </div>

                {/* MAIN
           Sebelumnya: <main className="py-4 lg:pl-72"> (geser pakai padding kiri)
           Menjadi   : <main className="py-4"> (karena sekarang pakai grid 2 kolom)
           Alasan    : Grid sudah memisahkan kolom sidebar & konten, padding kiri besar tak perlu lagi
        */}
                <main className="min-w-0 py-4">
                    <div className="px-4">{children}</div>
                </main>
            </div>
        </>
    );
}
