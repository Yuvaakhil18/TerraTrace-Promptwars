import { describe, it, expect } from 'vitest';
import { validateActivityInput } from '../src/utils/validators';

describe('validateActivityInput', () => {
  const validInput = {
    category: 'transport',
    subType: 'car_petrol',
    quantity: 10,
    note: 'Morning commute',
  };

  it('returns null for a fully valid input', () => {
    expect(validateActivityInput(validInput)).toBeNull();
  });

  it('returns error for invalid category', () => {
    expect(validateActivityInput({ ...validInput, category: 'waste' })).toMatch(/invalid category/i);
    expect(validateActivityInput({ ...validInput, category: null })).toMatch(/invalid category/i);
    expect(validateActivityInput({ ...validInput, category: '' })).toMatch(/invalid category/i);
  });

  it('returns error for empty subType', () => {
    expect(validateActivityInput({ ...validInput, subType: '' })).toMatch(/activity type/i);
    expect(validateActivityInput({ ...validInput, subType: '   ' })).toMatch(/activity type/i);
    expect(validateActivityInput({ ...validInput, subType: 123 })).toMatch(/activity type/i);
  });

  it('returns error for non-positive quantity', () => {
    expect(validateActivityInput({ ...validInput, quantity: 0 })).toMatch(/positive number/i);
    expect(validateActivityInput({ ...validInput, quantity: -5 })).toMatch(/positive number/i);
    expect(validateActivityInput({ ...validInput, quantity: NaN })).toMatch(/positive number/i);
    expect(validateActivityInput({ ...validInput, quantity: '10' })).toMatch(/positive number/i);
  });

  it('returns error if note is not a string', () => {
    expect(validateActivityInput({ ...validInput, note: 42 })).toMatch(/note/i);
    expect(validateActivityInput({ ...validInput, note: null })).toMatch(/note/i);
  });

  it('accepts all valid categories', () => {
    for (const cat of ['transport', 'food', 'energy', 'shopping']) {
      expect(validateActivityInput({ ...validInput, category: cat })).toBeNull();
    }
  });

  it('accepts empty string note', () => {
    expect(validateActivityInput({ ...validInput, note: '' })).toBeNull();
  });
});
