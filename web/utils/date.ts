/**
 * Format a date as YYYY-MM-DD in local time, accounting for day start hour offset.
 */
export function formatLocalDate(date: Date, dayStartHour: number = 0): string {
  const adjustedDate = new Date(date);
  adjustedDate.setHours(adjustedDate.getHours() - dayStartHour);
  
  const year = adjustedDate.getFullYear();
  const month = String(adjustedDate.getMonth() + 1).padStart(2, '0');
  const day = String(adjustedDate.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}
