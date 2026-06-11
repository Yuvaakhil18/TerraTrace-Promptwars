import { useState, useEffect, useRef } from 'react';
import type { Category } from '../../types';
import { EMISSION_FACTORS } from '../../services/emissionFactors';
import CategoryPicker from './CategoryPicker';

interface ActivityLoggerProps {
  onAdd: (params: {
    category: Category;
    subType: string;
    quantity: number;
    unit: string;
    note: string;
  }) => void | Promise<void>;
}

interface ToastState {
  visible: boolean;
  message: string;
}

export default function ActivityLogger({ onAdd }: ActivityLoggerProps) {
  const [category, setCategory] = useState<Category>('transport');
  const [subType, setSubType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [note, setNote] = useState('');
  const [quantityError, setQuantityError] = useState('');
  const [toast, setToast] = useState<ToastState>({ visible: false, message: '' });
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const options = Object.keys(EMISSION_FACTORS[category]);
    setSubType(options[0] ?? '');
  }, [category]);

  function getUnit(): string {
    if (!subType) return '';
    return EMISSION_FACTORS[category]?.[subType]?.unit ?? '';
  }

  function showToast(message: string) {
    setToast({ visible: true, message });
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setToast({ visible: false, message: '' });
    }, 3000);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setQuantityError('');

    const qty = parseFloat(quantity);
    if (!quantity || isNaN(qty) || qty <= 0) {
      setQuantityError('Please enter a valid quantity.');
      return;
    }

    const unit = getUnit();
    try {
      await onAdd({ category, subType, quantity: qty, unit, note });
      setQuantity('');
      setNote('');
      setQuantityError('');
      showToast('Activity logged successfully!');
    } catch (err: unknown) {
      setQuantityError(err instanceof Error ? err.message : 'Failed to save. Please try again.');
    }
  }

  const subTypeOptions = Object.entries(EMISSION_FACTORS[category]);
  const selectedFactor = EMISSION_FACTORS[category]?.[subType];

  return (
    <div className="relative space-y-4">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        
        <div className="flex items-center gap-2 mb-8">
          <svg className="w-5 h-5 text-[#059669]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h2 className="text-lg font-bold text-slate-900">Add New Activity</h2>
        </div>

        <form onSubmit={handleSubmit} noValidate aria-label="Activity log form" className="space-y-6">
          
          {/* Step 1: Category */}
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-3">1. Select Category</label>
            <CategoryPicker selected={category} onChange={cat => { setCategory(cat); setQuantityError(''); }} />
          </div>

          {/* Step 2: Activity Type */}
          <div>
            <label htmlFor="activity-type" className="block text-sm font-bold text-slate-800 mb-2">2. Activity Type</label>
            <div className="relative">
              <select
                id="activity-type"
                value={subType}
                onChange={e => setSubType(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 min-h-[48px] focus:border-[#059669] focus:ring-1 focus:ring-[#059669] outline-none appearance-none cursor-pointer"
                aria-label="Activity type"
              >
                {subTypeOptions.map(([key, factor]) => (
                  <option key={key} value={key}>{factor.label}</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
            {selectedFactor && (
              <p className="mt-2 text-xs text-slate-500">{selectedFactor.description}</p>
            )}
          </div>

          {/* Step 3 & 4: Quantity + Unit row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="quantity" className="block text-sm font-bold text-slate-800 mb-2">3. Quantity</label>
              <input
                id="quantity"
                type="number"
                min="0.01"
                step="0.01"
                value={quantity}
                onChange={e => { setQuantity(e.target.value); setQuantityError(''); }}
                placeholder="e.g. 15"
                className={`w-full rounded-xl border px-4 py-3 text-sm text-slate-700 min-h-[48px] outline-none ${quantityError ? 'border-rose-500 bg-rose-50' : 'border-slate-200 bg-white focus:border-[#059669] focus:ring-1 focus:ring-[#059669]'}`}
              />
              {quantityError && <p role="alert" aria-live="polite" className="mt-1 text-xs text-rose-500 font-medium">{quantityError}</p>}
            </div>
            <div>
              <label htmlFor="unit-display" className="block text-sm font-bold text-slate-800 mb-2">4. Unit</label>
              <div className="relative">
                <select
                  id="unit-display"
                  disabled
                  value={getUnit()}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 min-h-[48px] appearance-none opacity-100 cursor-default"
                >
                  <option value={getUnit()}>{getUnit()}</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>
          </div>

          {/* Step 5: Note */}
          <div>
            <label htmlFor="activity-note" className="block text-sm font-bold text-slate-800 mb-2">
              5. Note (optional)
            </label>
            <textarea
              id="activity-note"
              maxLength={200}
              rows={3}
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="e.g. Drove to office"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 focus:border-[#059669] focus:ring-1 focus:ring-[#059669] outline-none resize-none"
            />
            <p className="mt-1 text-[10px] text-slate-400 font-medium text-right">{note.length}/200</p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full mt-4 bg-gradient-to-r from-[#059669] to-[#10b981] hover:from-[#047857] hover:to-[#059669] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-[#059669]/20"
          >
            <span className="text-xl leading-none">+</span> Log Activity
          </button>
        </form>
      </div>

      {/* Bottom Badge */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-4 text-xs font-medium text-slate-600 shadow-sm">
        <div className="w-8 h-8 rounded-lg bg-[#eaf6ec] flex items-center justify-center text-[#059669] flex-shrink-0">
          🌿
        </div>
        <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <p>Every activity you log helps build a greener tomorrow.</p>
          <p className="text-slate-500">Thank you for making a difference! 🌍</p>
        </div>
      </div>

      {/* Toast notification */}
      {toast.visible && (
        <div
          role="status"
          className="fixed bottom-6 right-4 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-lg shadow-black/10 flex items-center gap-3 animate-fade-in"
        >
          <svg className="w-5 h-5 text-[#34d399]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}
    </div>
  );
}
