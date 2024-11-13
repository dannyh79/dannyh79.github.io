import { describe, expect, it } from 'vitest';
import { getRange } from './utils';

describe('getRange()', () => {
  describe('with range length of 3 and range limit of 5', () => {
    const length = 3;
    const rangeLimit = 5;

    const testCases: {
      description: string;
      current: number;
      expected: number[];
    }[] = [
      {
        description: 'returns [1, 2, 3] when current is 1',
        current: 1,
        expected: [1, 2, 3],
      },
      {
        description: 'returns [1, 2, 3] when current is 2',
        current: 2,
        expected: [1, 2, 3],
      },
      {
        description: 'returns [2, 3, 4] when current is 3',
        current: 3,
        expected: [2, 3, 4],
      },
      {
        description: 'returns [3, 4, 5] when current is 4',
        current: 4,
        expected: [3, 4, 5],
      },
      {
        description: 'returns [3, 4, 5] when current is 5',
        current: 5,
        expected: [3, 4, 5],
      },
    ];

    testCases.forEach(({ description, current, expected }) => {
      it(description, () => {
        expect(getRange(length, current, rangeLimit)).toStrictEqual(expected);
      });
    });
  });
});
