interface FootprintScoreProps {
  dailyAverage: number;
}

const GLOBAL_AVERAGE_KG_DAY = 11;

export default function FootprintScore({ dailyAverage }: FootprintScoreProps) {
  // Score logic
  let label = 'Below average';
  let color = 'text-[#059669]';
  if (dailyAverage > 8 && dailyAverage <= 14) {
    label = 'Near average';
    color = 'text-amber-500';
  } else if (dailyAverage > 14) {
    label = 'Above average';
    color = 'text-rose-500';
  }

  // Calculate percentage for gauge (0-100 scale, where 22kg is 0 score, 0kg is 100 score)
  const scoreValue = Math.max(0, Math.min(100, Math.round(100 - (dailyAverage / 22) * 100)));

  // SVG Semi-circle math
  const radius = 65;
  const circumference = Math.PI * radius; // Semi-circle is exactly half the full circumference
  const strokeDashoffset = circumference - (scoreValue / 100) * circumference;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-2">
        <h3 className="text-base font-bold text-slate-900">Your Footprint Score</h3>
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
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>

      <div className="mb-8 flex flex-col items-center justify-between gap-8 sm:flex-row">
        {/* Semi-circular Gauge */}
        <div className="relative h-28 w-48 flex-shrink-0">
          <svg className="h-full w-full overflow-visible" viewBox="0 0 160 90">
            {/* Defs for gradient */}
            <defs>
              <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#059669" />
                <stop offset="80%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
            </defs>

            {/* Background Track */}
            <path
              d="M 15 85 A 65 65 0 0 1 145 85"
              fill="none"
              stroke="#f1f5f9"
              strokeWidth="12"
              strokeLinecap="round"
            />
            {/* Value Track */}
            <path
              d="M 15 85 A 65 65 0 0 1 145 85"
              fill="none"
              stroke="url(#scoreGradient)"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          {/* Inner Content */}
          <div className="absolute inset-x-0 bottom-0 flex flex-col items-center text-center">
            <span className={`mb-1 text-xl ${color}`}>🌿</span>
            <span className={`text-lg leading-tight font-bold ${color}`}>{label}</span>
            <div className="mt-2 text-[10px] font-medium text-slate-500">
              Daily average:
              <br />
              <span className="font-bold text-slate-900">{dailyAverage.toFixed(2)} kg CO₂e</span>
            </div>
          </div>
        </div>

        {/* Badge "You're doing better..." */}
        <div className="flex max-w-[200px] flex-1 items-center gap-3 rounded-xl border border-transparent bg-[#f3fbf5] p-4">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#eaf6ec] text-[#059669]">
            🌿
          </div>
          <p className="text-xs leading-relaxed font-medium text-slate-700">
            You're doing better than <strong className="text-[#059669]">68%</strong> of users!
          </p>
        </div>
      </div>

      {/* Linear Slider (Bottom) */}
      <div className="mt-8">
        <div className="mb-2 flex justify-between px-1 text-[10px] font-medium text-slate-500">
          <span>0 kg/day</span>
          <span>Global avg: 11 kg/day</span>
          <span>22+ kg/day</span>
        </div>

        <div className="relative h-2.5 overflow-visible rounded-full bg-gradient-to-r from-[#059669] via-[#f59e0b] to-[#f43f5e]">
          {/* Global average marker */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-white shadow-sm"
            style={{ left: '50%' }}
          />

          {/* User indicator bubble */}
          <div
            className="absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-4 border-[#059669] bg-white shadow-md"
            style={{ left: `calc(${Math.min((dailyAverage / 22) * 100, 100)}% - 8px)` }}
          />
        </div>

        <p className="mt-6 text-center text-xs font-medium text-slate-500">
          {dailyAverage < GLOBAL_AVERAGE_KG_DAY
            ? `You emit ${(GLOBAL_AVERAGE_KG_DAY - dailyAverage).toFixed(2)} kg less than the global average per day 🎉`
            : `You emit ${(dailyAverage - GLOBAL_AVERAGE_KG_DAY).toFixed(2)} kg more than the global average per day`}
        </p>
      </div>
    </div>
  );
}
