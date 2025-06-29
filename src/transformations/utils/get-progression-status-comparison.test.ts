import { getProgressionStatusComparison } from "./get-progression-status-comparison";

describe('getProgressionStatusComparison', () => {
  it('should return a negative number if the first argument is an inferior status', () => {
    expect(getProgressionStatusComparison('regrowth', 'growth')).toBe(-1);
    expect(getProgressionStatusComparison('uptick', 'regrowth')).toBe(-1);
    expect(getProgressionStatusComparison('steady', 'uptick')).toBe(-1);
    expect(getProgressionStatusComparison('fluctuation', 'steady')).toBe(-1);
    expect(getProgressionStatusComparison('backslide', 'fluctuation')).toBe(-1);
    expect(getProgressionStatusComparison('rehab', 'backslide')).toBe(-1);
    expect(getProgressionStatusComparison('rehab', 'growth')).toBe(-6);
  });
  it('should return a positive number if the first argument is a superior status', () => {
    expect(getProgressionStatusComparison('growth', 'regrowth')).toBe(1);
    expect(getProgressionStatusComparison('regrowth', 'uptick')).toBe(1);
    expect(getProgressionStatusComparison('uptick', 'steady')).toBe(1);
    expect(getProgressionStatusComparison('steady', 'fluctuation')).toBe(1);
    expect(getProgressionStatusComparison('fluctuation', 'backslide')).toBe(1);
    expect(getProgressionStatusComparison('backslide', 'rehab')).toBe(1);
    expect(getProgressionStatusComparison('growth', 'rehab')).toBe(6);
  });
  it('should return 0 if the arguments are the same status', () => {
    expect(getProgressionStatusComparison('growth', 'growth')).toBe(0);
    expect(getProgressionStatusComparison('regrowth', 'regrowth')).toBe(0);
    expect(getProgressionStatusComparison('uptick', 'uptick')).toBe(0);
    expect(getProgressionStatusComparison('steady', 'steady')).toBe(0);
    expect(getProgressionStatusComparison('fluctuation', 'fluctuation')).toBe(0);
    expect(getProgressionStatusComparison('backslide', 'backslide')).toBe(0);
    expect(getProgressionStatusComparison('rehab', 'rehab')).toBe(0);
  });
});