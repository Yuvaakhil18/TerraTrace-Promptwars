import { useState, useMemo } from 'react';
import type { ReactNode } from 'react';
import { updateProfile } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { useActivities } from '../hooks/useActivities';
import { useEmissions } from '../hooks/useEmissions';

type SettingsTab = 'personal' | 'notifications' | 'privacy' | 'connected';

export default function ProfilePage() {
  const { currentUser } = useAuth();
  const { activities } = useActivities();
  const { getWeeklySummary } = useEmissions(activities);
  const [activeTab, setActiveTab] = useState<SettingsTab>('personal');
  const [imgError, setImgError] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [location, setLocation] = useState(() => localStorage.getItem('tt_location') ?? 'Not set');
  const [editName, setEditName] = useState('');
  const [editLocation, setEditLocation] = useState('');

  const weeklySummary = getWeeklySummary();
  const monthlyCO2 = useMemo(() => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 30);
    return activities
      .filter(a => new Date(a.timestamp) >= cutoff)
      .reduce((s, a) => s + a.co2e_kg, 0);
  }, [activities]);

  const totalSaved = useMemo(() => {
    const globalAvg = 11; // kg/week global average
    const diff = globalAvg - weeklySummary.total_kg;
    return Math.max(0, diff);
  }, [weeklySummary.total_kg]);

  const sevenDayAvg = weeklySummary.total_kg / 7;

  // Carbon score 0–100 based on how well they compare to global avg
  const globalAvgPerDay = 11 / 7;
  const rawScore = Math.max(0, Math.min(100, Math.round(100 - (sevenDayAvg / globalAvgPerDay) * 50)));

  const joinedDate = currentUser?.metadata?.creationTime
    ? new Date(currentUser.metadata.creationTime).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'May 2024';

  const displayName = currentUser?.displayName ?? currentUser?.email?.split('@')[0] ?? 'Eco User';
  const email = currentUser?.email ?? 'user@example.com';
  const userInitial = displayName[0]?.toUpperCase() ?? '?';

  function openEdit() {
    setEditName(displayName);
    setEditLocation(location === 'Not set' ? '' : location);
    setSaveSuccess(false);
    setEditOpen(true);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const user = auth.currentUser;
      if (user && editName.trim()) {
        await updateProfile(user, { displayName: editName.trim() });
      }
      const loc = editLocation.trim() || 'Not set';
      localStorage.setItem('tt_location', loc);
      setLocation(loc);
      setSaveSuccess(true);
      setTimeout(() => { setEditOpen(false); setSaveSuccess(false); }, 1200);
    } catch (err) {
      console.error('Update failed:', err);
    } finally {
      setSaving(false);
    }
  }

  // Achievements logic
  const completedChallenges = 0; // would come from challenges hook
  const achievements = [
    {
      icon: '🛡️',
      bg: 'bg-[#eaf6ec] dark:bg-[#059669]/20',
      iconBg: 'bg-[#059669]',
      label: 'First Step',
      desc: 'Log your first activity',
      unlocked: activities.length >= 1,
      color: 'from-[#059669] to-[#22c55e]',
    },
    {
      icon: '🌳',
      bg: 'bg-[#f0fdf4] dark:bg-[#16a34a]/20',
      iconBg: 'bg-[#16a34a]',
      label: 'Plant Protector',
      desc: 'Save 5 kg CO₂e',
      unlocked: totalSaved >= 5,
      color: 'from-[#16a34a] to-[#4ade80]',
    },
    {
      icon: '⚡',
      bg: 'bg-blue-50 dark:bg-blue-500/20',
      iconBg: 'bg-blue-500',
      label: 'Energy Saver',
      desc: 'Save 10 kWh',
      unlocked: activities.filter(a => a.category === 'energy').length >= 3,
      color: 'from-blue-500 to-blue-400',
    },
    {
      icon: '🎯',
      bg: 'bg-purple-50 dark:bg-purple-500/20',
      iconBg: 'bg-purple-500',
      label: 'Consistent',
      desc: 'Log 7 days in a row',
      unlocked: activities.length >= 7,
      color: 'from-purple-500 to-purple-400',
    },
  ];

  // Settings tabs
  const TABS: { id: SettingsTab; label: string; icon: ReactNode }[] = [
    {
      id: 'personal', label: 'Personal Information',
      icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
    },
    {
      id: 'notifications', label: 'Notifications',
      icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
    },
    {
      id: 'privacy', label: 'Privacy & Security',
      icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
    },
    {
      id: 'connected', label: 'Connected Accounts',
      icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
    },
  ];

  // SVG gauge math
  const radius = 54;
  const circumference = 2 * Math.PI * radius;

  return (
    <>
    <div className="max-w-7xl mx-auto space-y-6 pb-10">

      {/* ── Page Header ─────────────────────────── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#eaf6ec] flex items-center justify-center">
            <svg className="w-5 h-5 text-[#059669]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">Your Profile <span>🍃</span></h1>
            <p className="text-sm text-slate-500">Manage your account and track your sustainability journey.</p>
          </div>
        </div>
        <button onClick={openEdit} className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors shadow-sm">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          Edit Profile
        </button>
      </div>

      {/* ── Row 1: Profile Info + Impact ─────────── */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 flex flex-col md:flex-row gap-6">

        {/* Avatar + User Info */}
        <div className="flex items-center gap-5 flex-1">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#059669] to-[#22c55e] flex items-center justify-center text-white text-4xl font-bold shadow-md flex-shrink-0 overflow-hidden border-4 border-[#eaf6ec]">
            {currentUser?.photoURL && !imgError
              ? <img
                  src={currentUser.photoURL}
                  className="w-full h-full object-cover"
                  alt="avatar"
                  onError={() => setImgError(true)}
                />
              : <span>{userInitial}</span>}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-bold text-slate-900">{displayName}</h2>
              <span className="bg-[#eaf6ec] text-[#059669] text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                🌿 Eco Explorer
              </span>
            </div>
            <div className="space-y-1.5 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                {email}
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                Member since {joinedDate}
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                {location}
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="hidden md:block w-px bg-slate-100" />

        {/* Impact Stats */}
        <div className="flex-1">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
            Your Impact So Far
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </p>
          <div className="grid grid-cols-3 gap-4">
            {/* Total Saved */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#eaf6ec] dark:bg-[#059669]/20 flex items-center justify-center text-xl flex-shrink-0">🌿</div>
              <div>
                <p className="text-lg font-black text-slate-900 dark:text-slate-100">{totalSaved.toFixed(1)}</p>
                <p className="text-[10px] text-slate-500 font-semibold leading-tight">kg CO₂e<br/>Total Saved</p>
              </div>
            </div>
            {/* Activities */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
              </div>
              <div>
                <p className="text-lg font-black text-slate-900 dark:text-slate-100">{activities.length}</p>
                <p className="text-[10px] text-slate-500 font-semibold leading-tight">Activities<br/>Logged</p>
              </div>
            </div>
            {/* Challenges */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              </div>
              <div>
                <p className="text-lg font-black text-slate-900 dark:text-slate-100">{completedChallenges}</p>
                <p className="text-[10px] text-slate-500 font-semibold leading-tight">Challenges<br/>Completed</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Row 2: Sustainability Overview + Achievements ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* Sustainability Overview */}
        <div className="lg:col-span-3 bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
          <h3 className="text-sm font-bold text-slate-900 mb-6">Your Sustainability Overview</h3>
          <div className="flex items-center gap-8">

            {/* Circular Gauge */}
            <div className="flex flex-col items-center flex-shrink-0">
              <div className="relative w-36 h-36">
                <svg className="w-full h-full" viewBox="0 0 140 140">
                  {/* Background arc */}
                  <circle cx="70" cy="70" r={radius} fill="none" stroke="#f1f5f9" strokeWidth="10"
                    strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`}
                    strokeDashoffset={circumference * 0.125}
                    strokeLinecap="round"
                    transform="rotate(135 70 70)"
                  />
                  {/* Score arc */}
                  <circle cx="70" cy="70" r={radius} fill="none" stroke="url(#scoreGrad)" strokeWidth="10"
                    strokeDasharray={`${circumference * 0.75 * rawScore / 100} ${circumference - circumference * 0.75 * rawScore / 100}`}
                    strokeDashoffset={circumference * 0.125}
                    strokeLinecap="round"
                    transform="rotate(135 70 70)"
                    className="transition-all duration-1000 ease-out"
                  />
                  <defs>
                    <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#059669" />
                      <stop offset="100%" stopColor="#22c55e" />
                    </linearGradient>
                  </defs>
                  {/* Center text */}
                  <text x="70" y="65" textAnchor="middle" className="text-3xl font-black" fontSize="28" fontWeight="900" fill="#0f172a">{rawScore}</text>
                  <text x="70" y="82" textAnchor="middle" fontSize="11" fill="#94a3b8">/100</text>
                </svg>
              </div>
              <p className="text-xs font-bold text-slate-700 mt-1 flex items-center gap-1">
                Carbon Score
                <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </p>
              <span className="mt-1.5 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#eaf6ec] text-[#059669]">
                {rawScore >= 80 ? 'Excellent' : rawScore >= 60 ? 'Good Progress' : rawScore >= 40 ? 'Keep Going' : 'Getting Started'}
              </span>
            </div>

            {/* Stats List */}
            <div className="flex-1 space-y-4">
              {/* This Month */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#eaf6ec] flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-[#059669]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                </div>
                <div className="flex-1">
                  <p className="text-[10px] text-slate-400 font-medium">This Month</p>
                  <p className="text-base font-black text-slate-900">{monthlyCO2.toFixed(2)} <span className="text-xs font-semibold text-slate-500">kg CO₂e</span></p>
                  <p className="text-[10px] text-[#059669] font-bold">↓ vs last month</p>
                </div>
              </div>
              {/* 7-Day Average */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                </div>
                <div className="flex-1">
                  <p className="text-[10px] text-slate-400 font-medium">7-Day Average</p>
                  <p className="text-base font-black text-slate-900">{sevenDayAvg.toFixed(2)} <span className="text-xs font-semibold text-slate-500">kg CO₂e / day</span></p>
                  <p className="text-[10px] text-[#059669] font-bold">↓ vs last week</p>
                </div>
              </div>
              {/* Global Rank */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" /></svg>
                </div>
                <div className="flex-1">
                  <p className="text-[10px] text-slate-400 font-medium">Global Rank</p>
                  <p className="text-base font-black text-slate-900">Top {Math.max(5, 100 - rawScore)}%</p>
                  <p className="text-[10px] text-[#059669] font-bold">Keep it up! 🌿</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-slate-900">Achievements</h3>
            <button className="text-xs font-bold text-[#059669] hover:underline flex items-center gap-1">
              View All
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {achievements.map((a) => (
              <div key={a.label} className={`flex flex-col items-center text-center p-3 rounded-xl ${a.bg} transition-all ${a.unlocked ? '' : 'opacity-40 grayscale'}`}>
                <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${a.color} flex items-center justify-center text-2xl mb-2 shadow-sm`}>
                  {a.icon}
                </div>
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{a.label}</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">{a.desc}</p>
                {a.unlocked && <span className="mt-1.5 text-[9px] bg-white dark:bg-black/20 text-[#059669] dark:text-[#34d399] font-bold px-1.5 py-0.5 rounded-full">✓ Unlocked</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Row 3: Account Settings ─────────────── */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900">Account Settings</h3>
        </div>
        <div className="flex flex-col md:flex-row">

          {/* Left Sidebar Tabs */}
          <div className="md:w-56 border-b md:border-b-0 md:border-r border-slate-100 p-4 flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-visible">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-left whitespace-nowrap transition-all w-full ${
                  activeTab === tab.id
                    ? 'bg-[#eaf6ec] text-[#059669]'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Right Content */}
          <div className="flex-1 p-6">
            {activeTab === 'personal' && (
              <div className="space-y-1 divide-y divide-slate-50">
                {[
                  { label: 'Full Name',     value: displayName },
                  { label: 'Email Address', value: email },
                  { label: 'Location',      value: location },
                  { label: 'Member Since',  value: joinedDate },
                ].map(field => (
                  <div key={field.label} className="flex items-center justify-between py-3 group">
                    <div>
                      <p className="text-xs text-slate-400 font-medium">{field.label}</p>
                      <p className="text-sm font-semibold text-slate-900">{field.value}</p>
                    </div>
                    <svg className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'notifications' && (
              <div className="space-y-4">
                {[
                  { label: 'Activity Reminders', desc: 'Daily reminder to log your activities', on: true },
                  { label: 'Weekly Summary', desc: 'Get a weekly summary of your footprint', on: true },
                  { label: 'Challenge Alerts', desc: 'Be notified when new challenges are available', on: false },
                  { label: 'AI Insights', desc: 'Receive personalised tips from EcoCoach', on: true },
                ].map(n => (
                  <div key={n.label} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{n.label}</p>
                      <p className="text-xs text-slate-500">{n.desc}</p>
                    </div>
                    <div className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${n.on ? 'bg-[#059669]' : 'bg-slate-200'}`}>
                      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${n.on ? 'right-0.5' : 'left-0.5'}`} />
                    </div>
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'privacy' && (
              <div className="space-y-3">
                {[
                  { label: 'Change Password', desc: 'Update your account password' },
                  { label: 'Two-Factor Authentication', desc: 'Add an extra layer of security' },
                  { label: 'Download My Data', desc: 'Export all your emission records' },
                  { label: 'Delete Account', desc: 'Permanently remove your account', danger: true },
                ].map(item => (
                  <div key={item.label} className={`flex items-center justify-between p-3 rounded-xl border ${item.danger ? 'border-rose-100 hover:bg-rose-50' : 'border-slate-100 hover:bg-slate-50'} transition-colors cursor-pointer group`}>
                    <div>
                      <p className={`text-sm font-semibold ${item.danger ? 'text-rose-600' : 'text-slate-900'}`}>{item.label}</p>
                      <p className="text-xs text-slate-500">{item.desc}</p>
                    </div>
                    <svg className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'connected' && (
              <div className="space-y-3">
                {[
                  { icon: '🔵', label: 'Google', desc: currentUser?.providerData?.find(p => p.providerId === 'google.com') ? 'Connected' : 'Not connected', connected: !!currentUser?.providerData?.find(p => p.providerId === 'google.com') },
                  { icon: '📘', label: 'Facebook', desc: 'Not connected', connected: false },
                  { icon: '🍎', label: 'Apple', desc: 'Not connected', connected: false },
                ].map(acc => (
                  <div key={acc.label} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{acc.icon}</span>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{acc.label}</p>
                        <p className="text-xs text-slate-500">{acc.desc}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${acc.connected ? 'bg-[#eaf6ec] text-[#059669]' : 'bg-slate-100 text-slate-400'}`}>
                      {acc.connected ? '✓ Connected' : 'Connect'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

    </div>

      {/* ── Edit Profile Modal ─────────────────── */}
      {editOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setEditOpen(false)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-fade-in"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <svg className="w-5 h-5 text-[#059669]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Edit Profile
              </h2>
              <button onClick={() => setEditOpen(false)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Avatar Preview */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#059669] to-[#22c55e] flex items-center justify-center text-white text-3xl font-bold shadow-md border-4 border-[#eaf6ec] overflow-hidden">
                {currentUser?.photoURL && !imgError
                  ? <img src={currentUser.photoURL} className="w-full h-full object-cover" alt="avatar" onError={() => setImgError(true)} />
                  : <span>{editName[0]?.toUpperCase() || userInitial}</span>}
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  placeholder="Your display name"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#059669]/30 focus:border-[#059669] transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50 text-sm text-slate-400 cursor-not-allowed"
                />
                <p className="text-[10px] text-slate-400 mt-1">Email cannot be changed here.</p>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Location</label>
                <input
                  type="text"
                  value={editLocation}
                  onChange={e => setEditLocation(e.target.value)}
                  placeholder="e.g. Mumbai, India"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#059669]/30 focus:border-[#059669] transition-all"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setEditOpen(false)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !editName.trim()}
                className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#059669] to-[#22c55e] text-white text-sm font-bold shadow-sm hover:shadow-md transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg> Saving…</>
                ) : saveSuccess ? (
                  <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Saved!</>
                ) : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
