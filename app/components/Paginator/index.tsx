import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './Pagination';
import { MAX_VISIBLE, START_PAGE } from './constants';

export * from './constants';

export type PaginatorProps = {
  count: number;
  page: number;
};

export function getRange(length: number, current: number, rangeLimit: number): number[] {
  const isAtFirst = current === 1;
  const isAtLast = current === rangeLimit;
  return Array.from({ length }, (_, i) => i + (isAtFirst ? current : current - (isAtLast ? 2 : 1)));
}

export function Paginator(props: PaginatorProps) {
  const { count, page: currentPage } = props;
  const range = getRange(MAX_VISIBLE, currentPage, count);
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={{ query: { page: currentPage === START_PAGE ? START_PAGE : currentPage - 1 } }}
          />
        </PaginationItem>
        {currentPage - Math.ceil(MAX_VISIBLE / 2) > 0 && <PaginationEllipsis />}
        {range.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink href={{ query: { page } }} isActive={page === currentPage}>
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}
        {currentPage + Math.ceil(MAX_VISIBLE / 2) <= count && <PaginationEllipsis />}
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
