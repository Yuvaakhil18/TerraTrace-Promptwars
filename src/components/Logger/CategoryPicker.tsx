import type { Category } from '../../types';
import type { ReactNode } from 'react';

interface CategoryPickerProps {
  selected: Category;
  onChange: (category: Category) => void;
}

const CATEGORIES: { value: Category; label: string; icon: ReactNode; }[] = [
  { 
    value: 'transport', 
    label: 'Transport', 
    icon: (
      <svg className="w-8 h-8 text-[#059669]" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
      </svg>
    )
  },
  { 
    value: 'food',      
    label: 'Food',      
    icon: (
      <svg className="w-8 h-8 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
        <path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z" />
      </svg>
    )
  },
  { 
    value: 'energy',    
    label: 'Energy',    
    icon: (
      <svg className="w-8 h-8 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
        <path d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    )
  },
  { 
    value: 'shopping',  
    label: 'Shopping',  
    icon: (
      <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18 6h-2c0-2.21-1.79-4-4-4S8 3.79 8 6H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6-2c1.1 0 2 .9 2 2H10c0-1.1.9-2 2-2zm6 16H6V8h2v2c0 .55.45 1 1 1s1-.45 1-1V8h4v2c0 .55.45 1 1 1s1-.45 1-1V8h2v12z" />
      </svg>
    )
  },
];

export default function CategoryPicker({ selected, onChange }: CategoryPickerProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex = index;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      nextIndex = (index + 1) % CATEGORIES.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      nextIndex = (index - 1 + CATEGORIES.length) % CATEGORIES.length;
    } else {
      return;
    }
    e.preventDefault();
    onChange(CATEGORIES[nextIndex].value);
    
    // Focus the next/prev button in DOM
    const buttons = e.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('button[role="radio"]');
    buttons?.[nextIndex]?.focus();
  };

  return (
    <div 
      className="grid grid-cols-2 sm:grid-cols-4 gap-4" 
      role="radiogroup" 
      aria-label="Activity category"
    >
      {CATEGORIES.map((cat, index) => {
        const isSelected = selected === cat.value;
        return (
          <button
            key={cat.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            tabIndex={isSelected ? 0 : -1}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onClick={() => onChange(cat.value)}
            className={`
              flex flex-col items-center justify-center gap-3 p-4 rounded-xl border
              min-h-[100px] transition-all duration-200 cursor-pointer bg-white
              ${isSelected
                ? 'border-2 border-[#059669] shadow-sm'
                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }
            `}
          >
            <div aria-hidden="true">{cat.icon}</div>
            <span className={`text-sm font-semibold ${isSelected ? 'text-[#059669]' : 'text-slate-600'}`}>{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
}
