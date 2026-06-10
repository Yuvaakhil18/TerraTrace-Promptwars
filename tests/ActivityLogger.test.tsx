import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import ActivityLogger from '../src/components/Logger/ActivityLogger';

describe('ActivityLogger', () => {
  it('renders all required form elements', () => {
    render(<ActivityLogger onAdd={vi.fn()} />);
    expect(screen.getByRole('spinbutton', { name: /quantity/i })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /activity type/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log activity/i })).toBeInTheDocument();
  });

  it('shows validation error for zero quantity', async () => {
    const user = userEvent.setup();
    render(<ActivityLogger onAdd={vi.fn()} />);
    const qty = screen.getByRole('spinbutton', { name: /quantity/i });
    await user.tripleClick(qty);
    await user.keyboard('0');
    const submitBtn = screen.getByRole('button', { name: /log activity/i });
    await user.click(submitBtn);
    // Error alert should appear in the DOM
    const alert = await screen.findByRole('alert');
    expect(alert).toBeInTheDocument();
  });

  it('all interactive elements are keyboard reachable', () => {
    render(<ActivityLogger onAdd={vi.fn()} />);
    const focusable = screen.getAllByRole('button').concat(
      screen.getAllByRole('combobox'),
      screen.getAllByRole('spinbutton'),
    );
    focusable.forEach(el => {
      if (el.getAttribute('role') === 'radio' && el.getAttribute('aria-checked') === 'false') {
        expect(el).toHaveAttribute('tabindex', '-1');
      } else {
        expect(el).not.toHaveAttribute('tabindex', '-1');
      }
    });
  });
});
