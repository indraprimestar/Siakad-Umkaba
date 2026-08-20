import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { cn } from '@/lib/utils';
export default function CardStat({ data, children }) {
    const { title, background, className = '', icon: Icon, IconClassName = '' } = data;

    return (
        <Card className={cn(background, className)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {Icon && <Icon className={cn('size-5', IconClassName)}></Icon>}
            </CardHeader>
            <CardContent>{children}</CardContent>
        </Card>
    );
}

// // resources/js/Components/CardStat.jsx
// import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
// import { cn } from '@/lib/utils';

// export default function CardStat({ data = {}, children }) {
//   const {
//     title = '-',
//     background = '',          // contoh: 'text-white bg-gradient-to-r from-red-400 via-red-500 to-red-500'
//     className = '',
//     icon: Icon,               // ⬅️ rename ke variabel komponen
//     iconClassName = '',       // ⬅️ konsisten dengan yang kamu kirim dari Dashboard
//   } = data;

//   return (
//     <Card className={cn(className)}>
//       <CardHeader className={cn('flex flex-row items-center justify-between space-y-0 pb-2', background)}>
//         <CardTitle className="text-sm font-medium">{title}</CardTitle>
//         {Icon ? <Icon className={cn('h-5 w-5', iconClassName)} /> : null}
//       </CardHeader>

//       <CardContent>
//         {children}
//       </CardContent>
//     </Card>
//   );
// }
