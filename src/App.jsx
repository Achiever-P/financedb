import { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import Analytics         from './pages/Analytics';
import Transactions      from './pages/Transactions';
import Dashboard         from './pages/Dashboard';
import Goals             from './pages/Goals';
import Budget            from './pages/Budget';
import SettingsPage      from './pages/SettingsPage';
import HelpPage          from './pages/HelpPage';
import SearchPage        from './pages/SearchPage';
import NotificationsPage from './pages/NotificationsPage';
import ProfilePage       from './pages/ProfilePage';
import './index.css';

function AppContent() {
  const { state } = useApp();
  const [overlay, setOverlay]     = useState(null);
  const [sidebarOpen, setSidebar] = useState(false);

  useEffect(() => {
    const h = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOverlay(v => v === 'search' ? null : 'search');
      }
      if (e.key === 'Escape') { setOverlay(null); setSidebar(false); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  // Auto-close mobile sidebar on page change
  useEffect(() => { setSidebar(false); }, [state.page]);

  const op = {
    onSearch:  () => setOverlay(v => v === 'search'  ? null : 'search'),
    onNotif:   () => setOverlay(v => v === 'notif'   ? null : 'notif'),
    onProfile: () => setOverlay(v => v === 'profile' ? null : 'profile'),
    onMenu:    () => setSidebar(v => !v),
  };

  const pages = {
    analytics:    <Analytics    {...op} />,
    transactions: <Transactions {...op} />,
    goals:        <Goals        {...op} />,
    budget:       <Budget       {...op} />,
    dashboard:    <Dashboard    {...op} />,
    settings:     <SettingsPage {...op} />,
    help:         <HelpPage     {...op} />,
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950 font-sans">

      {/* ── Mobile sidebar backdrop ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebar(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar: drawer on mobile, static on lg+ ── */}
      <div className={`
        fixed inset-y-0 left-0 z-50
        lg:relative lg:z-auto lg:translate-x-0
        transition-transform duration-300 ease-in-out will-change-transform
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar onClose={() => setSidebar(false)} />
      </div>

      {/* ── Main content ── */}
      <main className="flex-1 min-w-0 overflow-y-auto h-screen scrollbar-thin pb-16 lg:pb-0">
        {pages[state.page] ?? <Analytics {...op} />}
      </main>

      {/* ── Mobile bottom navigation ── */}
      <BottomNav />

      {/* ── Global overlays ── */}
      {overlay === 'search'  && <SearchPage        onClose={() => setOverlay(null)} />}
      {overlay === 'notif'   && <NotificationsPage onClose={() => setOverlay(null)} />}
      {overlay === 'profile' && <ProfilePage       onClose={() => setOverlay(null)} />}
    </div>
  );
}

export default function App() {
  return <AppProvider><AppContent /></AppProvider>;
}
