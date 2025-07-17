import { getSetValidityComparison } from "./get-set-validity-comparison";

describe('getSetValidityComparison', () => {
  it('should return -1 if the latter has a superior status', () => {
    expect(getSetValidityComparison('zero', 'invalid')).toBe(-1);
    expect(getSetValidityComparison('invalid', 'valid')).toBe(-1);
  });
  it('should return 1 if the former has a superior status', () => {
    expect(getSetValidityComparison('invalid', 'zero')).toBe(1);
    expect(getSetValidityComparison('valid', 'invalid')).toBe(1);
  });
  it('should return 0 for equal statuses', () => {
    expect(getSetValidityComparison('zero', 'zero')).toBe(0);
    expect(getSetValidityComparison('invalid', 'invalid')).toBe(0);
    expect(getSetValidityComparison('valid', 'valid')).toBe(0);
  });
});
