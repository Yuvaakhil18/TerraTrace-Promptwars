import { useState, useEffect } from 'react';
import type { Challenge } from '../../types';
import ChallengeCard from './ChallengeCard';
import { useAuth } from '../../context/AuthContext';
import { getDocument, createDocument } from '../../lib/firestore';

const INITIAL_CHALLENGES: Challenge[] = [
  {
    id: 'zero-meat-monday',
    title: 'Zero-Meat Monday',
    description: 'Skip meat for one full day and opt for plant-based or vegetarian meals.',
    estimated_saving_kg: 6.0,
    duration_days: 1,
    category: 'food',
    completed: false,
  },
  {
    id: 'public-transit-week',
    title: 'Public Transit Week',
    description: 'Avoid using your private car for all 5 workdays — take bus, metro, or train.',
    estimated_saving_kg: 9.6,
    duration_days: 5,
    category: 'transport',
    completed: false,
  },
  {
    id: 'cold-shower',
    title: 'Cold Shower Challenge',
    description: 'Skip water heating for 7 consecutive days and take cold showers.',
    estimated_saving_kg: 4.9,
    duration_days: 7,
    category: 'energy',
    completed: false,
  },
  {
    id: 'local-produce',
    title: 'Local Produce Only',
    description: 'Avoid air-freighted food for 3 days — choose locally grown or seasonal.',
    estimated_saving_kg: 3.0,
    duration_days: 3,
    category: 'food',
    completed: false,
  },
  {
    id: 'no-car-day',
    title: 'Car-Free Day',
    description: 'Walk or cycle for every trip today — leave your car keys at home.',
    estimated_saving_kg: 1.9,
    duration_days: 1,
    category: 'transport',
    completed: false,
  },
  {
    id: 'unplug-standby',
    title: 'Unplug Standby',
    description: 'Kill phantom load by unplugging all standby devices for 1 full week.',
    estimated_saving_kg: 2.0,
    duration_days: 7,
    category: 'energy',
    completed: false,
  },
  {
    id: 'secondhand-only',
    title: 'Second-Hand Only',
    description: 'Pledge no new clothing purchases for 2 weeks — shop secondhand or swap.',
    estimated_saving_kg: 5.0,
    duration_days: 14,
    category: 'shopping',
    completed: false,
  },
  {
    id: 'carpool-week',
    title: 'Carpool Week',
    description: 'Share rides with colleagues or neighbours every workday for 5 days.',
    estimated_saving_kg: 4.8,
    duration_days: 5,
    category: 'transport',
    completed: false,
  },
];

export default function ChallengeBoard() {
  const { currentUser } = useAuth();
  const [challenges, setChallenges] = useState<Challenge[]>(INITIAL_CHALLENGES);

  useEffect(() => {
    let isMounted = true;
    async function loadChallenges() {
      if (!currentUser) {
        if (isMounted) setChallenges(INITIAL_CHALLENGES);
        return;
      }
      try {
        const doc = await getDocument<{ completedIds: string[] }>(`users/${currentUser.uid}/data`, 'challenges');
        if (isMounted && doc?.completedIds) {
          const completedSet = new Set(doc.completedIds);
          setChallenges(INITIAL_CHALLENGES.map(c => ({
            ...c,
            completed: completedSet.has(c.id)
          })));
        } else if (isMounted) {
          setChallenges(INITIAL_CHALLENGES);
        }
      } catch (err) {
        console.error('Failed to load challenges:', err);
      }
    }
    loadChallenges();
    return () => { isMounted = false; };
  }, [currentUser]);

  async function handleToggle(id: string) {
    if (!currentUser) return;

    let newChallenges: Challenge[] = [];
    setChallenges(prev => {
      newChallenges = prev.map(c => (c.id === id ? { ...c, completed: true } : c));
      return newChallenges;
    });

    try {
      const completedIds = newChallenges.filter(c => c.completed).map(c => c.id);
      await createDocument(`users/${currentUser.uid}/data`, 'challenges', { completedIds });
    } catch (err) {
      console.error('Failed to save challenge progress:', err);
      setChallenges(prev => prev.map(c => (c.id === id ? { ...c, completed: false } : c)));
    }
  }

  const completedChallenges = challenges.filter(c => c.completed);
  const totalSaving = completedChallenges.reduce((s, c) => s + c.estimated_saving_kg, 0);
  const completedCount = completedChallenges.length;
  const totalCount = challenges.length;
  const progressPct = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  // SVG Semi-circle math for gauge
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPct / 100) * circumference;

  return (
    <section aria-labelledby="challenges-heading" className="space-y-6">
      
      {/* Progress Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm flex flex-col gap-8">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          
          {/* Left: Gauge & Titles */}
          <div className="flex items-center gap-6">
            <div className="relative w-24 h-24 flex-shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#f1f5f9" strokeWidth="8" />
                <circle 
                  cx="50" cy="50" r="40" 
                  fill="none" 
                  stroke="#22c55e" 
                  strokeWidth="8" 
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-3xl text-[#059669]">
                🍃
              </div>
            </div>
            <div>
              <h2 id="challenges-heading" className="text-xl font-bold text-slate-900 mb-1">
                Your Progress
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Complete challenges to reduce your footprint
              </p>
            </div>
          </div>

          {/* Right: Metrics */}
          <div className="flex items-center gap-8 md:gap-12">
            
            {/* Completed */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-[#22c55e]">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </div>
              <div>
                <p className="text-lg font-black text-slate-900 leading-none">{completedCount}</p>
                <p className="text-[10px] font-bold text-slate-500 mt-0.5">Completed</p>
              </div>
            </div>

            {/* CO2e Saved */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#eaf6ec] flex items-center justify-center text-[#059669]">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
              </div>
              <div>
                <p className="text-lg font-black text-slate-900 leading-none">{totalSaving.toFixed(1)}</p>
                <p className="text-[10px] font-bold text-slate-500 mt-0.5">kg CO₂e Saved</p>
              </div>
            </div>

            {/* Total */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-amber-400">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              </div>
              <div>
                <p className="text-lg font-black text-slate-900 leading-none">{totalCount}</p>
                <p className="text-[10px] font-bold text-slate-500 mt-0.5">Total Challenges</p>
              </div>
            </div>

          </div>
        </div>

        {/* Linear Progress Bar */}
        <div>
           <div className="flex justify-between items-center mb-2">
             <span className="text-[10px] font-bold text-slate-700">Overall Progress</span>
             <div className="flex items-center gap-3">
               <span className="text-[10px] font-bold text-[#22c55e] tabular-nums">{Math.round(progressPct)}%</span>
               <span className="text-[10px] font-medium text-slate-500 tabular-nums">{completedCount} / {totalCount} challenges</span>
             </div>
           </div>
           <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#22c55e] rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${progressPct}%` }}
              />
           </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <button className="px-4 py-2 bg-[#eaf6ec] text-[#059669] border border-[#eaf6ec] rounded-lg text-xs font-bold flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            All Challenges
          </button>
          <button className="px-4 py-2 bg-white text-slate-600 border border-slate-200 rounded-lg text-xs font-medium hover:bg-slate-50 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            Daily
          </button>
          <button className="px-4 py-2 bg-white text-slate-600 border border-slate-200 rounded-lg text-xs font-medium hover:bg-slate-50 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            Weekly
          </button>
          <button className="px-4 py-2 bg-white text-slate-600 border border-slate-200 rounded-lg text-xs font-medium hover:bg-slate-50 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
            By Category
            <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </button>
        </div>
        
        <button className="px-4 py-2 bg-white text-slate-600 border border-slate-200 rounded-lg text-xs font-medium hover:bg-slate-50 flex items-center gap-2 shadow-sm">
          Sort by: Recommended
          <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </button>
      </div>

      {/* Challenge Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {challenges.map(challenge => (
          <ChallengeCard
            key={challenge.id}
            challenge={challenge}
            onToggle={handleToggle}
          />
        ))}
      </div>
      
    </section>
  );
}
