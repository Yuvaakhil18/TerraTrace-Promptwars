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
      <div className="min-h-full flex items-center justify-center">
        <Spinner label="Loading insights..." />
      </div>
    );
  }

  // Mock trend data based on reference image
  const trends = {
    total: { value: 12, isDown: true },
    transport: { value: 12, isDown: true },
    food: { value: 0, isDown: false },
    energy: { value: 0, isDown: false }
  };

  const TrendIndicator = ({ trend }: { trend: { value: number, isDown: boolean } }) => {
    if (trend.value === 0) {
      return <span className="text-[10px] font-bold text-slate-400">— 0% vs previous 7 days</span>;
    }
    return (
      <div className="flex items-center gap-1 text-[10px] font-bold text-[#059669]">
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V3a1 1 0 012 0v9.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        <span>{trend.value}% vs previous 7 days</span>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 relative">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4 relative z-10">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <span className="text-2xl">✨</span> AI Insights
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Gemini 2.5 Flash analyses your 7-day data and suggests personalised reductions.
          </p>
        </div>
        
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 shadow-sm shrink-0">
          <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          This Week (7 days)
          <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Decorative Header Graphic (Right aligned, behind content) */}
      <div className="absolute top-0 right-0 w-64 h-32 pointer-events-none opacity-80" aria-hidden="true">
         <div className="absolute right-0 bottom-0 w-32 h-24 bg-white rounded-xl shadow-md border border-slate-100 flex items-end p-2 gap-1 z-10">
            <div className="w-full h-2/3 bg-[#bbf7d0] rounded-sm" />
            <div className="w-full h-full bg-[#86efac] rounded-sm" />
            <div className="w-full h-1/2 bg-[#dcfce7] rounded-sm" />
            <div className="w-full h-4/5 bg-[#4ade80] rounded-sm" />
         </div>
         <div className="absolute right-28 bottom-4 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center z-20 shadow-sm">
            <div className="w-6 h-6 bg-yellow-400 rounded-full border-2 border-white" />
         </div>
         <div className="absolute -right-4 bottom-2 text-6xl transform rotate-12 z-0">🌿</div>
         <div className="absolute right-24 top-4 text-4xl transform -rotate-12 opacity-50 z-0">🍃</div>
         <div className="absolute right-40 top-12 w-16 h-8 bg-[#eaf6ec] rounded-full blur-md" />
      </div>

      {/* Data Summary Section */}
      <div className="relative z-10 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
          DATA USED FOR ANALYSIS (PAST 7 DAYS)
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* TOTAL */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-[#eaf6ec] rounded-xl flex items-center justify-center shrink-0">
              <svg className="w-6 h-6 text-[#059669]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">TOTAL</p>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-xl font-black text-slate-900 tabular-nums leading-none">{weeklySummary.total_kg.toFixed(2)}</span>
                <span className="text-[10px] font-bold text-slate-500">kg CO₂e</span>
              </div>
              <TrendIndicator trend={trends.total} />
            </div>
          </div>

          {/* TRANSPORT */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center shrink-0 text-xl">
              🚗
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">TRANSPORT</p>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-xl font-black text-slate-900 tabular-nums leading-none">{weeklySummary.transport_kg.toFixed(2)}</span>
                <span className="text-[10px] font-bold text-slate-500">kg CO₂e</span>
              </div>
              <TrendIndicator trend={trends.transport} />
            </div>
          </div>

          {/* FOOD */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center shrink-0 text-purple-400">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z" /></svg>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">FOOD</p>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-xl font-black text-slate-900 tabular-nums leading-none">{weeklySummary.food_kg.toFixed(2)}</span>
                <span className="text-[10px] font-bold text-slate-500">kg CO₂e</span>
              </div>
              <TrendIndicator trend={trends.food} />
            </div>
          </div>

          {/* ENERGY */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center shrink-0 text-amber-500">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">ENERGY</p>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-xl font-black text-slate-900 tabular-nums leading-none">{weeklySummary.energy_kg.toFixed(2)}</span>
                <span className="text-[10px] font-bold text-slate-500">kg CO₂e</span>
              </div>
              <TrendIndicator trend={trends.energy} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid (2 columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        
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
