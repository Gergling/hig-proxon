import { getSetValidityStatus } from "./get-set-validity-status";

describe('getSetValidityStatus', () => {
  it(`should return 'zero' if there are no reps`, () => {
    expect(getSetValidityStatus(0, 0)).toBe('zero');
    expect(getSetValidityStatus(0, 1)).toBe('zero');
    expect(getSetValidityStatus(0, 2)).toBe('zero');
    expect(getSetValidityStatus(0, 3)).toBe('zero');
  });
  it(`should return 'invalid' if there are fewer reps than the strategy minimum but more than 0`, () => {
    expect(getSetValidityStatus(1, 2)).toBe('invalid');
    expect(getSetValidityStatus(1, 5)).toBe('invalid');
    expect(getSetValidityStatus(4, 5)).toBe('invalid');
  });
  it(`should return 'valid' if the reps meets the strategy minimum`, () => {
    expect(getSetValidityStatus(1, 1)).toBe('valid');
    expect(getSetValidityStatus(10, 1)).toBe('valid');
    expect(getSetValidityStatus(10, 10)).toBe('valid');
    expect(getSetValidityStatus(20, 10)).toBe('valid');
  });
});
