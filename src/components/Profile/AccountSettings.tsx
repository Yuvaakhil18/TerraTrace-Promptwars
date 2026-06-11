import type { ReactNode } from 'react';
import type { User } from 'firebase/auth';

export type SettingsTab = 'personal' | 'notifications' | 'privacy' | 'connected';

export const TABS: { id: SettingsTab; label: string; icon: ReactNode }[] = [
  {
    id: 'personal',
    label: 'Personal Information',
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    ),
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
        />
      </svg>
    ),
  },
  {
    id: 'privacy',
    label: 'Privacy & Security',
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
    ),
  },
  {
    id: 'connected',
    label: 'Connected Accounts',
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
        />
      </svg>
    ),
  },
];

interface AccountSettingsProps {
  activeTab: SettingsTab;
  setActiveTab: (tab: SettingsTab) => void;
  displayName: string;
  email: string;
  location: string;
  joinedDate: string;
  currentUser: User | null;
}

export default function AccountSettings({
  activeTab,
  setActiveTab,
  displayName,
  email,
  location,
  joinedDate,
  currentUser,
}: AccountSettingsProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 p-6">
        <h3 className="text-sm font-bold text-slate-900">Account Settings</h3>
      </div>
      <div className="flex flex-col md:flex-row">
        {/* Left Sidebar Tabs */}
        <div className="flex flex-row gap-1 overflow-x-auto border-b border-slate-100 p-4 md:w-56 md:flex-col md:overflow-visible md:border-r md:border-b-0">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-[#eaf6ec] text-[#059669]'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Right Content */}
        <div className="flex-1 p-6">
          {activeTab === 'personal' && (
            <div className="space-y-1 divide-y divide-slate-50">
              {[
                { label: 'Full Name', value: displayName },
                { label: 'Email Address', value: email },
                { label: 'Location', value: location },
                { label: 'Member Since', value: joinedDate },
              ].map((field) => (
                <div key={field.label} className="group flex items-center justify-between py-3">
                  <div>
                    <p className="text-xs font-medium text-slate-400">{field.label}</p>
                    <p className="text-sm font-semibold text-slate-900">{field.value}</p>
                  </div>
                  <svg
                    className="h-4 w-4 text-slate-300 transition-colors group-hover:text-slate-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              ))}
            </div>
          )}
          {activeTab === 'notifications' && (
            <div className="space-y-4">
              {[
                {
                  label: 'Activity Reminders',
                  desc: 'Daily reminder to log your activities',
                  on: true,
                },
                {
                  label: 'Weekly Summary',
                  desc: 'Get a weekly summary of your footprint',
                  on: true,
                },
                {
                  label: 'Challenge Alerts',
                  desc: 'Be notified when new challenges are available',
                  on: false,
                },
                { label: 'AI Insights', desc: 'Receive personalised tips from EcoCoach', on: true },
              ].map((n) => (
                <div key={n.label} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{n.label}</p>
                    <p className="text-xs text-slate-500">{n.desc}</p>
                  </div>
                  <div
                    className={`relative h-5 w-10 cursor-pointer rounded-full transition-colors ${n.on ? 'bg-[#059669]' : 'bg-slate-200'}`}
                  >
                    <div
                      className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${n.on ? 'right-0.5' : 'left-0.5'}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
          {activeTab === 'privacy' && (
            <div className="space-y-3">
              {[
                { label: 'Change Password', desc: 'Update your account password' },
                { label: 'Two-Factor Authentication', desc: 'Add an extra layer of security' },
                { label: 'Download My Data', desc: 'Export all your emission records' },
                { label: 'Delete Account', desc: 'Permanently remove your account', danger: true },
              ].map((item) => (
                <div
                  key={item.label}
                  className={`flex items-center justify-between rounded-xl border p-3 ${item.danger ? 'border-rose-100 hover:bg-rose-50' : 'border-slate-100 hover:bg-slate-50'} group cursor-pointer transition-colors`}
                >
                  <div>
                    <p
                      className={`text-sm font-semibold ${item.danger ? 'text-rose-600' : 'text-slate-900'}`}
                    >
                      {item.label}
                    </p>
                    <p className="text-xs text-slate-500">{item.desc}</p>
                  </div>
                  <svg
                    className="h-4 w-4 text-slate-300 transition-colors group-hover:text-slate-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              ))}
            </div>
          )}
          {activeTab === 'connected' && (
            <div className="space-y-3">
              {[
                {
                  icon: '🔵',
                  label: 'Google',
                  desc: currentUser?.providerData?.find((p) => p.providerId === 'google.com')
                    ? 'Connected'
                    : 'Not connected',
                  connected: !!currentUser?.providerData?.find(
                    (p) => p.providerId === 'google.com',
                  ),
                },
                { icon: '📘', label: 'Facebook', desc: 'Not connected', connected: false },
                { icon: '🍎', label: 'Apple', desc: 'Not connected', connected: false },
              ].map((acc) => (
                <div
                  key={acc.label}
                  className="flex items-center justify-between rounded-xl border border-slate-100 p-3 transition-colors hover:bg-slate-50"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{acc.icon}</span>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{acc.label}</p>
                      <p className="text-xs text-slate-500">{acc.desc}</p>
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${acc.connected ? 'bg-[#eaf6ec] text-[#059669]' : 'bg-slate-100 text-slate-400'}`}
                  >
                    {acc.connected ? '✓ Connected' : 'Connect'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
