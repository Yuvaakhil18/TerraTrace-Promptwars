import type { EmissionSummary } from '../../types';

interface ImpactSummaryProps {
  weeklySummary: EmissionSummary;
}

export default function ImpactSummary({ weeklySummary }: ImpactSummaryProps) {
  const globalAverage = 11.0; // Mock global average based on reference image
  const difference = globalAverage - weeklySummary.total_kg;

  return (
    <div className="flex flex-col gap-4">
      {/* Top Card: Metrics */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 flex items-center gap-2 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
          <svg className="h-3 w-3 text-[#059669]" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          YOUR IMPACT SUMMARY
        </h3>

        {/* Badge Area */}
        <div className="mb-6 rounded-xl border border-transparent bg-[#f3fbf5] p-4">
          <p className="mb-1 text-sm font-bold text-slate-900">
            Great job! <span className="text-sm font-normal">🏅</span>
          </p>
          <p className="text-xs font-medium text-[#059669]">
            You're already doing better than <strong className="font-bold">68%</strong> of users.
          </p>
        </div>

        {/* Metrics List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-2 text-slate-600">
              <svg
                className="h-3 w-3 text-slate-400"
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
              Current 7-day total
            </span>
            <span className="font-bold text-slate-900 tabular-nums">
              {weeklySummary.total_kg.toFixed(2)}{' '}
              <span className="text-[10px] font-medium text-slate-500">kg CO₂e</span>
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-2 text-slate-600">
              <svg
                className="h-3 w-3 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                />
              </svg>
              Global average
            </span>
            <span className="font-bold text-slate-900 tabular-nums">
              {globalAverage.toFixed(2)}{' '}
              <span className="text-[10px] font-medium text-slate-500">kg CO₂e</span>
            </span>
          </div>
          <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
            <span className="flex items-center gap-2 text-slate-600">
              <svg
                className="h-3 w-3 text-[#059669]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              You emit less
            </span>
            <span className="font-bold text-[#059669] tabular-nums">
              {difference > 0 ? difference.toFixed(2) : '0.00'}{' '}
              <span className="text-[10px] font-medium opacity-80">kg CO₂e</span>
            </span>
          </div>
        </div>
      </div>

      {/* Keep It Up Card */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-[#f8fafc] p-6">
        <h4 className="mb-2 text-[10px] font-bold tracking-wider text-slate-900 uppercase">
          KEEP IT UP!
        </h4>
        <p className="relative z-10 mb-20 max-w-[140px] text-xs leading-relaxed text-slate-500">
          Consistency is the key to a sustainable future.
        </p>

        {/* Decorative graphic (Globe + Windmills) */}
        <div
          className="pointer-events-none absolute -right-8 -bottom-8 h-48 w-48"
          aria-hidden="true"
        >
          {/* Globe */}
          <div className="absolute right-8 bottom-4 rotate-12 transform text-7xl opacity-90">
            🌍
          </div>
          {/* Trees */}
          <div className="absolute right-20 bottom-16 text-3xl">🌲</div>
          <div className="absolute right-6 bottom-20 text-2xl">🌳</div>
          {/* Windmills */}
          <div className="absolute right-28 bottom-24 opacity-60">
            <div className="absolute bottom-0 left-2 h-8 w-0.5 bg-slate-300" />
            <div className="absolute bottom-4 -left-1 -rotate-12 transform text-xl">⚙️</div>
          </div>
          <div className="absolute right-4 bottom-16 scale-75 opacity-50">
            <div className="absolute bottom-0 left-2 h-8 w-0.5 bg-slate-300" />
            <div className="absolute bottom-4 -left-1 rotate-12 transform text-xl">⚙️</div>
          </div>
        </div>

        <div className="relative z-10 flex gap-2">
          <div className="flex items-center gap-2 rounded-xl border border-slate-100 bg-white px-3 py-2 shadow-sm">
            <span className="text-sm font-bold text-[#059669]">7</span>
            <span className="text-[10px] font-bold text-slate-500 uppercase">Days Logged</span>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-slate-100 bg-white px-3 py-2 shadow-sm">
            <span className="text-sm font-bold text-slate-900">🔥</span>
            <span className="text-[10px] font-bold text-slate-500 uppercase">Streak</span>
          </div>
        </div>
      </div>

      {/* View All Button */}
      <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3.5 text-xs font-bold text-[#059669] shadow-sm transition-colors hover:bg-slate-50">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
          />
        </svg>
        View All Insights History
      </button>
    </div>
  );
}
