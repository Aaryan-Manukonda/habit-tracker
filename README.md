# Habit Tracker

Track healthy habits and keep your streaks going. Check off each habit once a day, and the 🔥 counter shows how many days in a row you've done it.

Built with React, TypeScript, Vite, Tailwind CSS and Vitest. Habits are saved in your browser (localStorage).

## Getting started

```bash
npm install
npm run dev     # start the dev server
npm test        # run the tests
npm run build   # production build into dist/
```

## Project layout

- `src/App.tsx`: the page (add, check off and remove habits)
- `src/streak.ts`: streak calculation
- `src/*.test.ts(x)`: tests
