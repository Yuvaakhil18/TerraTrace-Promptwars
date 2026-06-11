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
    <div className="group relative flex flex-col items-center overflow-hidden rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm transition-all hover:border-[#059669] hover:shadow-md">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-2xl transition-all group-hover:scale-110 group-hover:bg-[#eaf6ec]">
        {icon}
      </div>
      <h4 className="mb-1 text-xs leading-tight font-bold text-slate-900">{insight.title}</h4>
      <p className="mb-4 flex-1 text-[10px] leading-relaxed text-slate-500">
        {insight.description}
      </p>

      <div className="w-full border-t border-slate-100 pt-3">
        <p className="mb-0.5 text-[9px] font-bold tracking-wider text-slate-400 uppercase">
          Potential savings
        </p>
        <p className="text-xs font-bold text-[#059669]">
          {insight.potential_reduction_kg
            ? `${insight.potential_reduction_kg.toFixed(2)} kg CO₂e`
            : 'Varies'}
        </p>
      </div>
    </div>
  );
}
