import { LayoutDashboard, ArrowLeftRight, Target, BarChart2, PieChart } from 'lucide-react';
import { useApp } from '../context/AppContext';

const BOTTOM_NAV = [
  { id: 'dashboard',    Icon: LayoutDashboard, label: 'Home'     },
  { id: 'transactions', Icon: ArrowLeftRight,   label: 'Txns'     },
  { id: 'analytics',   Icon: BarChart2,         label: 'Analytics' },
  { id: 'goals',        Icon: Target,            label: 'Goals'    },
  { id: 'budget',       Icon: PieChart,          label: 'Budget'   },
];

export default function BottomNav() {
  const { state, dispatch } = useApp();
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 z-30 safe-bottom">
      <div className="flex items-center justify-around px-2 py-1">
        {BOTTOM_NAV.map(({ id, Icon, label }) => {
          const active = state.page === id;
          return (
            <button key={id}
              onClick={() => dispatch({ type: 'SET_PAGE', v: id })}
              className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all min-w-[52px]
                ${active ? 'text-violet-700 dark:text-violet-400' : 'text-gray-400 dark:text-gray-500'}`}>
              <Icon size={20} strokeWidth={active ? 2.2 : 1.8} />
              <span className={`text-[10px] font-semibold ${active ? 'text-violet-700 dark:text-violet-400' : 'text-gray-400'}`}>
                {label}
              </span>
              {active && <span className="w-1 h-1 rounded-full bg-violet-600 mt-0.5" />}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
