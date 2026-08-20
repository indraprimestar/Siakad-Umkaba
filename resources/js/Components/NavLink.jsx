import { cn } from '@/lib/utils'; // sesuaikan path
import { Link } from '@inertiajs/react';

export default function NavLink({ active = false, url = '#', title, icon: Icon, className = '', ...props }) {
    return (
        <li>
            <Link
                {...props}
                href={url}
                className={cn(
                    'hover:bg-blue-800',
                    'my-1 flex items-center gap-3 rounded-lg p-3 font-medium text-white transition-all',
                    props.className,
                )}
            >
                <Icon className="size-5" />
                {title}
            </Link>
        </li>
    );
}

// import { Link } from '@inertiajs/react';
// import { cn } from '@/lib/utils';

// export default function NavLink({
//   href = '#',
//   active = false,
//   className = '',
//   children,
//   icon: Icon = null,   // ← ikon opsional (tidak bikin undefined)
//   ...props
// }) {
//   return (
//     <Link
//       href={href}
//       {...props}
//       className={cn(
//         'inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition',
//         active ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100',
//         className
//       )}
//     >
//       {Icon ? <Icon className="size-5" /> : null}
//       {children}
//     </Link>
//   );
// }
