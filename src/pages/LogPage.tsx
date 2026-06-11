import { useActivities } from '../hooks/useActivities';
import ActivityLogger from '../components/Logger/ActivityLogger';
import ActivityList from '../components/Logger/ActivityList';
import Spinner from '../components/ui/Spinner';

export default function LogPage() {
  const { activities, loading, error, addActivity, deleteActivity } = useActivities();

  if (loading) {
    return (
      <div className="flex min-h-full items-center justify-center">
        <Spinner label="Loading activities..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-full items-center justify-center px-4">
        <p className="text-rose-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl">
      {/* Header Section with Illustration */}
      <div className="relative mb-8 overflow-hidden rounded-3xl bg-transparent px-2 pt-4 pb-12">
        <div className="relative z-10">
          <h1 className="flex items-center gap-2 text-3xl font-bold text-slate-900">
            Log an Activity <span className="text-2xl">🍃</span>
          </h1>
          <p className="mt-2 text-sm font-medium text-slate-600">
            Record your daily activities to calculate their carbon impact.
          </p>
        </div>

        {/* Decorative Background Illustration (CSS/SVG Approximation) */}
        <div
          className="pointer-events-none absolute top-0 right-0 bottom-0 w-2/3 overflow-hidden opacity-90"
          aria-hidden="true"
        >
          {/* Base ground */}
          <div className="absolute bottom-0 z-10 h-8 w-full bg-gradient-to-t from-[#86efac]/40 to-transparent" />

          {/* Hills */}
          <div className="absolute -right-10 -bottom-8 z-0 h-32 w-64 rounded-[100%] bg-[#bbf7d0]" />
          <div className="absolute right-20 bottom-0 z-0 h-24 w-80 rounded-[100%] bg-[#dcfce7]" />

          {/* Trees */}
          <div className="absolute right-24 bottom-6 text-4xl">🌳</div>
          <div className="absolute right-16 bottom-10 text-2xl">🌲</div>
          <div className="absolute right-40 bottom-8 text-5xl opacity-80">🌳</div>
          <div className="absolute right-48 bottom-12 text-3xl opacity-70">🌲</div>

          {/* Wind Turbines (simplified) */}
          <div className="absolute right-64 bottom-12 opacity-40">
            <div className="absolute bottom-0 left-4 h-12 w-0.5 bg-slate-300" />
            <div
              className="animate-spin-slow absolute bottom-8 left-0 text-2xl"
              style={{ animationDuration: '4s' }}
            >
              ⚙️
            </div>
          </div>

          {/* Cars */}
          <div className="absolute right-56 bottom-6 text-2xl">🚗</div>

          {/* Leaves */}
          <div className="absolute top-8 right-60 -rotate-45 transform text-xl">🍃</div>
          <div className="absolute top-20 right-10 rotate-12 transform text-2xl">🍃</div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Left Column: Form */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <ActivityLogger onAdd={addActivity} />
        </div>

        {/* Right Column: List */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <ActivityList activities={activities} onDelete={deleteActivity} />
        </div>
      </div>
    </div>
  );
}
