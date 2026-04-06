import { Search, Bell, Menu } from 'lucide-react';

export default function Header({ title, subtitle, onSearch, onNotif, onProfile, onMenu }) {
  return (
    <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 pt-5 lg:pt-7 pb-0 gap-3 flex-wrap">
      {/* Left: hamburger (mobile) + title */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Hamburger — mobile only */}
        <button onClick={onMenu}
          className="lg:hidden w-9 h-9 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex items-center justify-center text-gray-500 hover:border-violet-400 hover:text-violet-600 transition-all shrink-0">
          <Menu size={17} />
        </button>
        <div className="min-w-0">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white leading-tight truncate">{title}</h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-0.5 hidden sm:block truncate">{subtitle}</p>
        </div>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2 shrink-0">
        <button onClick={onSearch}
          className="w-9 h-9 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex items-center justify-center text-gray-400 hover:border-violet-400 hover:text-violet-600 transition-all"
          title="Search (Ctrl+K)">
          <Search size={15} />
        </button>

        <button onClick={onNotif}
          className="relative w-9 h-9 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex items-center justify-center text-gray-400 hover:border-violet-400 hover:text-violet-600 transition-all"
          title="Notifications">
          <Bell size={15} />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">3</span>
        </button>

        <button onClick={onProfile} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <img
            src="https://ui-avatars.com/api/?name=Payaldurga+Paila&background=7c3aed&color=fff&size=36&bold=true&rounded=true"
            alt="avatar"
            className="w-9 h-9 rounded-full object-cover border-2 border-violet-100 dark:border-violet-900 shrink-0"
          />
          <div className="hidden md:block text-left">
            <p className="text-[13px] font-semibold text-gray-800 dark:text-white leading-tight whitespace-nowrap">Payaldurga Paila</p>
            <p className="text-[11px] text-gray-400 whitespace-nowrap">payaldurgapaila@gmail.com</p>
          </div>
        </button>
      </div>
    </div>
  );
}
