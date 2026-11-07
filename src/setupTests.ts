import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Node 22+ ships its own (undefined unless configured) localStorage global, which
// shadows jsdom's. Point it back at jsdom's so tests exercise real storage.
const { jsdom } = globalThis as unknown as { jsdom: { window: Window } };
Object.defineProperty(globalThis, 'localStorage', {
  configurable: true,
  value: jsdom.window.localStorage,
});

afterEach(() => cleanup());
