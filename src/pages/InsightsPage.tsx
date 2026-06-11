import { useActivities } from '../hooks/useActivities';
import { useEmissions } from '../hooks/useEmissions';
import GeminiInsights from '../components/Insights/GeminiInsights';
import ImpactSummary from '../components/Insights/ImpactSummary';
import Spinner from '../components/ui/Spinner';

export default function InsightsPage() {
  const { activities, loading } = useActivities();
  const { getWeeklySummary } = useEmissions(activities);
  const weeklySummary = getWeeklySummary();

  if (loading) {
    return (
      <div className="flex min-h-full items-center justify-center">
        <Spinner label="Loading insights..." />
      </div>
    );
  }

  // Mock trend data based on reference image
  const trends = {
    total: { value: 12, isDown: true },
    transport: { value: 12, isDown: true },
    food: { value: 0, isDown: false },
    energy: { value: 0, isDown: false },
  };

  const TrendIndicator = ({ trend }: { trend: { value: number; isDown: boolean } }) => {
    if (trend.value === 0) {
      return <span className="text-[10px] font-bold text-slate-400">— 0% vs previous 7 days</span>;
    }
    return (
      <div className="flex items-center gap-1 text-[10px] font-bold text-[#059669]">
        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V3a1 1 0 012 0v9.586l2.293-2.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
        <span>{trend.value}% vs previous 7 days</span>
      </div>
    );
  };

  return (
    <div className="relative mx-auto max-w-7xl space-y-6">
      {/* Header Section */}
      <div className="relative z-10 mb-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900">
            <span className="text-2xl">✨</span> AI Insights
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Gemini 2.5 Flash analyses your 7-day data and suggests personalised reductions.
          </p>
        </div>

        <button className="flex shrink-0 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50">
          <svg
            className="h-4 w-4 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          This Week (7 days)
          <svg
            className="h-4 w-4 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Decorative Header Graphic (Right aligned, behind content) */}
      <div
        className="pointer-events-none absolute top-0 right-0 h-32 w-64 opacity-80"
        aria-hidden="true"
      >
        <div className="absolute right-0 bottom-0 z-10 flex h-24 w-32 items-end gap-1 rounded-xl border border-slate-100 bg-white p-2 shadow-md">
          <div className="h-2/3 w-full rounded-sm bg-[#bbf7d0]" />
          <div className="h-full w-full rounded-sm bg-[#86efac]" />
          <div className="h-1/2 w-full rounded-sm bg-[#dcfce7]" />
          <div className="h-4/5 w-full rounded-sm bg-[#4ade80]" />
        </div>
        <div className="absolute right-28 bottom-4 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 shadow-sm">
          <div className="h-6 w-6 rounded-full border-2 border-white bg-yellow-400" />
        </div>
        <div className="absolute -right-4 bottom-2 z-0 rotate-12 transform text-6xl">🌿</div>
        <div className="absolute top-4 right-24 z-0 -rotate-12 transform text-4xl opacity-50">
          🍃
        </div>
        <div className="absolute top-12 right-40 h-8 w-16 rounded-full bg-[#eaf6ec] blur-md" />
      </div>

      {/* Data Summary Section */}
      <div className="animate-fade-in-up relative z-10" style={{ animationDelay: '0.1s' }}>
        <h2 className="mb-4 text-xs font-bold tracking-wider text-slate-500 uppercase">
          DATA USED FOR ANALYSIS (PAST 7 DAYS)
        </h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* TOTAL */}
          <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#eaf6ec]">
              <svg
                className="h-6 w-6 text-[#059669]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <div>
              <p className="mb-0.5 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                TOTAL
              </p>
              <div className="mb-1 flex items-baseline gap-1">
                <span className="text-xl leading-none font-black text-slate-900 tabular-nums">
                  {weeklySummary.total_kg.toFixed(2)}
                </span>
                <span className="text-[10px] font-bold text-slate-500">kg CO₂e</span>
              </div>
              <TrendIndicator trend={trends.total} />
            </div>
          </div>

          {/* TRANSPORT */}
          <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-xl">
              🚗
            </div>
            <div>
              <p className="mb-0.5 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                TRANSPORT
              </p>
              <div className="mb-1 flex items-baseline gap-1">
                <span className="text-xl leading-none font-black text-slate-900 tabular-nums">
                  {weeklySummary.transport_kg.toFixed(2)}
                </span>
                <span className="text-[10px] font-bold text-slate-500">kg CO₂e</span>
              </div>
              <TrendIndicator trend={trends.transport} />
            </div>
          </div>

          {/* FOOD */}
          <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-400">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z" />
              </svg>
            </div>
            <div>
              <p className="mb-0.5 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                FOOD
              </p>
              <div className="mb-1 flex items-baseline gap-1">
                <span className="text-xl leading-none font-black text-slate-900 tabular-nums">
                  {weeklySummary.food_kg.toFixed(2)}
                </span>
                <span className="text-[10px] font-bold text-slate-500">kg CO₂e</span>
              </div>
              <TrendIndicator trend={trends.food} />
            </div>
          </div>

          {/* ENERGY */}
          <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-500">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <p className="mb-0.5 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                ENERGY
              </p>
              <div className="mb-1 flex items-baseline gap-1">
                <span className="text-xl leading-none font-black text-slate-900 tabular-nums">
                  {weeklySummary.energy_kg.toFixed(2)}
                </span>
                <span className="text-[10px] font-bold text-slate-500">kg CO₂e</span>
              </div>
              <TrendIndicator trend={trends.energy} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid (2 columns) */}
      <div
        className="animate-fade-in-up grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]"
        style={{ animationDelay: '0.2s' }}
      >
        {/* Left Column: AI Insights */}
        <div>
          <GeminiInsights weeklySummary={weeklySummary} />
        </div>

        {/* Right Column: Impact Summary */}
        <div>
          <ImpactSummary weeklySummary={weeklySummary} />
        </div>
      </div>
    </div>
  );
}
