import type { Category } from '../../types';

interface CategoryPickerProps {
  selected: Category;
  onChange: (category: Category) => void;
}

const CATEGORIES: { value: Category; label: string; icon: string; color: string }[] = [
  { value: 'transport', label: 'Transport', icon: '🚗', color: 'from-sky to-sky-light' },
  { value: 'food',      label: 'Food',      icon: '🍽️', color: 'from-amber to-amber/80' },
  { value: 'energy',    label: 'Energy',    icon: '⚡',  color: 'from-danger to-danger/80' },
  { value: 'shopping',  label: 'Shopping',  icon: '🛍️', color: 'from-leaf to-leaf-light' },
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
    <fieldset>
      <legend className="text-sm font-semibold text-[var(--text-secondary)] mb-3">Select Category</legend>
      <div 
        className="grid grid-cols-2 sm:grid-cols-4 gap-3" 
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
                relative flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2
                min-h-[88px] transition-all duration-300 cursor-pointer
                focus-visible:outline-2 focus-visible:outline-leaf focus-visible:outline-offset-2
                ${isSelected
                  ? 'border-leaf bg-leaf/5 shadow-sm shadow-leaf/10 scale-[1.02]'
                  : 'border-[var(--border-color)] bg-[var(--bg-card)] hover:border-leaf/30 hover:bg-leaf/3 hover:scale-[1.01]'
                }
              `}
            >
              <span className={`text-2xl transition-transform duration-300 ${isSelected ? 'scale-110' : ''}`} aria-hidden="true">{cat.icon}</span>
              <span className={`text-xs font-semibold transition-colors ${isSelected ? 'text-leaf' : 'text-[var(--text-secondary)]'}`}>{cat.label}</span>
              {isSelected && (
                <>
                  <span className="sr-only"> (selected)</span>
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-leaf animate-bounce-in" aria-hidden="true" />
                </>
              )}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
