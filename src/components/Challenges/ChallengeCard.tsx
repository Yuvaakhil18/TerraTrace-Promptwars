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
    <div className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      {/* Top Header Row */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`h-8 w-8 rounded-full ${catBg} flex items-center justify-center text-sm`}>
            {CatIcon}
          </div>
          <span
            className={`rounded-full px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase ${catBg} ${catColor}`}
          >
            {challenge.category}
          </span>
        </div>
        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500">
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {challenge.duration_days}d
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col">
        <h3 className="mb-2 text-sm leading-tight font-bold text-slate-900">{challenge.title}</h3>
        <p className="mb-4 flex-1 text-xs leading-relaxed text-slate-500">
          {challenge.description}
        </p>

        {/* Savings indicator */}
        <div className="mb-5 flex items-center gap-1.5 text-xs font-bold text-slate-900">
          <svg className="h-4 w-4 text-[#059669]" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
              clipRule="evenodd"
            />
          </svg>
          ~{challenge.estimated_saving_kg} kg CO₂e
        </div>
      </div>

      {/* Action Button */}
      {challenge.completed ? (
        <button
          disabled
          className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-slate-100 py-2.5 text-xs font-bold text-slate-400"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Completed
        </button>
      ) : (
        <button
          onClick={() => onToggle(challenge.id)}
          className="flex w-full transform items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#059669] to-[#22c55e] py-2.5 text-xs font-bold text-white shadow-sm shadow-[#059669]/20 transition-all group-hover:shadow-md hover:-translate-y-0.5 hover:from-[#047857] hover:to-[#16a34a]"
        >
          <span className="text-sm">{ButtonIcon}</span> Take Challenge
        </button>
      )}
    </div>
  );
}
