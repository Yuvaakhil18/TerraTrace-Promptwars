interface EmissionsSummaryProps {
  todayTotal: number;
  weeklyTotal: number;
}

export default function EmissionsSummary({ todayTotal, weeklyTotal }: EmissionsSummaryProps) {
  // Mock trend data based on reference image
  const todayTrend = { value: 100, isDown: true };
  const weeklyTrend = { value: 12, isDown: true };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      {/* Today's Emissions Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 flex justify-between shadow-sm relative overflow-hidden">
        <div className="flex gap-4">
          <div className="w-16 h-16 bg-[#eaf6ec] rounded-2xl flex items-center justify-center flex-shrink-0">
            {/* CO2 Cloud Icon */}
            <svg className="w-8 h-8 text-[#059669]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.5 19c2.5 0 4.5-2 4.5-4.5S20 10 17.5 10c-.2 0-.4 0-.6.1-1-3.6-4.6-5.8-8.2-4.8-2.6.7-4.6 2.7-5.3 5.3-.1.5-.1 1 0 1.5C1.5 12.3 0 13.9 0 15.9c0 2 1.6 3.6 3.6 3.6h13.9zM10 12c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1zm3 0c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1z" />
            </svg>
          </div>
          <div className="flex flex-col justify-center">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Today's Emissions
            </h3>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black text-slate-900 tabular-nums tracking-tighter">
                {todayTotal.toFixed(2)}
              </span>
              <span className="text-sm font-semibold text-slate-500">kg CO₂e</span>
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-xs font-bold text-[#059669]">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V3a1 1 0 012 0v9.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>{todayTrend.value}% vs yesterday</span>
            </div>
          </div>
        </div>
        <div className="flex items-center">
          <div className="w-10 h-10 border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 bg-slate-50">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      </div>

      {/* 7-Day Total Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 flex justify-between shadow-sm relative overflow-hidden">
        <div className="flex gap-4">
          <div className="w-16 h-16 bg-[#eaf6ec] rounded-2xl flex items-center justify-center flex-shrink-0">
            {/* Calendar Icon */}
            <svg className="w-8 h-8 text-[#059669]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="flex flex-col justify-center">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              7-Day Total
            </h3>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black text-slate-900 tabular-nums tracking-tighter">
                {weeklyTotal.toFixed(2)}
              </span>
              <span className="text-sm font-semibold text-slate-500">kg CO₂e</span>
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-xs font-bold text-[#059669]">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V3a1 1 0 012 0v9.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>{weeklyTrend.value}% vs last 7 days</span>
            </div>
          </div>
        </div>
        <div className="flex items-center">
          <div className="w-10 h-10 border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 bg-slate-50">
            <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
        </div>
      </div>

    </div>
  );
}
