import { getSplicedStatuses } from "./get-spliced-statuses";

  // 'growth',
  // 'regrowth',
  // 'uptick',
  // 'steady',
  // 'fluctuation',
  // 'backslide',
  // 'rehab',

describe('getSplicedStatuses', () => {
  it('should return the insertion as a single item array if the array is empty', () => {
    expect(getSplicedStatuses([], 'growth')).toStrictEqual(['growth']);
  });
  it('should return the insertion first if it is superior to all other items', () => {
    expect(getSplicedStatuses(['regrowth'], 'growth')).toStrictEqual(['growth', 'regrowth']);
    expect(getSplicedStatuses([
      'regrowth',
      'rehab',
    ], 'growth')).toStrictEqual(['growth', 'regrowth', 'rehab']);
  });
  it('should return the insertion last if it is inferior to all other items', () => {
    expect(getSplicedStatuses([
      'regrowth'
    ], 'uptick')).toStrictEqual(['regrowth', 'uptick']);
    expect(getSplicedStatuses([
      'growth',
      'backslide',
    ], 'rehab')).toStrictEqual(['growth', 'backslide', 'rehab']);
  });
  it('should return the insertion in the middle if it is inferior to the first items and superior to the last items', () => {
    expect(getSplicedStatuses([
      'growth',
      'rehab',
    ], 'steady')).toStrictEqual(['growth', 'steady', 'rehab']);
    expect(getSplicedStatuses([
      'uptick',
      'fluctuation',
    ], 'steady')).toStrictEqual(['uptick', 'steady', 'fluctuation']);
    expect(getSplicedStatuses([
      'growth',
      'uptick',
      'fluctuation',
      'rehab',
    ], 'steady')).toStrictEqual(['growth', 'uptick', 'steady', 'fluctuation', 'rehab']);
  });
  it('should return the insertion in the correct place regardless of whether there are equal statuses', () => {
    expect(getSplicedStatuses([
      'growth',
      'growth',
      'steady',
      'rehab',
      'rehab',
    ], 'steady')).toStrictEqual([
      'growth',
      'growth',
      'steady',
      'steady',
      'rehab',
      'rehab',
    ]);
  });
});
