import { useEffect, useState, type FormEvent } from 'react';
import { currentStreak, toDateKey } from './streak';

type Habit = {
  id: string;
  name: string;
  doneDates: string[];
};

const STORAGE_KEY = 'habit-tracker:habits';

const STARTER_HABITS: Habit[] = [
  { id: 'water', name: 'Drink 8 glasses of water', doneDates: [] },
  { id: 'walk', name: 'Walk for 30 minutes', doneDates: [] },
  { id: 'sleep', name: 'In bed by 11pm', doneDates: [] },
];

function loadHabits(): Habit[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved) as Habit[];
  } catch {
    // Storage unavailable or corrupt: fall back to the starter list.
  }
  return STARTER_HABITS;
}

export default function App() {
  const [habits, setHabits] = useState<Habit[]>(loadHabits);
  const [newName, setNewName] = useState('');
  const todayKey = toDateKey(new Date());

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
    } catch {
      // Ignore: the app still works for this session without persistence.
    }
  }, [habits]);

  function toggleToday(id: string) {
    setHabits((prev) =>
      prev.map((h) =>
        h.id !== id
          ? h
          : {
              ...h,
              doneDates: h.doneDates.includes(todayKey)
                ? h.doneDates.filter((d) => d !== todayKey)
                : [...h.doneDates, todayKey],
            },
      ),
    );
  }

  function addHabit(e: FormEvent) {
    e.preventDefault();
    const name = newName.trim();
    if (!name) return;
    setHabits((prev) => [...prev, { id: crypto.randomUUID(), name, doneDates: [] }]);
    setNewName('');
  }

  function removeHabit(id: string) {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  }

  return (
    <main className="mx-auto max-w-xl p-4 sm:p-8">
      <h1 className="text-3xl font-bold text-emerald-700">Habit Tracker</h1>
      <p className="mt-1 text-gray-600">Build healthy habits one day at a time.</p>

      <form onSubmit={addHabit} className="mt-6 flex gap-2">
        <label htmlFor="new-habit" className="sr-only">
          New habit
        </label>
        <input
          id="new-habit"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="e.g. Eat a vegetable with lunch"
          className="flex-1 rounded border border-gray-300 px-3 py-2"
        />
        <button type="submit" className="rounded bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-700">
          Add
        </button>
      </form>

      {habits.length === 0 ? (
        <p className="mt-6 text-gray-500">No habits yet. Add one above to get started.</p>
      ) : (
        <ul className="mt-6 space-y-3">
          {habits.map((habit) => {
            const doneToday = habit.doneDates.includes(todayKey);
            const streak = currentStreak(habit.doneDates);
            return (
              <li key={habit.id} className="flex items-center gap-3 rounded border border-gray-200 p-3">
                <input
                  type="checkbox"
                  id={`habit-${habit.id}`}
                  checked={doneToday}
                  onChange={() => toggleToday(habit.id)}
                  className="h-5 w-5 accent-emerald-600"
                />
                <label htmlFor={`habit-${habit.id}`} className={`flex-1 ${doneToday ? 'text-gray-500 line-through' : ''}`}>
                  {habit.name}
                </label>
                <span className="text-sm font-medium text-orange-600" aria-label={`${streak} day streak`}>
                  🔥 {streak}
                </span>
                <button
                  onClick={() => removeHabit(habit.id)}
                  aria-label={`Remove ${habit.name}`}
                  className="text-gray-400 hover:text-red-600"
                >
                  ✕
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
