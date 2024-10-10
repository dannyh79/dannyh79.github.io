import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './Pagination';
import { START_PAGE } from './constants';

export * from './constants';

export type PaginatorProps = {
  count: number;
  page: number;
};

export function Paginator(props: PaginatorProps) {
  const { count, page: currentPage } = props;
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={{ query: { page: currentPage === START_PAGE ? START_PAGE : currentPage - 1 } }}
          />
        </PaginationItem>
        {Array.from({ length: count }, (_, i) => i + START_PAGE).map((page) => (
          <PaginationItem key={page}>
            <PaginationLink href={{ query: { page } }}>{page}</PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext
            href={{ query: { page: currentPage === count ? currentPage : currentPage + 1 } }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

export default Paginator;
