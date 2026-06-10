import ChallengeBoard from '../components/Challenges/ChallengeBoard';

export default function ChallengePage() {
  return (
    <div className="max-w-[1400px] mx-auto space-y-6 relative">
      
      {/* Header Section with Illustration */}
      <div className="relative mb-6 rounded-3xl overflow-hidden bg-transparent pt-4 pb-12 px-2">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
            <span className="text-2xl">🏆</span> Eco Challenges <span className="text-xl">🍃</span>
          </h1>
          <p className="text-slate-600 mt-2 text-sm font-medium">
            Take on daily and weekly challenges to meaningfully cut your carbon footprint.
          </p>
        </div>
        
        {/* Decorative Background Illustration (CSS/SVG Approximation) */}
        <div className="absolute top-0 right-0 bottom-0 w-2/3 pointer-events-none opacity-90 overflow-hidden" aria-hidden="true">
          <div className="absolute bottom-0 w-full h-8 bg-gradient-to-t from-[#86efac]/40 to-transparent z-10" />
          <div className="absolute -bottom-8 -right-10 w-64 h-32 bg-[#bbf7d0] rounded-[100%] z-0" />
          <div className="absolute bottom-0 right-20 w-80 h-24 bg-[#dcfce7] rounded-[100%] z-0" />
          <div className="absolute bottom-6 right-24 text-4xl">🌳</div>
          <div className="absolute bottom-10 right-16 text-2xl">🌲</div>
          <div className="absolute bottom-8 right-40 text-5xl opacity-80">🌳</div>
          <div className="absolute bottom-12 right-48 text-3xl opacity-70">🌲</div>
          <div className="absolute bottom-12 right-64 opacity-40">
            <div className="w-0.5 h-12 bg-slate-300 absolute bottom-0 left-4" />
            <div className="text-2xl absolute bottom-8 left-0 animate-spin-slow" style={{ animationDuration: '4s' }}>⚙️</div>
          </div>
          <div className="absolute bottom-16 right-80 opacity-30 scale-75">
            <div className="w-0.5 h-12 bg-slate-300 absolute bottom-0 left-4" />
            <div className="text-2xl absolute bottom-8 left-0 animate-spin-slow" style={{ animationDuration: '3.5s' }}>⚙️</div>
          </div>
        </div>
      </div>

      <div className="relative z-10 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <ChallengeBoard />
      </div>

      {/* Footer Badge */}
      <div className="mt-8 bg-[#f3fbf5] rounded-xl p-5 border border-[#eaf6ec] flex items-center justify-between relative overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="w-8 h-8 rounded-lg bg-[#eaf6ec] flex items-center justify-center text-[#059669] flex-shrink-0">
            🌿
          </div>
          <div>
            <p className="text-xs font-bold text-slate-800 mb-0.5">Every challenge you complete makes a difference.</p>
            <p className="text-[10px] font-medium text-slate-500">Small steps today, big impact tomorrow.</p>
          </div>
        </div>
        <div className="text-4xl absolute -bottom-2 -right-2 opacity-90 transform -rotate-12">
          🌱
        </div>
      </div>

    </div>
  );
}
