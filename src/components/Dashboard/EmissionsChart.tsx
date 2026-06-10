import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface EmissionsChartProps {
  weeklyData: { date: string; total: number }[];
  categoryBreakdown?: { category: string; total: number }[];
}

export default function EmissionsChart({ weeklyData }: EmissionsChartProps) {
  // Format data for the chart (extracting short day names)
  const chartData = weeklyData.map(day => {
    const d = new Date(day.date);
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    return {
      name: dayName,
      total: Number(day.total.toFixed(2))
    };
  });

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">7-Day Emissions Trend</h3>
        <button className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">
          7 Days
          <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      <div className="flex-1 w-full min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: 'var(--text-muted)' }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: 'var(--text-muted)' }} 
              tickFormatter={(value) => `${value}kg`}
            />
            <Tooltip 
              cursor={{ fill: 'var(--bg-card-hover)' }}
              contentStyle={{ borderRadius: '8px', backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-primary)', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
            />
            <Bar 
              dataKey="total" 
              fill="#22c55e" 
              radius={[4, 4, 0, 0]} 
              barSize={32}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
