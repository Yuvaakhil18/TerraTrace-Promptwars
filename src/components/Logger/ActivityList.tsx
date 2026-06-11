import type { Activity } from '../../types';

interface ActivityListProps {
  activities: Activity[];
  onDelete: (id: string) => void | Promise<void>;
}

export default function ActivityList({ activities, onDelete }: ActivityListProps) {
  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 bg-white p-6">
        <div className="flex items-center gap-2">
          <svg
            className="h-5 w-5 text-[#059669]"
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
          <h2 className="text-base font-bold text-slate-900">Recent Activities</h2>
        </div>
        <div className="rounded-full bg-[#eaf6ec] px-3 py-1 text-xs font-bold text-[#059669]">
          {activities.length} logged
        </div>
      </div>

      {/* List Content */}
      <div
        className="flex-1 overflow-y-auto p-6"
        style={{ backgroundColor: 'var(--bg-background)' }}
      >
        {activities.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center py-12 text-center">
            <div className="relative mb-6 h-32 w-32">
              {/* Decorative Circle */}
              <div className="absolute inset-0 scale-110 rounded-full bg-[#eaf6ec] opacity-60" />
              {/* Clipboard Icon */}
              <div className="relative z-10 flex h-full w-full items-center justify-center">
                <svg
                  className="h-16 w-16 text-[#059669]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
                {/* Small leaf badge */}
                <div className="absolute right-6 bottom-6 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm">
                  <span className="text-sm text-[#059669]">🌿</span>
                </div>
              </div>

              {/* Dotted arrow SVG approximation */}
              <svg
                className="absolute -right-16 -bottom-8 h-24 w-24 -rotate-12 transform text-slate-300"
                fill="none"
                viewBox="0 0 100 100"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  d="M10,80 Q50,90 80,40 M70,40 l10,-5 l5,10"
                />
              </svg>
            </div>
            <h3 className="mb-1 text-base font-bold text-slate-900">No more activities yet</h3>
            <p className="max-w-[200px] text-sm leading-relaxed text-slate-500">
              Start logging your daily activities to see your impact here.
            </p>
          </div>
        ) : (
          <ul className="space-y-4">
            {activities.map((activity) => {
              const d = new Date(activity.timestamp);
              const dateStr = d.toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              });
              const timeStr = d
                .toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
                .toLowerCase();

              let catColor = 'text-slate-500';
              let catBg = 'bg-slate-100';
              if (activity.category === 'transport') {
                catColor = 'text-[#059669]';
                catBg = 'bg-[#eaf6ec]';
              }
              if (activity.category === 'food') {
                catColor = 'text-purple-600';
                catBg = 'bg-purple-100';
              }
              if (activity.category === 'energy') {
                catColor = 'text-amber-600';
                catBg = 'bg-amber-100';
              }
              if (activity.category === 'shopping') {
                catColor = 'text-blue-600';
                catBg = 'bg-blue-100';
              }

              return (
                <li
                  key={activity.id}
                  className="group flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-slate-300 hover:shadow-md"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ${catBg} ${catColor}`}
                    >
                      {activity.category === 'transport' && <span className="text-xl">🚗</span>}
                      {activity.category === 'food' && <span className="text-xl">🍽️</span>}
                      {activity.category === 'energy' && <span className="text-xl">⚡</span>}
                      {activity.category === 'shopping' && <span className="text-xl">🛍️</span>}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{activity.subType}</h4>
                      <p className="mb-2 text-xs text-slate-500">
                        {activity.quantity} {activity.unit}
                      </p>
                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase ${catBg} ${catColor}`}
                        >
                          {activity.category}
                        </span>
                        <span className="text-[10px] font-medium text-slate-400">
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
                      <p className="text-[10px] font-bold text-slate-400">CO₂e</p>
                    </div>

                    <button
                      onClick={() => onDelete(activity.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-500"
                      aria-label="Delete activity"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
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
      <div className="border-t border-slate-100 bg-white p-4">
        <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-sm font-bold text-[#059669] transition-colors hover:bg-slate-50">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 10h16M4 14h16M4 18h16"
            />
          </svg>
          View All Logs
        </button>
      </div>
    </div>
  );
}
