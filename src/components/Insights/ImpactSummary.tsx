import type { EmissionSummary } from '../../types';

interface ImpactSummaryProps {
  weeklySummary: EmissionSummary;
}

export default function ImpactSummary({ weeklySummary }: ImpactSummaryProps) {
  const globalAverage = 11.00; // Mock global average based on reference image
  const difference = globalAverage - weeklySummary.total_kg;
  
  return (
    <div className="flex flex-col gap-4">
      
      {/* Top Card: Metrics */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm relative overflow-hidden">
        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
          <svg className="w-3 h-3 text-[#059669]" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          YOUR IMPACT SUMMARY
        </h3>
        
        {/* Badge Area */}
        <div className="bg-[#f3fbf5] rounded-xl p-4 mb-6 border border-transparent">
          <p className="text-sm font-bold text-slate-900 mb-1">Great job! <span className="text-sm font-normal">🏅</span></p>
          <p className="text-xs text-[#059669] font-medium">You're already doing better than <strong className="font-bold">68%</strong> of users.</p>
        </div>

        {/* Metrics List */}
        <div className="space-y-4">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-600 flex items-center gap-2">
              <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              Current 7-day total
            </span>
            <span className="font-bold text-slate-900 tabular-nums">{weeklySummary.total_kg.toFixed(2)} <span className="font-medium text-[10px] text-slate-500">kg CO₂e</span></span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-600 flex items-center gap-2">
              <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
              Global average
            </span>
            <span className="font-bold text-slate-900 tabular-nums">{globalAverage.toFixed(2)} <span className="font-medium text-[10px] text-slate-500">kg CO₂e</span></span>
          </div>
          <div className="flex justify-between items-center text-xs pt-3 border-t border-slate-100">
            <span className="text-slate-600 flex items-center gap-2">
              <svg className="w-3 h-3 text-[#059669]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              You emit less
            </span>
            <span className="font-bold text-[#059669] tabular-nums">{difference > 0 ? difference.toFixed(2) : '0.00'} <span className="font-medium text-[10px] opacity-80">kg CO₂e</span></span>
          </div>
        </div>
      </div>

      {/* Keep It Up Card */}
      <div className="bg-[#f8fafc] rounded-2xl border border-slate-200 p-6 relative overflow-hidden">
        <h4 className="text-[10px] font-bold text-slate-900 uppercase tracking-wider mb-2">KEEP IT UP!</h4>
        <p className="text-xs text-slate-500 mb-20 max-w-[140px] leading-relaxed relative z-10">
          Consistency is the key to a sustainable future.
        </p>
        
        {/* Decorative graphic (Globe + Windmills) */}
        <div className="absolute -bottom-8 -right-8 w-48 h-48 pointer-events-none" aria-hidden="true">
           {/* Globe */}
           <div className="absolute bottom-4 right-8 text-7xl transform rotate-12 opacity-90">🌍</div>
           {/* Trees */}
           <div className="absolute bottom-16 right-20 text-3xl">🌲</div>
           <div className="absolute bottom-20 right-6 text-2xl">🌳</div>
           {/* Windmills */}
           <div className="absolute bottom-24 right-28 opacity-60">
             <div className="w-0.5 h-8 bg-slate-300 absolute bottom-0 left-2" />
             <div className="text-xl absolute bottom-4 -left-1 transform -rotate-12">⚙️</div>
           </div>
           <div className="absolute bottom-16 right-4 opacity-50 scale-75">
             <div className="w-0.5 h-8 bg-slate-300 absolute bottom-0 left-2" />
             <div className="text-xl absolute bottom-4 -left-1 transform rotate-12">⚙️</div>
           </div>
        </div>

        <div className="flex gap-2 relative z-10">
          <div className="bg-white rounded-xl px-3 py-2 shadow-sm border border-slate-100 flex items-center gap-2">
            <span className="text-sm font-bold text-[#059669]">7</span>
            <span className="text-[10px] font-bold text-slate-500 uppercase">Days Logged</span>
          </div>
          <div className="bg-white rounded-xl px-3 py-2 shadow-sm border border-slate-100 flex items-center gap-2">
            <span className="text-sm font-bold text-slate-900">🔥</span>
            <span className="text-[10px] font-bold text-slate-500 uppercase">Streak</span>
          </div>
        </div>
      </div>

      {/* View All Button */}
      <button className="w-full py-3.5 bg-white rounded-xl border border-slate-200 text-[#059669] font-bold text-xs hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 shadow-sm">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
        View All Insights History
      </button>

    </div>
  );
}
