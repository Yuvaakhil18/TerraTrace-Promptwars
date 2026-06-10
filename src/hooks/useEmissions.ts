import { useMemo, useCallback } from 'react';
import type { Activity, EmissionSummary, Category } from '../types';

function getDateString(offsetDays = 0): string {
  const d = new Date();
  d.setDate(d.getDate() - offsetDays);
  return d.toISOString().split('T')[0];
}

export function useEmissions(activities: Activity[]) {
  const todayTotal = useMemo(() => {
    const today = getDateString();
    return activities
      .filter(a => a.timestamp.startsWith(today))
      .reduce((sum, a) => sum + a.co2e_kg, 0);
  }, [activities]);

  const weeklyTotals = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const date = getDateString(6 - i);
      const total = activities
        .filter(a => a.timestamp.startsWith(date))
        .reduce((sum, a) => sum + a.co2e_kg, 0);
      return { date, total: Math.round(total * 100) / 100 };
    });
  }, [activities]);

  const categoryBreakdown = useMemo(() => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 7);
    const recent = activities.filter(a => new Date(a.timestamp) >= cutoff);
    const categories: Category[] = ['transport', 'food', 'energy', 'shopping'];
    return Object.fromEntries(
      categories.map(cat => [
        cat,
        Math.round(recent.filter(a => a.category === cat).reduce((s, a) => s + a.co2e_kg, 0) * 100) / 100,
      ]),
    ) as Record<Category, number>;
  }, [activities]);

  const weeklySummary = useMemo((): EmissionSummary => {
    const total = Object.values(categoryBreakdown).reduce((s, v) => s + v, 0);
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 7);
    const recent = activities.filter(a => new Date(a.timestamp) >= cutoff);
    const top = [...recent].sort((a, b) => b.co2e_kg - a.co2e_kg)[0];
    return {
      total_kg: Math.round(total * 100) / 100,
      transport_kg: categoryBreakdown.transport,
      food_kg: categoryBreakdown.food,
      energy_kg: categoryBreakdown.energy,
      shopping_kg: categoryBreakdown.shopping,
      top_activity: top ? `${top.subType} (${top.co2e_kg} kg CO₂e)` : 'None logged yet',
    };
  }, [activities, categoryBreakdown]);

  const getTodayTotal = useCallback(() => todayTotal, [todayTotal]);
  const getWeeklyTotals = useCallback(() => weeklyTotals, [weeklyTotals]);
  const getCategoryBreakdown = useCallback((days = 7) => {
    if (days === 7) return categoryBreakdown;
    
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    const recent = activities.filter(a => new Date(a.timestamp) >= cutoff);
    const categories: Category[] = ['transport', 'food', 'energy', 'shopping'];
    return Object.fromEntries(
      categories.map(cat => [
        cat,
        Math.round(recent.filter(a => a.category === cat).reduce((s, a) => s + a.co2e_kg, 0) * 100) / 100,
      ]),
    ) as Record<Category, number>;
  }, [activities, categoryBreakdown]);

  const getWeeklySummary = useCallback(() => weeklySummary, [weeklySummary]);

  return { 
    todayTotal, 
    weeklyTotals, 
    categoryBreakdown, 
    weeklySummary, 
    getTodayTotal, 
    getWeeklyTotals, 
    getCategoryBreakdown, 
    getWeeklySummary 
  };
}
