import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('App', () => {
  beforeEach(() => localStorage.clear());

  it('shows the starter habits', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Habit Tracker' })).toBeInTheDocument();
    expect(screen.getByLabelText('Drink 8 glasses of water')).toBeInTheDocument();
  });

  it('adds a habit and starts a streak when checked off', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText('New habit'), 'Stretch');
    await user.click(screen.getByRole('button', { name: 'Add' }));

    const checkbox = screen.getByLabelText('Stretch');
    expect(screen.getAllByLabelText('0 day streak')).toHaveLength(4);

    await user.click(checkbox);
    expect(checkbox).toBeChecked();
    expect(screen.getByLabelText('1 day streak')).toBeInTheDocument();
  });

  it('remembers habits after a reload', async () => {
    const user = userEvent.setup();
    const { unmount } = render(<App />);
    await user.click(screen.getByLabelText('Walk for 30 minutes'));
    unmount();

    render(<App />);
    expect(screen.getByLabelText('Walk for 30 minutes')).toBeChecked();
  });

  it('shows how many habits are done today', async () => {
    const user = userEvent.setup();
    render(<App />);
    expect(screen.getByRole('status')).toHaveTextContent('0 of 3 done today');

    await user.click(screen.getByLabelText('Drink 8 glasses of water'));
    expect(screen.getByRole('status')).toHaveTextContent('1 of 3 done today');

    await user.click(screen.getByLabelText('Walk for 30 minutes'));
    await user.click(screen.getByLabelText('In bed by 11pm'));
    expect(screen.getByRole('status')).toHaveTextContent('All 3 habits done today');
  });

  it('removes a habit', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: 'Remove Walk for 30 minutes' }));
    expect(screen.queryByLabelText('Walk for 30 minutes')).not.toBeInTheDocument();
  });
});
