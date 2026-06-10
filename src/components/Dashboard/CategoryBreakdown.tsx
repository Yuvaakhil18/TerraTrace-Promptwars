interface CategoryBreakdownProps {
  breakdown: Record<string, number>;
}

const CATEGORY_ICONS: Record<string, string> = {
  transport: '🚗',
  food: '🍽️',
  energy: '⚡',
  shopping: '🛍️',
  waste: '🗑️'
};

const CATEGORY_COLORS: Record<string, string> = {
  transport: 'bg-blue-500',
  food: 'bg-purple-500',
  energy: 'bg-amber-500',
  shopping: 'bg-rose-500',
  waste: 'bg-emerald-500'
};

const CATEGORY_BG_COLORS: Record<string, string> = {
  transport: 'bg-blue-100 text-blue-700',
  food: 'bg-purple-100 text-purple-700',
  energy: 'bg-amber-100 text-amber-700',
  shopping: 'bg-rose-100 text-rose-700',
  waste: 'bg-emerald-100 text-emerald-700'
};

export default function CategoryBreakdown({ breakdown }: CategoryBreakdownProps) {
  // We want to ensure all main categories are shown, even if 0
  const categories = ['transport', 'food', 'energy', 'waste'];
  
  // breakdown is an object like { transport: 4.22, food: 0, ... }
  const totalEmissions = Object.values(breakdown).reduce((sum, val) => sum + val, 0);

  const displayData = categories.map(catId => {
    const total = breakdown[catId] || 0;
    const percentage = totalEmissions > 0 ? (total / totalEmissions) * 100 : 0;
    
    return {
      id: catId,
      name: catId.charAt(0).toUpperCase() + catId.slice(1),
      icon: CATEGORY_ICONS[catId] || '📌',
      total,
      percentage,
      barColor: CATEGORY_COLORS[catId] || 'bg-slate-500',
      badgeColor: CATEGORY_BG_COLORS[catId] || 'bg-slate-100 text-slate-700'
    };
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row gap-8">
      <div className="flex-1">
        <h3 className="text-sm font-bold text-slate-900 mb-6">Category Breakdown (7 days)</h3>
        
        <div className="space-y-4">
          {displayData.map(item => (
            <div key={item.id} className="flex items-center gap-4">
              <div className="w-6 text-center text-sm" aria-hidden="true">{item.icon}</div>
              <div className="w-24 text-xs font-semibold text-slate-700">{item.name}</div>
              
              <div className="flex-1 relative h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className={`absolute top-0 left-0 h-full rounded-full ${item.barColor}`}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
              
              <div className="w-16 text-right text-xs font-bold text-slate-900 tabular-nums">
                {item.total.toFixed(2)} kg
              </div>
              
              <div className={`w-12 text-center text-[10px] font-bold rounded-full py-0.5 ${item.badgeColor}`}>
                {Math.round(item.percentage)}%
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="md:w-64 flex items-end justify-center relative min-h-[160px]">
        {/* Placeholder for the globe illustration */}
        <div className="w-48 h-48 rounded-full bg-gradient-to-br from-emerald-100 to-teal-50 absolute bottom-[-40px] right-0 flex items-center justify-center opacity-80 overflow-hidden">
           <div className="text-8xl transform rotate-12 opacity-90">🌍</div>
           <div className="absolute top-4 left-4 text-4xl">🌿</div>
           <div className="absolute bottom-8 right-2 text-3xl transform -rotate-45">🍃</div>
        </div>
      </div>
    </div>
  );
}
