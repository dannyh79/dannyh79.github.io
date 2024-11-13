export function getRange(length: number, current: number, rangeLimit: number): number[] {
  const isAtFirst = current === 1;
  const isAtLast = current === rangeLimit;
  return Array.from({ length }, (_, i) => i + (isAtFirst ? current : current - (isAtLast ? 2 : 1)));
}
