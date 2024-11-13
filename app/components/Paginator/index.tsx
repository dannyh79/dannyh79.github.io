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

const maxVisible: number = 3;

export function getRange(length: number, current: number, rangeLimit: number): number[] {
  const isAtFirst = current === 1;
  const isAtLast = current === rangeLimit;
  return Array.from({ length }, (_, i) => i + (isAtFirst ? current : current - (isAtLast ? 2 : 1)));
}

export function Paginator(props: PaginatorProps) {
  const { count, page: currentPage } = props;
  const range = getRange(maxVisible, currentPage, count);
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={{ query: { page: currentPage === START_PAGE ? START_PAGE : currentPage - 1 } }}
          />
        </PaginationItem>
        {currentPage - Math.ceil(maxVisible / 2) > 0 && <PaginationEllipsis />}
        {range.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink href={{ query: { page } }} isActive={page === currentPage}>
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}
        {currentPage + Math.ceil(maxVisible / 2) <= count && <PaginationEllipsis />}
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
