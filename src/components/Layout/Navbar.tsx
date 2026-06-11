import { NavLink, useNavigate, type NavLinkRenderProps } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../ui/ThemeToggle';
import { useTheme } from '../../context/ThemeContext';

interface NavItem {
  to: string;
  label: string;
  icon: ReactNode;
}

const NavIcon = ({ name, active }: { name: string; active: boolean }) => {
  const color = active ? 'currentColor' : '#64748b'; // slate-500

  switch (name) {
    case 'Dashboard':
      return (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke={color}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      );
    case 'Log':
      return (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke={color}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
          />
        </svg>
      );
    case 'Insights':
      return (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke={color}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      );
    case 'Challenges':
      return (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke={color}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
          />
        </svg>
      );
    case 'Profile':
      return (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke={color}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      );
    default:
      return (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke={color}>
          <circle cx="12" cy="12" r="10" strokeWidth="2" />
        </svg>
      );
  }
};

const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Dashboard', icon: <NavIcon name="Dashboard" active={false} /> },
  { to: '/log', label: 'Log', icon: <NavIcon name="Log" active={false} /> },
  { to: '/insights', label: 'Insights', icon: <NavIcon name="Insights" active={false} /> },
  { to: '/challenges', label: 'Challenges', icon: <NavIcon name="Challenges" active={false} /> },
  { to: '/profile', label: 'Profile', icon: <NavIcon name="Profile" active={false} /> },
];

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/auth');
  }

  // Only show sidebar if authenticated
  if (!currentUser) return null;

  return (
    <aside className="flex h-full w-64 flex-shrink-0 flex-col border-r border-[var(--border-color)] bg-[var(--bg-surface)] transition-colors duration-300">
      {/* Logo Area */}
      <button
        onClick={() => (window.location.href = '/')}
        className="flex cursor-pointer items-center gap-3 p-6 text-left transition-opacity hover:opacity-80 focus:outline-none"
      >
        <span className="text-2xl" aria-hidden="true">
          🌱
        </span>
        <span className="text-xl font-bold tracking-tight text-[var(--text-primary)]">
          TerraTrace
        </span>
      </button>

      {/* Main Navigation */}
      <nav className="mt-4 flex-1 space-y-1 px-4">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }: NavLinkRenderProps) =>
              `flex items-center gap-4 rounded-xl px-4 py-3 font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-[#eaf6ec] text-[#059669]'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-primary)]'
              } `
            }
          >
            {({ isActive }) => (
              <>
                <div className="flex items-center justify-center">
                  <NavIcon name={item.label} active={isActive} />
                </div>
                <span className="text-sm">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="space-y-1 p-4">
        <button
          onClick={toggleTheme}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          className="flex w-full items-center gap-4 rounded-xl px-4 py-3 font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-primary)]"
        >
          <ThemeToggle />
          <span className="text-sm">Theme</span>
        </button>

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-4 rounded-xl px-4 py-3 font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-primary)]"
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
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          <span className="text-sm">Logout</span>
        </button>

        {/* Decorative Callout Card */}
        <div className="relative mt-6 overflow-hidden rounded-2xl bg-[#f3fbf5] p-5">
          <div className="mb-3 text-2xl">🌱</div>
          <h4 className="mb-1 text-sm leading-tight font-bold text-[var(--text-primary)]">
            Every small step
            <br />
            counts.
          </h4>
          <p className="relative z-10 text-xs leading-relaxed text-[var(--text-secondary)]">
            Track today,
            <br />
            transform tomorrow.
          </p>
          <div className="absolute -right-4 -bottom-4 rotate-12 transform text-6xl opacity-50">
            🌿
          </div>
        </div>
      </div>
    </aside>
  );
}
