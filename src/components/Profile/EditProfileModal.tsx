import type { User } from 'firebase/auth';

interface EditProfileModalProps {
  editOpen: boolean;
  setEditOpen: (open: boolean) => void;
  currentUser: User | null;
  imgError: boolean;
  setImgError: (err: boolean) => void;
  userInitial: string;
  editName: string;
  setEditName: (name: string) => void;
  email: string;
  editLocation: string;
  setEditLocation: (loc: string) => void;
  handleSave: () => void;
  saving: boolean;
  saveSuccess: boolean;
}

export default function EditProfileModal({
  editOpen,
  setEditOpen,
  currentUser,
  imgError,
  setImgError,
  userInitial,
  editName,
  setEditName,
  email,
  editLocation,
  setEditLocation,
  handleSave,
  saving,
  saveSuccess
}: EditProfileModalProps) {
  if (!editOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setEditOpen(false)}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative bg-[var(--bg-surface)] rounded-2xl shadow-2xl w-full max-w-md p-6 animate-fade-in"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
            <svg className="w-5 h-5 text-[#059669]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Edit Profile
          </h2>
          <button aria-label="Close modal" onClick={() => setEditOpen(false)} className="p-1.5 rounded-lg hover:bg-[var(--bg-card-hover)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
            <svg aria-hidden="true" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Avatar Preview */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#059669] to-[#22c55e] flex items-center justify-center text-white text-3xl font-bold shadow-md border-4 border-[#eaf6ec] overflow-hidden">
            {currentUser?.photoURL && !imgError
              ? <img src={currentUser.photoURL} className="w-full h-full object-cover" alt="avatar" onError={() => setImgError(true)} />
              : <span>{editName[0]?.toUpperCase() || userInitial}</span>}
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1.5">Full Name</label>
            <input
              type="text"
              value={editName}
              onChange={e => setEditName(e.target.value)}
              placeholder="Your display name"
              className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--input-bg)] text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#059669]/30 focus:border-[#059669] transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1.5">Email Address</label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card-hover)] text-sm text-[var(--text-muted)] cursor-not-allowed"
            />
            <p className="text-[10px] text-[var(--text-muted)] mt-1">Email cannot be changed here.</p>
          </div>
          <div>
            <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1.5">Location</label>
            <input
              type="text"
              value={editLocation}
              onChange={e => setEditLocation(e.target.value)}
              placeholder="e.g. Mumbai, India"
              className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--input-bg)] text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[#059669]/30 focus:border-[#059669] transition-all"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => setEditOpen(false)}
            className="flex-1 px-4 py-2.5 rounded-xl border border-[var(--border-color)] text-sm font-semibold text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)] transition-colors focus:ring-2 focus:ring-[#059669]/30"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !editName.trim()}
            className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#059669] to-[#22c55e] text-white text-sm font-bold shadow-sm hover:shadow-md transition-all disabled:opacity-60 flex items-center justify-center gap-2 focus:ring-2 focus:ring-[#059669]/30"
          >
            {saving ? (
              <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg> Saving…</>
            ) : saveSuccess ? (
              <><svg aria-hidden="true" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Saved!</>
            ) : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
