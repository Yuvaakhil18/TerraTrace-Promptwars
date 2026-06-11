import { useState, useMemo } from 'react';

import { updateProfile } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { useActivities } from '../hooks/useActivities';
import { useEmissions } from '../hooks/useEmissions';
import EditProfileModal from '../components/Profile/EditProfileModal';
import AccountSettings, { type SettingsTab } from '../components/Profile/AccountSettings';

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
      .filter((a) => new Date(a.timestamp) >= cutoff)
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
  const rawScore = Math.max(
    0,
    Math.min(100, Math.round(100 - (sevenDayAvg / globalAvgPerDay) * 50)),
  );

  const joinedDate = currentUser?.metadata?.creationTime
    ? new Date(currentUser.metadata.creationTime).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      })
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
      setTimeout(() => {
        setEditOpen(false);
        setSaveSuccess(false);
      }, 1200);
    } catch (_err) {
      // Error is silently handled — user can retry via the modal
    } finally {
      setSaving(false);
    }
  }

  // Achievements logic
  const completedChallenges = 0; // would come from challenges hook
  const achievements = [
    {
      icon: '🛡️',
      bg: 'bg-[#eaf6ec]',
      iconBg: 'bg-[#059669]',
      label: 'First Step',
      desc: 'Log your first activity',
      unlocked: activities.length >= 1,
      color: 'from-[#059669] to-[#22c55e]',
    },
    {
      icon: '🌳',
      bg: 'bg-[#f0fdf4]',
      iconBg: 'bg-[#16a34a]',
      label: 'Plant Protector',
      desc: 'Save 5 kg CO₂e',
      unlocked: totalSaved >= 5,
      color: 'from-[#16a34a] to-[#4ade80]',
    },
    {
      icon: '⚡',
      bg: 'bg-blue-50',
      iconBg: 'bg-blue-500',
      label: 'Energy Saver',
      desc: 'Save 10 kWh',
      unlocked: activities.filter((a) => a.category === 'energy').length >= 3,
      color: 'from-blue-500 to-blue-400',
    },
    {
      icon: '🎯',
      bg: 'bg-purple-50',
      iconBg: 'bg-purple-500',
      label: 'Consistent',
      desc: 'Log 7 days in a row',
      unlocked: activities.length >= 7,
      color: 'from-purple-500 to-purple-400',
    },
  ];

  // SVG gauge math
  const radius = 54;
  const circumference = 2 * Math.PI * radius;

  return (
    <>
      <div className="mx-auto max-w-7xl space-y-6 pb-10">
        {/* ── Page Header ─────────────────────────── */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eaf6ec]">
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
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <div>
              <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900">
                Your Profile <span>🍃</span>
              </h1>
              <p className="text-sm text-slate-500">
                Manage your account and track your sustainability journey.
              </p>
            </div>
          </div>
          <button
            onClick={openEdit}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
            Edit Profile
          </button>
        </div>

        {/* ── Row 1: Profile Info + Impact ─────────── */}
        <div className="flex flex-col gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row">
          {/* Avatar + User Info */}
          <div className="flex flex-1 items-center gap-5">
            <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-[#eaf6ec] bg-gradient-to-br from-[#059669] to-[#22c55e] text-4xl font-bold text-white shadow-md">
              {currentUser?.photoURL && !imgError ? (
                <img
                  src={currentUser.photoURL}
                  className="h-full w-full object-cover"
                  alt="avatar"
                  onError={() => setImgError(true)}
                />
              ) : (
                <span>{userInitial}</span>
              )}
            </div>
            <div>
              <div className="mb-1 flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900">{displayName}</h2>
                <span className="flex items-center gap-1 rounded-full bg-[#eaf6ec] px-2.5 py-0.5 text-[10px] font-bold text-[#059669]">
                  🌿 Eco Explorer
                </span>
              </div>
              <div className="space-y-1.5 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  {email}
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="h-3.5 w-3.5"
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
                  Member since {joinedDate}
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {location}
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden w-px bg-slate-100 md:block" />

          {/* Impact Stats */}
          <div className="flex-1">
            <p className="mb-4 flex items-center gap-2 text-xs font-bold tracking-wider text-slate-500 uppercase">
              Your Impact So Far
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </p>
            <div className="grid grid-cols-3 gap-4">
              {/* Total Saved */}
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#eaf6ec] text-xl">
                  🌿
                </div>
                <div>
                  <p className="text-lg font-black text-slate-900">{totalSaved.toFixed(1)}</p>
                  <p className="text-[10px] leading-tight font-semibold text-slate-500">
                    kg CO₂e
                    <br />
                    Total Saved
                  </p>
                </div>
              </div>
              {/* Activities */}
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-50">
                  <svg
                    className="h-5 w-5 text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-lg font-black text-slate-900">{activities.length}</p>
                  <p className="text-[10px] leading-tight font-semibold text-slate-500">
                    Activities
                    <br />
                    Logged
                  </p>
                </div>
              </div>
              {/* Challenges */}
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-purple-50">
                  <svg className="h-5 w-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <div>
                  <p className="text-lg font-black text-slate-900">{completedChallenges}</p>
                  <p className="text-[10px] leading-tight font-semibold text-slate-500">
                    Challenges
                    <br />
                    Completed
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Row 2: Sustainability Overview + Achievements ── */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          {/* Sustainability Overview */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-3">
            <h3 className="mb-6 text-sm font-bold text-slate-900">Your Sustainability Overview</h3>
            <div className="flex items-center gap-8">
              {/* Circular Gauge */}
              <div className="flex flex-shrink-0 flex-col items-center">
                <div className="relative h-36 w-36">
                  <svg className="h-full w-full" viewBox="0 0 140 140">
                    {/* Background arc */}
                    <circle
                      cx="70"
                      cy="70"
                      r={radius}
                      fill="none"
                      stroke="#f1f5f9"
                      strokeWidth="10"
                      strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`}
                      strokeDashoffset={circumference * 0.125}
                      strokeLinecap="round"
                      transform="rotate(135 70 70)"
                    />
                    {/* Score arc */}
                    <circle
                      cx="70"
                      cy="70"
                      r={radius}
                      fill="none"
                      stroke="url(#scoreGrad)"
                      strokeWidth="10"
                      strokeDasharray={`${(circumference * 0.75 * rawScore) / 100} ${circumference - (circumference * 0.75 * rawScore) / 100}`}
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
                    <text
                      x="70"
                      y="65"
                      textAnchor="middle"
                      className="text-3xl font-black"
                      fontSize="28"
                      fontWeight="900"
                      fill="#0f172a"
                    >
                      {rawScore}
                    </text>
                    <text x="70" y="82" textAnchor="middle" fontSize="11" fill="#94a3b8">
                      /100
                    </text>
                  </svg>
                </div>
                <p className="mt-1 flex items-center gap-1 text-xs font-bold text-slate-700">
                  Carbon Score
                  <svg
                    className="h-3 w-3 text-slate-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </p>
                <span className="mt-1.5 rounded-full bg-[#eaf6ec] px-2.5 py-0.5 text-[10px] font-bold text-[#059669]">
                  {rawScore >= 80
                    ? 'Excellent'
                    : rawScore >= 60
                      ? 'Good Progress'
                      : rawScore >= 40
                        ? 'Keep Going'
                        : 'Getting Started'}
                </span>
              </div>

              {/* Stats List */}
              <div className="flex-1 space-y-4">
                {/* This Month */}
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[#eaf6ec]">
                    <svg
                      className="h-4 w-4 text-[#059669]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-medium text-slate-400">This Month</p>
                    <p className="text-base font-black text-slate-900">
                      {monthlyCO2.toFixed(2)}{' '}
                      <span className="text-xs font-semibold text-slate-500">kg CO₂e</span>
                    </p>
                    <p className="text-[10px] font-bold text-[#059669]">↓ vs last month</p>
                  </div>
                </div>
                {/* 7-Day Average */}
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-blue-50">
                    <svg
                      className="h-4 w-4 text-blue-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-medium text-slate-400">7-Day Average</p>
                    <p className="text-base font-black text-slate-900">
                      {sevenDayAvg.toFixed(2)}{' '}
                      <span className="text-xs font-semibold text-slate-500">kg CO₂e / day</span>
                    </p>
                    <p className="text-[10px] font-bold text-[#059669]">↓ vs last week</p>
                  </div>
                </div>
                {/* Global Rank */}
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-purple-50">
                    <svg
                      className="h-4 w-4 text-purple-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-medium text-slate-400">Global Rank</p>
                    <p className="text-base font-black text-slate-900">
                      Top {Math.max(5, 100 - rawScore)}%
                    </p>
                    <p className="text-[10px] font-bold text-[#059669]">Keep it up! 🌿</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Achievements</h3>
              <button className="flex items-center gap-1 text-xs font-bold text-[#059669] hover:underline">
                View All
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {achievements.map((a) => (
                <div
                  key={a.label}
                  className={`flex flex-col items-center rounded-xl p-3 text-center ${a.bg} transition-all ${a.unlocked ? '' : 'opacity-40 grayscale'}`}
                >
                  <div
                    className={`h-14 w-14 rounded-full bg-gradient-to-br ${a.color} mb-2 flex items-center justify-center text-2xl shadow-sm`}
                  >
                    {a.icon}
                  </div>
                  <p className="text-xs font-bold text-slate-900">{a.label}</p>
                  <p className="mt-0.5 text-[10px] leading-tight text-slate-500">{a.desc}</p>
                  {a.unlocked && (
                    <span className="mt-1.5 rounded-full bg-white px-1.5 py-0.5 text-[9px] font-bold text-[#059669]">
                      ✓ Unlocked
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Row 3: Account Settings ─────────────── */}
        <AccountSettings
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          displayName={displayName}
          email={email}
          location={location}
          joinedDate={joinedDate}
          currentUser={currentUser}
        />
      </div>

      <EditProfileModal
        editOpen={editOpen}
        setEditOpen={setEditOpen}
        currentUser={currentUser}
        imgError={imgError}
        setImgError={setImgError}
        userInitial={userInitial}
        editName={editName}
        setEditName={setEditName}
        email={email}
        editLocation={editLocation}
        setEditLocation={setEditLocation}
        handleSave={handleSave}
        saving={saving}
        saveSuccess={saveSuccess}
      />
    </>
  );
}
