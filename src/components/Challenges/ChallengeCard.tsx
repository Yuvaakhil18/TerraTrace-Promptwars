import type { Challenge } from '../../types';

interface ChallengeCardProps {
  challenge: Challenge;
  onToggle: (id: string) => void;
}

export default function ChallengeCard({ challenge, onToggle }: ChallengeCardProps) {
  
  // Styling helpers based on category
  let CatIcon = '🌿';
  let ButtonIcon = '🍃';
  let catColor = 'text-[#059669]';
  let catBg = 'bg-[#eaf6ec]';

  if (challenge.category === 'transport') {
    CatIcon = '🚌';
    ButtonIcon = '🚲';
    catColor = 'text-blue-500';
    catBg = 'bg-blue-50';
  } else if (challenge.category === 'energy') {
    CatIcon = '💧'; // or lightning
    ButtonIcon = '⚡';
    catColor = 'text-amber-500';
    catBg = 'bg-amber-50';
  } else if (challenge.category === 'shopping') {
    CatIcon = '👕';
    ButtonIcon = '👕';
    catColor = 'text-purple-500';
    catBg = 'bg-purple-50';
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full group">
      
      {/* Top Header Row */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full ${catBg} flex items-center justify-center text-sm`}>
            {CatIcon}
          </div>
          <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${catBg} ${catColor}`}>
            {challenge.category}
          </span>
        </div>
        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {challenge.duration_days}d
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        <h3 className="text-sm font-bold text-slate-900 mb-2 leading-tight">
          {challenge.title}
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed mb-4 flex-1">
          {challenge.description}
        </p>
        
        {/* Savings indicator */}
        <div className="flex items-center gap-1.5 mb-5 text-xs font-bold text-slate-900">
          <svg className="w-4 h-4 text-[#059669]" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
          </svg>
          ~{challenge.estimated_saving_kg} kg CO₂e
        </div>
      </div>

      {/* Action Button */}
      {challenge.completed ? (
        <button
          disabled
          className="w-full py-2.5 rounded-xl bg-slate-100 text-slate-400 text-xs font-bold flex items-center justify-center gap-2 cursor-not-allowed"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Completed
        </button>
      ) : (
        <button
          onClick={() => onToggle(challenge.id)}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#059669] to-[#22c55e] hover:from-[#047857] hover:to-[#16a34a] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm shadow-[#059669]/20 transition-all transform hover:-translate-y-0.5 group-hover:shadow-md"
        >
          <span className="text-sm">{ButtonIcon}</span> Take Challenge
        </button>
      )}

    </div>
  );
}
