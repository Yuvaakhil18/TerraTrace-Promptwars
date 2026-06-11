/** Formats a kilogram CO₂e value to a human-readable string with unit. */
export function formatCO2(kg: number, decimals = 2): string {
  return `${kg.toFixed(decimals)} kg CO₂e`;
}

/** Formats an ISO date string to a locale-aware date (e.g. "10 Jun 2026"). */
export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/** Formats an ISO date string to a short date (e.g. "10 Jun"). */
export function formatShortDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

/** Formats an ISO date string to a local time (e.g. "09:30"). */
export function formatTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

/** Formats a quantity with its unit suffix (e.g. "25 km"). */
export function formatQuantity(quantity: number, unit: string): string {
  return `${quantity} ${unit}`;
}

/** Capitalizes the first character of a string. */
export function capitalizeFirst(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/** Returns a user-friendly label for a date ("Today", "Yesterday", or short date). */
export function getDayLabel(isoDate: string): string {
  const date = new Date(isoDate);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';

  return date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
}
