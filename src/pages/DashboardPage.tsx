import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useActivities } from '../hooks/useActivities';
import { useEmissions } from '../hooks/useEmissions';
import { useAuth } from '../context/AuthContext';
import EmissionsSummary from '../components/Dashboard/EmissionsSummary';
import EmissionsChart from '../components/Dashboard/EmissionsChart';
import FootprintScore from '../components/Dashboard/FootprintScore';
import CategoryBreakdown from '../components/Dashboard/CategoryBreakdown';
import Spinner from '../components/ui/Spinner';

const PERIODS = [
  { label: 'Today',      days: 1  },
  { label: 'This Week',  days: 7  },
  { label: 'This Month', days: 30 },
  { label: 'Last 90 Days', days: 90 },
];

export default function DashboardPage() {
  const { activities, loading, error } = useActivities();
  const { getTodayTotal, getWeeklyTotals, getCategoryBreakdown, getWeeklySummary } = useEmissions(activities);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [selectedPeriod, setSelectedPeriod] = useState(PERIODS[1]);
  const [periodOpen, setPeriodOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const periodRef = useRef<HTMLDivElement>(null);
  const notifRef  = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (periodRef.current && !periodRef.current.contains(e.target as Node)) setPeriodOpen(false);
      if (notifRef.current  && !notifRef.current.contains(e.target as Node))  setNotifOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  if (loading) return (
    <div className="min-h-full flex items-center justify-center">
      <Spinner label="Loading dashboard..." />
    </div>
  );

  if (error) return (
    <div className="min-h-full flex items-center justify-center px-4">
      <p className="text-danger">{error}</p>
    </div>
  );

  const todayTotal    = getTodayTotal();
  const weeklyTotals  = getWeeklyTotals();
  const categoryBreakdown = getCategoryBreakdown(selectedPeriod.days);
  const weeklySummary = getWeeklySummary();
  const dailyAverage  = weeklySummary.total_kg / 7;

  // Build notifications from recent activities
  const recentActivities = [...activities]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);

  const notifications = recentActivities.length > 0
    ? recentActivities.map(act => ({
        icon: act.category === 'transport' ? '🚗' : act.category === 'food' ? '🥗' : act.category === 'energy' ? '⚡' : '🛍️',
        title: `Logged: ${act.subType}`,
        desc: `${act.co2e_kg.toFixed(2)} kg CO₂e · ${act.category}`,
        time: new Date(act.timestamp).toLocaleDateString(),
      }))
    : [{ icon: '📝', title: 'No activities yet', desc: 'Log your first activity to see insights.', time: '' }];

  const userInitial = currentUser?.displayName?.[0]?.toUpperCase()
    ?? currentUser?.email?.[0]?.toUpperCase()
    ?? '?';

  return (
    <div className="max-w-7xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            Welcome back{currentUser?.displayName ? `, ${currentUser.displayName.split(' ')[0]}` : ''}! <span className="text-2xl">🌿</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">Track your personal footprint and work towards a greener lifestyle.</p>
        </div>

        <div className="flex items-center gap-3">

          {/* This Week Dropdown */}
          <div className="relative" ref={periodRef}>
            <button
              onClick={() => { setPeriodOpen(o => !o); setNotifOpen(false); }}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
            >
              <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {selectedPeriod.label}
              <svg className={`w-4 h-4 text-slate-400 transition-transform ${periodOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {periodOpen && (
              <div className="absolute right-0 top-full mt-2 w-44 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden animate-fade-in">
                {PERIODS.map(p => (
                  <button
                    key={p.label}
                    onClick={() => { setSelectedPeriod(p); setPeriodOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                      p.label === selectedPeriod.label
                        ? 'bg-[#eaf6ec] text-[#059669] font-bold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notification Bell */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => { setNotifOpen(o => !o); setPeriodOpen(false); }}
              className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-lg hover:bg-slate-100"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {recentActivities.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#22c55e] rounded-full border-2 border-white" />
              )}
            </button>
            {notifOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden animate-fade-in">
                <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900">Recent Activity</span>
                  <span className="text-[10px] font-bold text-[#059669] bg-[#eaf6ec] px-2 py-0.5 rounded-full">{recentActivities.length} logged</span>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
                  {notifications.map((n, i) => (
                    <div key={i} className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 transition-colors">
                      <div className="w-9 h-9 rounded-full bg-[#f3fbf5] flex items-center justify-center text-lg flex-shrink-0">{n.icon}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">{n.title}</p>
                        <p className="text-[11px] text-slate-500 truncate">{n.desc}</p>
                      </div>
                      {n.time && <span className="text-[10px] text-slate-400 flex-shrink-0">{n.time}</span>}
                    </div>
                  ))}
                </div>
                <div className="px-4 py-3 border-t border-slate-100">
                  <button
                    onClick={() => { navigate('/log'); setNotifOpen(false); }}
                    className="w-full text-center text-xs font-bold text-[#059669] hover:underline"
                  >
                    + Log a new activity
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Profile Avatar */}
          <button
            onClick={() => navigate('/profile')}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-[#059669] to-[#22c55e] flex items-center justify-center text-white font-bold text-sm shadow-sm hover:shadow-md hover:scale-105 transition-all overflow-hidden"
            title="View Profile"
          >
            {currentUser?.photoURL && !avatarError
              ? <img
                  src={currentUser.photoURL}
                  className="w-full h-full object-cover"
                  alt="avatar"
                  onError={() => setAvatarError(true)}
                />
              : <span>{userInitial}</span>}
          </button>

        </div>
      </div>

      {/* Top Row: Summary Cards */}
      <EmissionsSummary todayTotal={todayTotal} weeklyTotal={weeklySummary.total_kg} />

      {/* Middle Row: Score and Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FootprintScore dailyAverage={dailyAverage} />
        <EmissionsChart weeklyData={weeklyTotals} />
      </div>

      {/* Bottom Row: Category Breakdown */}
      <CategoryBreakdown breakdown={categoryBreakdown} />

    </div>
  );
}
