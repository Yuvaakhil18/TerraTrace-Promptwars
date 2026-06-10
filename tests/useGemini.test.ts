import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGemini } from '../src/hooks/useGemini';
import { fetchInsights } from '../src/services/gemini';
import type { EmissionSummary } from '../src/types';

vi.mock('../src/services/gemini', () => {
  return {
    fetchInsights: vi.fn(),
  };
});

const mockSummary: EmissionSummary = {
  total_kg: 10,
  transport_kg: 3,
  food_kg: 2,
  energy_kg: 3,
  shopping_kg: 2,
  top_activity: 'None',
};

const mockInsights = [
  {
    title: 'Eat Veg',
    description: 'Switch to vegetarian meals.',
    potential_reduction_kg: 5,
    category: 'food' as const,
    icon: '🥦',
  },
];

describe('useGemini hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes with correct default values', () => {
    const { result } = renderHook(() => useGemini());
    expect(result.current.status).toBe('idle');
    expect(result.current.insights).toEqual([]);
    expect(result.current.errorMessage).toBe('');
  });

  it('transitions to loading and then success state upon successful fetch', async () => {
    vi.mocked(fetchInsights).mockResolvedValue(mockInsights);

    const { result } = renderHook(() => useGemini());

    let promise: Promise<void>;
    act(() => {
      promise = result.current.loadInsights(mockSummary);
    });

    expect(result.current.status).toBe('loading');
    expect(result.current.errorMessage).toBe('');

    await act(async () => {
      await promise;
    });

    expect(result.current.status).toBe('success');
    expect(result.current.insights).toEqual(mockInsights);
    expect(result.current.errorMessage).toBe('');
  });

  it('transitions to error state upon general fetch failure', async () => {
    vi.mocked(fetchInsights).mockRejectedValue(new Error('Connection failure'));

    const { result } = renderHook(() => useGemini());

    let promise: Promise<void>;
    act(() => {
      promise = result.current.loadInsights(mockSummary);
    });

    await act(async () => {
      await promise;
    });

    expect(result.current.status).toBe('error');
    expect(result.current.insights).toEqual([]);
    expect(result.current.errorMessage).toBe('Connection failure');
  });

  it('transitions to rate_limited state upon rate limit error', async () => {
    vi.mocked(fetchInsights).mockRejectedValue(new Error('rate_limited'));

    const { result } = renderHook(() => useGemini());

    let promise: Promise<void>;
    act(() => {
      promise = result.current.loadInsights(mockSummary);
    });

    await act(async () => {
      await promise;
    });

    expect(result.current.status).toBe('rate_limited');
    expect(result.current.insights).toEqual([]);
    expect(result.current.errorMessage).toBe('Please wait a few seconds before refreshing insights.');
  });
});
