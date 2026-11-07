import { describe, expect, it } from 'vitest';
import { currentStreak, toDateKey } from './streak';

const today = new Date(2026, 10, 6); // 6 Nov 2026

describe('currentStreak', () => {
  it('is 0 with no completions', () => {
    expect(currentStreak([], today)).toBe(0);
  });

  it('counts consecutive days ending today', () => {
    expect(currentStreak(['2026-11-04', '2026-11-05', '2026-11-06'], today)).toBe(3);
  });

  it('keeps yesterday\'s streak alive before today is checked off', () => {
    expect(currentStreak(['2026-11-04', '2026-11-05'], today)).toBe(2);
  });

  it('stops at a missed day', () => {
    expect(currentStreak(['2026-11-02', '2026-11-03', '2026-11-05', '2026-11-06'], today)).toBe(2);
  });

  it('works across month boundaries', () => {
    expect(currentStreak(['2026-10-31', '2026-11-01'], new Date(2026, 10, 1))).toBe(2);
  });
});

describe('toDateKey', () => {
  it('formats a local date as YYYY-MM-DD', () => {
    expect(toDateKey(new Date(2026, 0, 9))).toBe('2026-01-09');
  });
});
