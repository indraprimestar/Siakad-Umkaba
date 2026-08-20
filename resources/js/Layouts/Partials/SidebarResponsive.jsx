import NavLink from '@/Components/NavLink';
import {
    IconBooks,
    IconBuildingSkyscraper,
    IconCalendar,
    IconCalendarTime,
    IconCircleKey,
    IconDoor,
    IconDroplets,
    IconLayout2,
    IconLogout2,
    IconMoneybag,
    IconSchool,
    IconUser,
    IconUsers,
    IconUsersGroup,
} from '@tabler/icons-react';
export default function SidebarResponsive({ auth, url }) {
    return (
        <nav className="mt-4 flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col">
                {auth.roles.some((role) => ['Super Admin'].includes(role)) && (
                    <>
                        <NavLink
                            url={route('admin.dashboard')}
                            active={url.startsWith('/admin/dashboard')}
                            title="Dashboard"
                            icon={IconLayout2}
                        ></NavLink>

                        <div className="px-3 py-2 text-xs font-medium text-white">Master</div>
                        <NavLink
                            url={route('admin.faculties.index')}
                            active={url.startsWith('/admin/faculties')}
                            title="Fakultas"
                            icon={IconBuildingSkyscraper}
                        ></NavLink>
                        <NavLink
                            url={route('admin.departments.index')}
                            active={url.startsWith('/admin/departments')}
                            title="Jurusan"
                            icon={IconSchool}
                        ></NavLink>
                        <NavLink
                            url={route('admin.academic-years.index')}
                            active={url.startsWith('/admin/academic-years')}
                            title="Tahun Ajaran"
                            icon={IconCalendarTime}
                        ></NavLink>
                        <NavLink
                            url={route('admin.classrooms.index')}
                            active={url.startsWith('/admin/classrooms')}
                            title="Kelas"
                            icon={IconDoor}
                        ></NavLink>
                        <NavLink
                            url={route('admin.roles.index')}
                            active={url.startsWith('/admin/roles')}
                            title="Peran"
                            icon={IconCircleKey}
                        ></NavLink>

                        <div className="px-3 py-2 text-xs font-medium text-white">Pengguna</div>
                        <NavLink
                            url={route('admin.students.index')}
                            active={url.startsWith('/admin/students')}
                            title="Mahasiswa"
                            icon={IconUsers}
                        ></NavLink>
                        <NavLink
                            url={route('admin.teachers.index')}
                            active={url.startsWith('/admin/teachers')}
                            title="Dosen"
                            icon={IconUsersGroup}
                        ></NavLink>
                        <NavLink
                            url={route('admin.operators.index')}
                            active={url.startsWith('/admin/operators')}
                            title="Admin Fakultas"
                            icon={IconUser}
                        ></NavLink>

                        <div className="px-3 py-2 text-xs font-medium text-white">Akademik</div>
                        <NavLink
                            url={route('admin.courses.index')}
                            active={url.startsWith('/admin/courses')}
                            title="Mata Kuliah"
                            icon={IconBooks}
                        ></NavLink>
                        <NavLink
                            url={route('admin.schedules.index')}
                            active={url.startsWith('/admin/schedules')}
                            title="Jadwal"
                            icon={IconCalendar}
                        ></NavLink>

                        <div className="px-3 py-2 text-xs font-medium text-white">Pembayaran</div>
                        <NavLink
                            url={route('admin.fees.index')}
                            active={url.startsWith('/admin/fees')}
                            title="Uang Kuliah Tunggal"
                            icon={IconMoneybag}
                        ></NavLink>
                        <NavLink
                            url={route('admin.fee-groups.index')}
                            active={url.startsWith('/admin/fee-groups')}
                            title="Golongan UKT"
                            icon={IconDroplets}
                        ></NavLink>
                    </>
                )}

                {auth.roles.some((role) => ['Dosen'].includes(role)) && (
                    <>
                        <NavLink
                            url={route('teachers.dashboard')}
                            active={url.startsWith('/teachers/dashboard')}
                            title="Dashboard"
                            icon={IconLayout2}
                        ></NavLink>
                        <div className="px-3 py-2 text-xs font-medium text-white">Akademik</div>

                        <NavLink
                            url={route('teachers.courses.index')}
                            active={url.startsWith('/teachers/courses')}
                            title="Mata Kuliah"
                            icon={IconBooks}
                        ></NavLink>
                        <NavLink
                            url={route('teachers.schedules.index')}
                            active={url.startsWith('/teachers/schedules')}
                            title="Jadwal"
                            icon={IconCalendar}
                        ></NavLink>
                        <NavLink
                            url="#"
                            active={url.startsWith('/teachers/courses')}
                            title="Mata Kuliah"
                            icon={IconBooks}
                        ></NavLink>
                    </>
                )}

                {auth.roles.some((role) => ['Admin Fakultas'].includes(role)) && (
                    <>
                        <NavLink
                            url={route('operators.dashboard')}
                            active={url.startsWith('/operators/dashboard')}
                            title="Dashboard"
                            icon={IconLayout2}
                        ></NavLink>
                        <div className="px-3 py-2 text-xs font-medium text-white">Pengguna</div>

                        <NavLink
                            url={route('operators.students.index')}
                            active={url.startsWith('/operators/students')}
                            title="Mahasiswa"
                            icon={IconUsers}
                        ></NavLink>
                        <NavLink
                            url={route('operators.teachers.index')}
                            active={url.startsWith('/operators/teachers')}
                            title="Dosen"
                            icon={IconUsersGroup}
                        ></NavLink>
                        <div className="px-3 py-2 text-xs font-medium text-white">Akademik</div>
                        <NavLink
                            url={route('operators.classrooms.index')}
                            active={url.startsWith('/operators/classrooms')}
                            title="Kelas"
                            icon={IconDoor}
                        ></NavLink>
                        <NavLink
                            url={route('operators.courses.index')}
                            active={url.startsWith('/operators/courses')}
                            title="Mata Kuliah"
                            icon={IconBooks}
                        ></NavLink>
                        <NavLink
                            url={route('operators.schedules.index')}
                            active={url.startsWith('/operators/schedules')}
                            title="Jadwal"
                            icon={IconCalendar}
                        ></NavLink>
                    </>
                )}

                <div className="px-3 py-2 text-xs font-medium text-white">Lainnya</div>
                <NavLink
                    url={route('logout')}
                    method="post"
                    as="button"
                    active={url.startsWith('/logout')}
                    title="Log Out"
                    icon={IconLogout2}
                ></NavLink>
            </ul>
        </nav>
    );
}
