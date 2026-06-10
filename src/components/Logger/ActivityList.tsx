import type { Activity } from '../../types';

interface ActivityListProps {
  activities: Activity[];
  onDelete: (id: string) => void | Promise<void>;
}

export default function ActivityList({ activities, onDelete }: ActivityListProps) {
  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
      
      {/* Header */}
      <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-[#059669]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-base font-bold text-slate-900">Recent Activities</h2>
        </div>
        <div className="bg-[#eaf6ec] text-[#059669] px-3 py-1 rounded-full text-xs font-bold">
          {activities.length} logged
        </div>
      </div>

      {/* List Content */}
      <div className="flex-1 overflow-y-auto p-6" style={{ backgroundColor: 'var(--bg-background)' }}>
        {activities.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center py-12">
            <div className="relative w-32 h-32 mb-6">
              {/* Decorative Circle */}
              <div className="absolute inset-0 bg-[#eaf6ec] rounded-full scale-110 opacity-60" />
              {/* Clipboard Icon */}
              <div className="relative z-10 w-full h-full flex items-center justify-center">
                <svg className="w-16 h-16 text-[#059669]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                {/* Small leaf badge */}
                <div className="absolute bottom-6 right-6 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-[#059669] text-sm">🌿</span>
                </div>
              </div>
              
              {/* Dotted arrow SVG approximation */}
              <svg className="absolute -bottom-8 -right-16 w-24 h-24 text-slate-300 transform -rotate-12" fill="none" viewBox="0 0 100 100" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} strokeDasharray="4 4" d="M10,80 Q50,90 80,40 M70,40 l10,-5 l5,10" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">No more activities yet</h3>
            <p className="text-sm text-slate-500 max-w-[200px] leading-relaxed">
              Start logging your daily activities to see your impact here.
            </p>
          </div>
        ) : (
          <ul className="space-y-4">
            {activities.map((activity) => {
              const d = new Date(activity.timestamp);
              const dateStr = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
              const timeStr = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase();
              
              let catColor = 'text-slate-500';
              let catBg = 'bg-slate-100';
              if (activity.category === 'transport') { catColor = 'text-[#059669]'; catBg = 'bg-[#eaf6ec]'; }
              if (activity.category === 'food') { catColor = 'text-purple-600'; catBg = 'bg-purple-100'; }
              if (activity.category === 'energy') { catColor = 'text-amber-600'; catBg = 'bg-amber-100'; }
              if (activity.category === 'shopping') { catColor = 'text-blue-600'; catBg = 'bg-blue-100'; }

              return (
                <li key={activity.id} className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between gap-4 transition-all hover:shadow-md hover:border-slate-300 group">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${catBg} ${catColor}`}>
                      {activity.category === 'transport' && <span className="text-xl">🚗</span>}
                      {activity.category === 'food' && <span className="text-xl">🍽️</span>}
                      {activity.category === 'energy' && <span className="text-xl">⚡</span>}
                      {activity.category === 'shopping' && <span className="text-xl">🛍️</span>}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{activity.subType}</h4>
                      <p className="text-xs text-slate-500 mb-2">{activity.quantity} {activity.unit}</p>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${catBg} ${catColor}`}>
                          {activity.category}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {dateStr} • {timeStr}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm font-black text-slate-900 tabular-nums">
                        {activity.co2e_kg.toFixed(3)} kg
                      </p>
                      <p className="text-[10px] text-slate-400 font-bold">CO₂e</p>
                    </div>
                    
                    <button
                      onClick={() => onDelete(activity.id)}
                      className="w-8 h-8 rounded-lg bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-rose-50 hover:text-rose-500 transition-colors"
                      aria-label="Delete activity"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-100 bg-white">
        <button className="w-full py-3 rounded-xl border border-slate-200 text-[#059669] font-bold text-sm hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          View All Logs
        </button>
      </div>

    </div>
  );
}
