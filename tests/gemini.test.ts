import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { EmissionSummary, Insight } from '../src/types';

// Mock environment variables
vi.stubEnv('VITE_GEMINI_API_KEY', 'test-api-key');

const mockGenerateContent = vi.fn();

vi.mock('@google/genai', () => {
  return {
    GoogleGenAI: vi.fn().mockImplementation(() => {
      return {
        models: {
          generateContent: mockGenerateContent,
        },
      };
    }),
  };
});

const mockSummary: EmissionSummary = {
  total_kg: 25.5,
  transport_kg: 10.5,
  food_kg: 5.0,
  energy_kg: 8.0,
  shopping_kg: 2.0,
  top_activity: 'Car driving (8.0 kg CO₂e)',
};

const mockValidResponse = [
  {
    title: 'Eat Less Meat',
    description: 'Replace one beef meal with chicken or lentils.',
    saving_kg: 5.4,
    category: 'food',
    icon: '🥗',
  },
  {
    title: 'Use Bus',
    description: 'Take public transit instead of driving.',
    saving_kg: 8.2,
    category: 'transport',
    icon: '🚌',
  },
  {
    title: 'Unplug Devices',
    description: 'Avoid standby consumption by pulling the plug.',
    saving_kg: 2.1,
    category: 'energy',
    icon: '🔌',
  },
];

describe('gemini service: fetchInsights', () => {
  let fetchInsights: (summary: EmissionSummary) => Promise<Insight[]>;

  beforeEach(async () => {
    vi.clearAllMocks();
    localStorage.clear();
    vi.useFakeTimers();
    
    // Reset module registry and dynamically import to ensure a clean module state (lastCallTime = 0)
    vi.resetModules();
    const module = await import('../src/services/gemini');
    fetchInsights = module.fetchInsights;
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('successfully fetches and parses insights', async () => {
    mockGenerateContent.mockResolvedValue({
      text: JSON.stringify(mockValidResponse),
    });

    const insights = await fetchInsights(mockSummary);
    expect(insights).toHaveLength(3);
    expect(insights[0].title).toBe('Eat Less Meat');
    expect(mockGenerateContent).toHaveBeenCalledTimes(1);
  });

  it('uses cached value when summary is identical and time is within TTL', async () => {
    mockGenerateContent.mockResolvedValue({
      text: JSON.stringify(mockValidResponse),
    });

    // First call (hits API)
    const res1 = await fetchInsights(mockSummary);
    expect(res1).toHaveLength(3);
    expect(mockGenerateContent).toHaveBeenCalledTimes(1);

    // Second call should read from cache (even if rate limit is active, cache is checked first)
    const res2 = await fetchInsights(mockSummary);
    expect(res2).toEqual(res1);
    expect(mockGenerateContent).toHaveBeenCalledTimes(1); // No new API calls
  });

  it('throws rate limit error when called too fast with different summaries', async () => {
    mockGenerateContent.mockResolvedValue({
      text: JSON.stringify(mockValidResponse),
    });

    // First call
    await fetchInsights(mockSummary);

    // Second call with different summary (triggers API lookup) should fail due to rate limit
    const differentSummary = { ...mockSummary, total_kg: 30.0 };
    await expect(fetchInsights(differentSummary)).rejects.toThrow('rate_limited');
  });

  it('passes rate limit check after 10 seconds', async () => {
    mockGenerateContent.mockResolvedValue({
      text: JSON.stringify(mockValidResponse),
    });

    const start = Date.now();

    // First call
    await fetchInsights(mockSummary);

    // Fast-forward 11 seconds
    vi.setSystemTime(start + 11_000);

    const differentSummary = { ...mockSummary, total_kg: 30.0 };
    const res2 = await fetchInsights(differentSummary);
    expect(res2).toHaveLength(3);
    expect(mockGenerateContent).toHaveBeenCalledTimes(2);
  });

  it('handles API errors gracefully', async () => {
    mockGenerateContent.mockRejectedValue(new Error('Quota exceeded'));

    await expect(fetchInsights(mockSummary)).rejects.toThrow('Gemini API error: Quota exceeded');
  });

  it('handles JSON parsing errors gracefully', async () => {
    mockGenerateContent.mockResolvedValue({
      text: 'invalid json content here',
    });

    await expect(fetchInsights(mockSummary)).rejects.toThrow('Failed to parse AI response. Please try again.');
  });
});
