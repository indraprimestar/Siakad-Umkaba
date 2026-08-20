import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/Components/ui/pagination';
import { cn } from '@/lib/utils';

export default function PaginationTable({ meta, links }) {
    return (
        <Pagination>
            <PaginationContent className="justyfy-center flex flex-wrap lg:justify-end">
                <PaginationItem>
                    <PaginationPrevious
                        className={cn('mb-1', !links.prev && 'cursor-not-allowed')}
                        href={links.prev}
                    ></PaginationPrevious>
                </PaginationItem>
                {meta.links.slice(1, -1).map((link, index) => (
                    <PaginationItem key={index} className="lb:mb-0 mx-1 mb-1">
                        <PaginationLink href={link.url} isActive={link.active}>
                            {link.label}
                        </PaginationLink>
                    </PaginationItem>
                ))}
                <PaginationItem>
                    <PaginationNext
                        className={cn('mb-1', !links.next && 'cursor-not-allowed')}
                        href={links.next}
                    ></PaginationNext>
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}
