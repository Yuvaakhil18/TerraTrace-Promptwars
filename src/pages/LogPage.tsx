import { useActivities } from '../hooks/useActivities';
import ActivityLogger from '../components/Logger/ActivityLogger';
import ActivityList from '../components/Logger/ActivityList';
import Spinner from '../components/ui/Spinner';

export default function LogPage() {
  const { activities, loading, error, addActivity, deleteActivity } = useActivities();

  if (loading) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <Spinner label="Loading activities..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-full flex items-center justify-center px-4">
        <p className="text-rose-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      
      {/* Header Section with Illustration */}
      <div className="relative mb-8 rounded-3xl overflow-hidden bg-transparent pt-4 pb-12 px-2">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
            Log an Activity <span className="text-2xl">🍃</span>
          </h1>
          <p className="text-slate-600 mt-2 text-sm font-medium">
            Record your daily activities to calculate their carbon impact.
          </p>
        </div>
        
        {/* Decorative Background Illustration (CSS/SVG Approximation) */}
        <div className="absolute top-0 right-0 bottom-0 w-2/3 pointer-events-none opacity-90 overflow-hidden" aria-hidden="true">
          {/* Base ground */}
          <div className="absolute bottom-0 w-full h-8 bg-gradient-to-t from-[#86efac]/40 to-transparent z-10" />
          
          {/* Hills */}
          <div className="absolute -bottom-8 -right-10 w-64 h-32 bg-[#bbf7d0] rounded-[100%] z-0" />
          <div className="absolute bottom-0 right-20 w-80 h-24 bg-[#dcfce7] rounded-[100%] z-0" />
          
          {/* Trees */}
          <div className="absolute bottom-6 right-24 text-4xl">🌳</div>
          <div className="absolute bottom-10 right-16 text-2xl">🌲</div>
          <div className="absolute bottom-8 right-40 text-5xl opacity-80">🌳</div>
          <div className="absolute bottom-12 right-48 text-3xl opacity-70">🌲</div>
          
          {/* Wind Turbines (simplified) */}
          <div className="absolute bottom-12 right-64 opacity-40">
            <div className="w-0.5 h-12 bg-slate-300 absolute bottom-0 left-4" />
            <div className="text-2xl absolute bottom-8 left-0 animate-spin-slow" style={{ animationDuration: '4s' }}>⚙️</div>
          </div>
          
          {/* Cars */}
          <div className="absolute bottom-6 right-56 text-2xl">🚗</div>
          
          {/* Leaves */}
          <div className="absolute top-8 right-60 text-xl transform -rotate-45">🍃</div>
          <div className="absolute top-20 right-10 text-2xl transform rotate-12">🍃</div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
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
