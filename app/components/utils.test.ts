import { describe, expect, it } from 'vitest';
import { formatDate } from './utils';

describe('formatDate()', () => {
  const inputDate = new Date(2024, 1, 1);

  it('returns "February 1, 2024"', () => {
    expect(formatDate(inputDate)).toEqual('February 1, 2024');
  });

  describe('with relative date', () => {
    const testCases: {
      description: string;
      currentDate: Date;
      expected: string;
    }[] = [
      {
        description: 'returns "February 1, 2024 (Today)"',
        currentDate: new Date(2024, 1, 1),
        expected: 'February 1, 2024 (Today)',
      },

      {
        description: 'returns "February 1, 2024 (1d ago)"',
        currentDate: new Date(2024, 1, 2),
        expected: 'February 1, 2024 (1d ago)',
      },
      {
        description: 'returns "February 1, 2024 (1mo ago)"',
        currentDate: new Date(2024, 2, 2),
        expected: 'February 1, 2024 (1mo ago)',
      },
      {
        description: 'returns "February 1, 2024 (1y ago)"',
        currentDate: new Date(2025, 2, 2),
        expected: 'February 1, 2024 (1y ago)',
      },
    ];

    testCases.forEach(({ description, currentDate, expected }) => {
      it(description, () => {
        expect(formatDate(inputDate, true, currentDate)).toEqual(expected);
      });
    });
  });
});
