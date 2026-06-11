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
  { label: 'Today', days: 1 },
  { label: 'This Week', days: 7 },
  { label: 'This Month', days: 30 },
  { label: 'Last 90 Days', days: 90 },
];

export default function DashboardPage() {
  const { activities, loading, error } = useActivities();
  const { getTodayTotal, getWeeklyTotals, getCategoryBreakdown, getWeeklySummary } =
    useEmissions(activities);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [selectedPeriod, setSelectedPeriod] = useState(PERIODS[1]);
  const [periodOpen, setPeriodOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const periodRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (periodRef.current && !periodRef.current.contains(e.target as Node)) setPeriodOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  if (loading)
    return (
      <div className="flex min-h-full items-center justify-center">
        <Spinner label="Loading dashboard..." />
      </div>
    );

  if (error)
    return (
      <div className="flex min-h-full items-center justify-center px-4">
        <p className="text-danger">{error}</p>
      </div>
    );

  const todayTotal = getTodayTotal();
  const weeklyTotals = getWeeklyTotals();
  const categoryBreakdown = getCategoryBreakdown(selectedPeriod.days);
  const weeklySummary = getWeeklySummary();
  const dailyAverage = weeklySummary.total_kg / 7;

  // Build notifications from recent activities
  const recentActivities = [...activities]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);

  const notifications =
    recentActivities.length > 0
      ? recentActivities.map((act) => ({
          icon:
            act.category === 'transport'
              ? '🚗'
              : act.category === 'food'
                ? '🥗'
                : act.category === 'energy'
                  ? '⚡'
                  : '🛍️',
          title: `Logged: ${act.subType}`,
          desc: `${act.co2e_kg.toFixed(2)} kg CO₂e · ${act.category}`,
          time: new Date(act.timestamp).toLocaleDateString(),
        }))
      : [
          {
            icon: '📝',
            title: 'No activities yet',
            desc: 'Log your first activity to see insights.',
            time: '',
          },
        ];

  const userInitial =
    currentUser?.displayName?.[0]?.toUpperCase() ?? currentUser?.email?.[0]?.toUpperCase() ?? '?';

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900">
            Welcome back
            {currentUser?.displayName ? `, ${currentUser.displayName.split(' ')[0]}` : ''}!{' '}
            <span className="text-2xl">🌿</span>
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Track your personal footprint and work towards a greener lifestyle.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* This Week Dropdown */}
          <div className="relative" ref={periodRef}>
            <button
              onClick={() => {
                setPeriodOpen((o) => !o);
                setNotifOpen(false);
              }}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              <svg
                className="h-4 w-4 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {selectedPeriod.label}
              <svg
                className={`h-4 w-4 text-slate-400 transition-transform ${periodOpen ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {periodOpen && (
              <div className="animate-fade-in absolute top-full right-0 z-50 mt-2 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800">
                {PERIODS.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => {
                      setSelectedPeriod(p);
                      setPeriodOpen(false);
                    }}
                    className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                      p.label === selectedPeriod.label
                        ? 'bg-[#eaf6ec] font-bold text-[#059669] dark:bg-[#059669]/20 dark:text-[#34d399]'
                        : 'text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700'
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
              onClick={() => {
                setNotifOpen((o) => !o);
                setPeriodOpen(false);
              }}
              className="relative rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              {recentActivities.length > 0 && (
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full border-2 border-white bg-[#22c55e]" />
              )}
            </button>
            {notifOpen && (
              <div className="animate-fade-in absolute top-full right-0 z-50 mt-2 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-800">
                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-700">
                  <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Recent Activity
                  </span>
                  <span className="rounded-full bg-[#eaf6ec] px-2 py-0.5 text-[10px] font-bold text-[#059669] dark:bg-[#059669]/20">
                    {recentActivities.length} logged
                  </span>
                </div>
                <div className="max-h-72 divide-y divide-slate-50 overflow-y-auto dark:divide-slate-700/50">
                  {notifications.map((n, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-700"
                    >
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#f3fbf5] text-lg dark:bg-slate-700">
                        {n.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-bold text-slate-900 dark:text-slate-100">
                          {n.title}
                        </p>
                        <p className="truncate text-[11px] text-slate-500 dark:text-slate-400">
                          {n.desc}
                        </p>
                      </div>
                      {n.time && (
                        <span className="flex-shrink-0 text-[10px] text-slate-400">{n.time}</span>
                      )}
                    </div>
                  ))}
                  {recentActivities.length === 0 && (
                    <p className="py-6 text-center text-sm text-slate-500 dark:text-slate-400">
                      Log your first activity to see it here.
                    </p>
                  )}
                </div>
                {recentActivities.length > 0 && (
                  <div className="border-t border-slate-100 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/50">
                    <button
                      className="w-full text-center text-xs font-bold text-[#059669] transition-colors hover:text-[#047857]"
                      onClick={() => navigate('/log')}
                    >
                      View All History →
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Profile Avatar */}
          <button
            onClick={() => navigate('/profile')}
            className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#059669] to-[#22c55e] text-sm font-bold text-white shadow-sm transition-all hover:scale-105 hover:shadow-md"
            title="View Profile"
          >
            {currentUser?.photoURL && !avatarError ? (
              <img
                src={currentUser.photoURL}
                className="h-full w-full object-cover"
                alt="avatar"
                onError={() => setAvatarError(true)}
              />
            ) : (
              <span>{userInitial}</span>
            )}
          </button>
        </div>
      </div>

      {/* Top Row: Summary Cards */}
      <EmissionsSummary todayTotal={todayTotal} weeklyTotal={weeklySummary.total_kg} />

      {/* Middle Row: Score and Trend */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <FootprintScore dailyAverage={dailyAverage} />
        <EmissionsChart weeklyData={weeklyTotals} />
      </div>

      {/* Bottom Row: Category Breakdown */}
      <CategoryBreakdown breakdown={categoryBreakdown} />
    </div>
  );
}
