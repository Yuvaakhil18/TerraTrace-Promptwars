import type { EmissionSummary } from '../../types';
import { useGemini } from '../../hooks/useGemini';
import InsightCard from './InsightCard';
import Spinner from '../ui/Spinner';

interface GeminiInsightsProps {
  weeklySummary: EmissionSummary;
}

export default function GeminiInsights({ weeklySummary }: GeminiInsightsProps) {
  const { insights, status, errorMessage, loadInsights, refreshInsights } = useGemini();

  const hasNoData = weeklySummary.total_kg === 0;

  // Calculate potential savings (mocked to 25% of total for display purposes if not loaded,
  // or summing actual insights if loaded)
  let potentialSavings = (weeklySummary.total_kg * 0.25).toFixed(2);
  if (status === 'success' && insights.length > 0) {
    const total = insights.reduce((sum, ins) => sum + (ins.potential_reduction_kg || 0), 0);
    if (total > 0) potentialSavings = total.toFixed(2);
  }

  return (
    <section
      aria-labelledby="insights-heading"
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="mb-8">
        <h2
          id="insights-heading"
          className="mb-1 flex items-center gap-2 text-[10px] font-bold tracking-wider text-slate-500 uppercase"
        >
          <span className="text-sm">✨</span> AI-POWERED INSIGHTS
        </h2>
        <p className="text-xs text-slate-600">
          Personalised tips from Gemini 2.5 Flash based on your 7-day activity.
        </p>
      </div>

      {/* Hero Widget */}
      <div className="mb-10 flex flex-col items-center gap-8 sm:flex-row">
        {/* Circle Graphic */}
        <div className="relative h-32 w-32 flex-shrink-0">
          <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="none" stroke="#f1f5f9" strokeWidth="8" />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#059669"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={251.2}
              strokeDashoffset={251.2 * 0.4} // ~60% fill
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex rotate-12 transform items-center justify-center text-4xl">
            🍃
          </div>
        </div>

        {/* Callout box */}
        <div className="flex-1 rounded-xl border border-[#eaf6ec] bg-[#f3fbf5] p-5">
          <p className="mb-4 text-center text-sm leading-relaxed text-slate-700">
            Based on your activity, you can reduce <br />
            <span className="my-1 block text-2xl font-black text-[#059669]">
              {potentialSavings} kg CO₂e
            </span>
            this week with a few simple changes!
          </p>

          <button
            onClick={() => !hasNoData && loadInsights(weeklySummary)}
            disabled={hasNoData || status === 'loading'}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#059669] to-[#10b981] py-3 font-bold text-white shadow-md shadow-[#059669]/20 transition-all hover:from-[#047857] hover:to-[#059669] disabled:opacity-50"
          >
            {status === 'loading' ? (
              <span className="flex items-center gap-2">
                <Spinner label="" /> Analysing...
              </span>
            ) : (
              <>
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z"
                    clipRule="evenodd"
                  />
                </svg>
                Get Personalised Tips
              </>
            )}
          </button>
        </div>
      </div>

      {/* Recommendations Grid */}
      <div className="mb-6">
        <h3 className="mb-4 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
          TOP RECOMMENDATIONS FOR YOU
        </h3>

        {status === 'loading' && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex h-48 animate-pulse flex-col items-center justify-center rounded-xl border border-slate-100 bg-slate-50 p-4"
              />
            ))}
          </div>
        )}

        {(status === 'error' || status === 'rate_limited') && (
          <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-rose-100 bg-rose-50 px-6 py-10 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-rose-100 bg-white text-2xl shadow-sm">
              {status === 'rate_limited' ? '⏱️' : '⚠️'}
            </div>
            <div>
              <p className="mb-1 text-sm font-bold text-rose-700">
                {status === 'rate_limited' ? 'Slow down a little!' : 'Could not load insights'}
              </p>
              <p className="max-w-xs text-xs text-rose-500">{errorMessage}</p>
            </div>
            <button
              onClick={() => loadInsights(weeklySummary)}
              className="flex items-center gap-2 rounded-xl border border-rose-200 bg-white px-5 py-2.5 text-xs font-bold text-rose-600 shadow-sm transition-all hover:bg-rose-50"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Try Again
            </button>
          </div>
        )}

        {hasNoData && status === 'idle' && (
          <div className="rounded-xl border border-slate-100 bg-slate-50 py-8 text-center">
            <span className="mb-2 block text-3xl">📝</span>
            <p className="text-sm font-bold text-slate-700">Log some activities first</p>
            <p className="mt-1 text-xs text-slate-500">We need data to generate recommendations.</p>
          </div>
        )}

        {status === 'success' && insights.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {insights.slice(0, 4).map((insight, i) => (
              <InsightCard key={i} insight={insight} />
            ))}
          </div>
        )}

        {/* Mock/Default State if Idle and has data (matching reference image) */}
        {status === 'idle' && !hasNoData && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              {
                title: 'Use Public Transport',
                desc: 'Switching to public transport 2 times this week.',
                sav: '0.85',
                icon: '🚌',
                bg: 'bg-blue-50',
                color: 'text-blue-500',
              },
              {
                title: 'Reduce Meat Intake',
                desc: 'Try reducing non-veg meals by 1 this week.',
                sav: '0.15',
                icon: '🥗',
                bg: 'bg-purple-50',
                color: 'text-purple-500',
              },
              {
                title: 'Save Energy',
                desc: 'Turn off lights & unplug devices when not in use.',
                sav: '0.05',
                icon: '💡',
                bg: 'bg-amber-50',
                color: 'text-amber-500',
              },
              {
                title: 'Reduce Waste',
                desc: 'Avoid single-use items and recycle more.',
                sav: '0.03',
                icon: '♻️',
                bg: 'bg-[#eaf6ec]',
                color: 'text-[#059669]',
              },
            ].map((mock, i) => (
              <div
                key={i}
                className="group flex flex-col items-center rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm transition-all hover:border-[#059669] hover:shadow-md"
              >
                <div
                  className={`h-12 w-12 ${mock.bg} mb-3 flex items-center justify-center rounded-full text-2xl transition-transform group-hover:scale-110`}
                >
                  {mock.icon}
                </div>
                <h4 className="mb-1 text-xs font-bold text-slate-900">{mock.title}</h4>
                <p className="mb-4 flex-1 text-[10px] leading-relaxed text-slate-500">
                  {mock.desc}
                </p>
                <div className="w-full border-t border-slate-100 pt-3">
                  <p className="mb-0.5 text-[9px] font-bold tracking-wider text-slate-400 uppercase">
                    Potential savings
                  </p>
                  <p className="text-xs font-bold text-[#059669]">{mock.sav} kg CO₂e</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer: Refresh button (when tips loaded) + tagline */}
      <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-6 sm:flex-row">
        <p className="flex items-center gap-1 text-xs font-medium text-slate-500">
          <span className="text-[#059669]">🍃</span> Small changes. Big impact on our planet.{' '}
          <span className="text-blue-500">🌍</span>
        </p>

        {status === 'success' && (
          <button
            onClick={() => refreshInsights(weeklySummary)}
            disabled={false}
            className="group flex shrink-0 items-center gap-2 rounded-xl border border-[#059669] px-5 py-2.5 text-xs font-bold text-[#059669] transition-all hover:bg-[#eaf6ec]"
          >
            <svg
              className="h-4 w-4 transition-transform duration-500 group-hover:rotate-180"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Refresh Insights
          </button>
        )}
      </div>
    </section>
  );
}
