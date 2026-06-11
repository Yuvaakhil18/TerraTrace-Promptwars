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
  saveSuccess,
}: EditProfileModalProps) {
  if (!editOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={() => setEditOpen(false)}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="animate-fade-in relative w-full max-w-md rounded-2xl bg-[var(--bg-surface)] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-bold text-[var(--text-primary)]">
            <svg
              className="h-5 w-5 text-[#059669]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
            Edit Profile
          </h2>
          <button
            aria-label="Close modal"
            onClick={() => setEditOpen(false)}
            className="rounded-lg p-1.5 text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-primary)]"
          >
            <svg
              aria-hidden="true"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Avatar Preview */}
        <div className="mb-6 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-4 border-[#eaf6ec] bg-gradient-to-br from-[#059669] to-[#22c55e] text-3xl font-bold text-white shadow-md">
            {currentUser?.photoURL && !imgError ? (
              <img
                src={currentUser.photoURL}
                className="h-full w-full object-cover"
                alt="avatar"
                onError={() => setImgError(true)}
              />
            ) : (
              <span>{editName[0]?.toUpperCase() || userInitial}</span>
            )}
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-bold text-[var(--text-secondary)]">
              Full Name
            </label>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Your display name"
              className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--input-bg)] px-4 py-2.5 text-sm text-[var(--text-primary)] transition-all focus:border-[#059669] focus:ring-2 focus:ring-[#059669]/30 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold text-[var(--text-secondary)]">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full cursor-not-allowed rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card-hover)] px-4 py-2.5 text-sm text-[var(--text-muted)]"
            />
            <p className="mt-1 text-[10px] text-[var(--text-muted)]">
              Email cannot be changed here.
            </p>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold text-[var(--text-secondary)]">
              Location
            </label>
            <input
              type="text"
              value={editLocation}
              onChange={(e) => setEditLocation(e.target.value)}
              placeholder="e.g. Mumbai, India"
              className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--input-bg)] px-4 py-2.5 text-sm text-[var(--text-primary)] transition-all focus:border-[#059669] focus:ring-2 focus:ring-[#059669]/30 focus:outline-none"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={() => setEditOpen(false)}
            className="flex-1 rounded-xl border border-[var(--border-color)] px-4 py-2.5 text-sm font-semibold text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-card-hover)] focus:ring-2 focus:ring-[#059669]/30"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !editName.trim()}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#059669] to-[#22c55e] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:shadow-md focus:ring-2 focus:ring-[#059669]/30 disabled:opacity-60"
          >
            {saving ? (
              <>
                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>{' '}
                Saving…
              </>
            ) : saveSuccess ? (
              <>
                <svg
                  aria-hidden="true"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>{' '}
                Saved!
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
