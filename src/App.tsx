import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import Spinner from './components/ui/Spinner';
import AuthGuard from './components/Layout/AuthGuard';

const AuthPage = lazy(() => import('./pages/AuthPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const LogPage = lazy(() => import('./pages/LogPage'));
const InsightsPage = lazy(() => import('./pages/InsightsPage'));
const ChallengePage = lazy(() => import('./pages/ChallengePage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen overflow-hidden bg-[var(--bg-background)] transition-colors duration-300">
        {/* Sidebar */}
        <Navbar />

        {/* Main Content Area */}
        <main id="main-content" tabIndex={-1} className="flex-1 overflow-y-auto p-4 sm:p-8">
          <Suspense
            fallback={
              <div className="flex h-full items-center justify-center">
                <Spinner label="Loading page..." />
              </div>
            }
          >
            <Routes>
              {/* Public route */}
              <Route path="/auth" element={<AuthPage />} />

              {/* Protected routes */}
              <Route
                path="/"
                element={
                  <AuthGuard>
                    <DashboardPage />
                  </AuthGuard>
                }
              />
              <Route
                path="/log"
                element={
                  <AuthGuard>
                    <LogPage />
                  </AuthGuard>
                }
              />
              <Route
                path="/insights"
                element={
                  <AuthGuard>
                    <InsightsPage />
                  </AuthGuard>
                }
              />
              <Route
                path="/challenges"
                element={
                  <AuthGuard>
                    <ChallengePage />
                  </AuthGuard>
                }
              />
              <Route
                path="/profile"
                element={
                  <AuthGuard>
                    <ProfilePage />
                  </AuthGuard>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </BrowserRouter>
  );
}
