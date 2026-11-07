// Dates are stored as local "YYYY-MM-DD" strings so a habit done late at night
// still counts for that day.
export function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function previousDay(date: Date): Date {
  const prev = new Date(date);
  prev.setDate(prev.getDate() - 1);
  return prev;
}

// Number of consecutive days the habit was done, ending today. If today isn't
// done yet, the streak still counts from yesterday so it doesn't reset at midnight.
export function currentStreak(doneDates: string[], today: Date = new Date()): number {
  const done = new Set(doneDates);
  let day = done.has(toDateKey(today)) ? today : previousDay(today);
  let streak = 0;
  while (done.has(toDateKey(day))) {
    streak++;
    day = previousDay(day);
  }
  return streak;
}
