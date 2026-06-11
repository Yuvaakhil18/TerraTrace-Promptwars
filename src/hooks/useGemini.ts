import { useState, useCallback } from 'react';
import type { Insight, EmissionSummary } from '../types';
import { fetchInsights, clearInsightsCache } from '../services/gemini';

type Status = 'idle' | 'loading' | 'success' | 'error' | 'rate_limited';

/**
 * Hook that manages Gemini AI insight fetching with caching and rate-limit handling.
 * Returns AI-generated reduction tips based on the user's weekly emission summary.
 */
export function useGemini() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const loadInsights = useCallback(async (summary: EmissionSummary) => {
    setStatus('loading');
    setErrorMessage('');
    try {
      const data = await fetchInsights(summary);
      setInsights(data);
      setStatus('success');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      if (message === 'rate_limited') {
        setStatus('rate_limited');
        setErrorMessage('Please wait a few seconds before refreshing insights.');
      } else {
        setStatus('error');
        setErrorMessage(message);
      }
    }
  }, []);

  const refreshInsights = useCallback(async (summary: EmissionSummary) => {
    clearInsightsCache();
    await loadInsights(summary);
  }, [loadInsights]);

  return { insights, status, errorMessage, loadInsights, refreshInsights };
}
