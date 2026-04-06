import { useState } from 'react';
import { LayoutDashboard, ArrowLeftRight, Target, PieChart, BarChart2,
         Settings, HelpCircle, LogOut, Sun, Moon, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import LogoutModal from './LogoutModal';

const NAV = [
  { id: 'dashboard',    label: 'Dashboard',    Icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions', Icon: ArrowLeftRight   },
  { id: 'goals',        label: 'Goals',        Icon: Target           },
  { id: 'budget',       label: 'Budget',       Icon: PieChart         },
  { id: 'analytics',   label: 'Analytics',    Icon: BarChart2        },
  { id: 'settings',    label: 'Settings',     Icon: Settings         },
];

const FinsetLogo = () => (
  <svg width="26" height="30" viewBox="0 0 130 150" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
    <polygon points="15,0  115,0  128,20  15,20" fill="#7c3aed"/>
    <rect x="0" y="0" width="28" height="150" fill="#7c3aed"/>
    <polygon points="28,60  85,60  98,80  28,80" fill="#7c3aed"/>
    <polygon points="0,90  28,90  0,120" fill="#5b21b6"/>
  </svg>
);

export default function Sidebar({ onClose }) {
  const { state, dispatch } = useApp();
  const [showLogout, setShowLogout] = useState(false);
  const set = (page) => dispatch({ type: 'SET_PAGE', v: page });

  return (
    <>
      <aside className="w-64 lg:w-[200px] h-screen bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 flex flex-col py-4 lg:py-5">
        {/* Logo row */}
        <div className="flex items-center justify-between px-4 lg:px-5 pb-4 lg:pb-5 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2.5">
            <FinsetLogo />
            <span className="font-extrabold text-[16px] tracking-tight text-gray-900 dark:text-white leading-none"
              style={{ fontFamily: 'DM Sans, sans-serif', letterSpacing: '-0.3px' }}>
              Finset
            </span>
          </div>
          {/* Close button — mobile only */}
          <button onClick={onClose}
            className="lg:hidden w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
            <X size={16} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 lg:px-3 pt-3 flex flex-col gap-0.5 overflow-y-auto">
          {NAV.map(({ id, label, Icon }) => {
            const active = state.page === id;
            return (
              <button key={id} onClick={() => set(id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150
                  ${active
                    ? 'bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-800 dark:hover:text-gray-200'}`}>
                <Icon size={16} strokeWidth={active ? 2.2 : 1.8} />
                {label}
              </button>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="px-2 lg:px-3 pt-3 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-0.5">
          <button onClick={() => set('help')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150
              ${state.page === 'help'
                ? 'bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-800 dark:hover:text-gray-200'}`}>
            <HelpCircle size={16} strokeWidth={state.page === 'help' ? 2.2 : 1.8} /> Help
          </button>

          <button onClick={() => setShowLogout(true)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-gray-500 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-all duration-150">
            <LogOut size={16} strokeWidth={1.8} /> Log out
          </button>

          {/* Theme toggle */}
          <div className="flex gap-1 px-3 pt-2 pb-1">
            {[['light', Sun, '☀ Light'], ['dark', Moon, '🌙 Dark']].map(([t, Icon, lbl]) => (
              <button key={t} onClick={() => dispatch({ type: 'SET_THEME', v: t })}
                className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-medium transition-all
                  ${state.theme === t
                    ? 'bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-400'
                    : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                <Icon size={12} />
                <span className="hidden lg:inline">{t === 'light' ? 'Light' : 'Dark'}</span>
              </button>
            ))}
          </div>
        </div>
      </aside>

      {showLogout && <LogoutModal onClose={() => setShowLogout(false)} />}
    </>
  );
}
