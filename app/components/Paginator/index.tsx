import {
  Pagination,
  PaginationContent,
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

// TODO: Add PaginationEllipsis
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
            <PaginationLink href={{ query: { page } }} isActive={page === currentPage}>
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}
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
