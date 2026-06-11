import type { Category } from '../types';

/** Characters that can be used for XSS / injection attacks */
// eslint-disable-next-line no-control-regex
const STRIP_PATTERN = /[<>"'`\u0000-\u001F\u007F]/g;

const VALID_CATEGORIES: readonly Category[] = ['transport', 'food', 'energy', 'shopping'] as const;

/**
 * Strips dangerous characters from user-provided text and truncates to 500 chars.
 * Used before sending any user input to the Gemini API.
 */
export function sanitizeText(input: string): string {
  return input.replace(STRIP_PATTERN, '').trim().slice(0, 500);
}

/**
 * Returns true only for finite positive numbers (excludes 0, NaN, ±Infinity).
 */
export function isPositiveNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0;
}

/**
 * Checks if a value is one of the four allowed emission categories.
 */
export function isValidCategory(value: unknown): value is Category {
  return VALID_CATEGORIES.includes(value as Category);
}

/**
 * Validates a raw activity object before persisting to Firestore.
 * Returns an error string or null if valid.
 */
export function validateActivityInput(input: {
  category: unknown;
  subType: unknown;
  quantity: unknown;
  note: unknown;
}): string | null {
  if (!isValidCategory(input.category)) {
    return 'Invalid category. Must be transport, food, energy, or shopping.';
  }
  if (typeof input.subType !== 'string' || input.subType.trim().length === 0) {
    return 'Activity type is required.';
  }
  if (!isPositiveNumber(input.quantity)) {
    return 'Quantity must be a positive number.';
  }
  if (typeof input.note !== 'string') {
    return 'Note must be a string.';
  }
  return null; // valid
}
