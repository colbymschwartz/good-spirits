import { formatAbv } from '../utils/formatters';

describe('formatAbv', () => {
  it('formats a standard decimal to ABV string', () => {
    expect(formatAbv(0.4)).toBe('40% ABV');
  });

  it('formats zero', () => {
    expect(formatAbv(0)).toBe('0% ABV');
  });

  it('formats small decimals without floating point artifacts', () => {
    expect(formatAbv(0.055)).toBe('5.5% ABV');
  });

  it('formats 100% (edge case)', () => {
    expect(formatAbv(1.0)).toBe('100% ABV');
  });

  it('handles typical beer ABV', () => {
    expect(formatAbv(0.05)).toBe('5% ABV');
  });

  it('handles typical wine ABV', () => {
    expect(formatAbv(0.135)).toBe('13.5% ABV');
  });

  it('handles navy strength spirits', () => {
    expect(formatAbv(0.57)).toBe('57% ABV');
  });

  it('strips unnecessary trailing zeros', () => {
    expect(formatAbv(0.4000)).toBe('40% ABV');
  });
});
