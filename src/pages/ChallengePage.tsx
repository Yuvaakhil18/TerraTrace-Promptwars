import ChallengeBoard from '../components/Challenges/ChallengeBoard';

export default function ChallengePage() {
  return (
    <div className="relative mx-auto max-w-[1400px] space-y-6">
      {/* Header Section with Illustration */}
      <div className="relative mb-6 overflow-hidden rounded-3xl bg-transparent px-2 pt-4 pb-12">
        <div className="relative z-10">
          <h1 className="flex items-center gap-2 text-3xl font-bold text-slate-900">
            <span className="text-2xl">🏆</span> Eco Challenges <span className="text-xl">🍃</span>
          </h1>
          <p className="mt-2 text-sm font-medium text-slate-600">
            Take on daily and weekly challenges to meaningfully cut your carbon footprint.
          </p>
        </div>

        {/* Decorative Background Illustration (CSS/SVG Approximation) */}
        <div
          className="pointer-events-none absolute top-0 right-0 bottom-0 w-2/3 overflow-hidden opacity-90"
          aria-hidden="true"
        >
          <div className="absolute bottom-0 z-10 h-8 w-full bg-gradient-to-t from-[#86efac]/40 to-transparent" />
          <div className="absolute -right-10 -bottom-8 z-0 h-32 w-64 rounded-[100%] bg-[#bbf7d0]" />
          <div className="absolute right-20 bottom-0 z-0 h-24 w-80 rounded-[100%] bg-[#dcfce7]" />
          <div className="absolute right-24 bottom-6 text-4xl">🌳</div>
          <div className="absolute right-16 bottom-10 text-2xl">🌲</div>
          <div className="absolute right-40 bottom-8 text-5xl opacity-80">🌳</div>
          <div className="absolute right-48 bottom-12 text-3xl opacity-70">🌲</div>
          <div className="absolute right-64 bottom-12 opacity-40">
            <div className="absolute bottom-0 left-4 h-12 w-0.5 bg-slate-300" />
            <div
              className="animate-spin-slow absolute bottom-8 left-0 text-2xl"
              style={{ animationDuration: '4s' }}
            >
              ⚙️
            </div>
          </div>
          <div className="absolute right-80 bottom-16 scale-75 opacity-30">
            <div className="absolute bottom-0 left-4 h-12 w-0.5 bg-slate-300" />
            <div
              className="animate-spin-slow absolute bottom-8 left-0 text-2xl"
              style={{ animationDuration: '3.5s' }}
            >
              ⚙️
            </div>
          </div>
        </div>
      </div>

      <div className="animate-fade-in-up relative z-10" style={{ animationDelay: '0.1s' }}>
        <ChallengeBoard />
      </div>

      {/* Footer Badge */}
      <div className="relative mt-8 flex items-center justify-between overflow-hidden rounded-xl border border-[#eaf6ec] bg-[#f3fbf5] p-5">
        <div className="flex items-start gap-4">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[#eaf6ec] text-[#059669]">
            🌿
          </div>
          <div>
            <p className="mb-0.5 text-xs font-bold text-slate-800">
              Every challenge you complete makes a difference.
            </p>
            <p className="text-[10px] font-medium text-slate-500">
              Small steps today, big impact tomorrow.
            </p>
          </div>
        </div>
        <div className="absolute -right-2 -bottom-2 -rotate-12 transform text-4xl opacity-90">
          🌱
        </div>
      </div>
    </div>
  );
}
