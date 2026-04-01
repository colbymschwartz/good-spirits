/**
 * Format a decimal alcohol value as a display string.
 *
 * @param decimal - Alcohol fraction (e.g. 0.40 for 40% ABV)
 * @returns Formatted string like "40% ABV"
 */
export function formatAbv(decimal: number): string {
  const percent = parseFloat((decimal * 100).toPrecision(12));
  return `${percent}% ABV`;
}
