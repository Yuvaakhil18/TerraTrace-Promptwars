import type { Insight } from '../../types';

interface InsightCardProps {
  insight: Insight;
}

export default function InsightCard({ insight }: InsightCardProps) {
  // Try to pick an emoji based on the title
  let icon = '💡';
  const t = insight.title.toLowerCase();
  if (t.includes('transport') || t.includes('car') || t.includes('drive')) icon = '🚌';
  else if (t.includes('meat') || t.includes('food') || t.includes('diet')) icon = '🥗';
  else if (t.includes('energy') || t.includes('power') || t.includes('light')) icon = '⚡';
  else if (t.includes('waste') || t.includes('recycle') || t.includes('plastic')) icon = '♻️';

  return (
    <div className="border border-slate-200 rounded-xl p-4 flex flex-col items-center text-center bg-white shadow-sm relative overflow-hidden group hover:border-[#059669] hover:shadow-md transition-all">
      <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-2xl mb-3 group-hover:scale-110 group-hover:bg-[#eaf6ec] transition-all">
        {icon}
      </div>
      <h4 className="text-xs font-bold text-slate-900 mb-1 leading-tight">{insight.title}</h4>
      <p className="text-[10px] text-slate-500 mb-4 flex-1 leading-relaxed">{insight.description}</p>
      
      <div className="w-full pt-3 border-t border-slate-100">
        <p className="text-[9px] text-slate-400 font-bold uppercase mb-0.5 tracking-wider">Potential savings</p>
        <p className="text-xs font-bold text-[#059669]">
          {insight.potential_reduction_kg 
            ? `${insight.potential_reduction_kg.toFixed(2)} kg CO₂e` 
            : 'Varies'}
        </p>
      </div>
    </div>
  );
}
