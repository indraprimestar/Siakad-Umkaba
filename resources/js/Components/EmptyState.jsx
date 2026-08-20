export default function EmptyState({
    title = 'Tidak ada data',
    subtitle = 'Mulailah atau Silahkan tambahkan data',
    icon: Icon,
}) {
    return (
        <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
            {Icon && (
                <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-blue-50 text-blue-600 ring-8 ring-blue-50/50 dark:bg-blue-950/50 dark:text-blue-400 dark:ring-blue-950/20">
                    <Icon className="size-8 stroke-[1.5]" />
                </div>
            )}
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">{subtitle}</p>
        </div>
    );
}
