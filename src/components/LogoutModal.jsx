import { createPortal } from 'react-dom';
import { LogOut } from 'lucide-react';

export default function LogoutModal({ onClose }) {
  const handleLogout = () => {
    sessionStorage.clear();
    setTimeout(() => { alert('You have been signed out.'); onClose(); }, 100);
  };

  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center z-[9999] p-4"
      style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
        style={{ animation: 'slideUpModal .22s cubic-bezier(.32,.72,0,1)' }}
      >
        <style>{`
          @keyframes slideUpModal {
            from { opacity: 0; transform: translateY(24px) scale(0.97); }
            to   { opacity: 1; transform: translateY(0)    scale(1);    }
          }
        `}</style>

        {/* Icon + heading */}
        <div className="flex flex-col items-center px-6 pt-8 pb-5">
          <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-4">
            <LogOut size={28} className="text-red-500" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Sign out?</h3>
          <p className="text-sm text-gray-400 text-center mt-2 leading-relaxed">
            Your data will be saved and ready when you return.
          </p>
        </div>

        {/* User info */}
        <div className="mx-5 mb-5 flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
          <img
            src="https://ui-avatars.com/api/?name=Payaldurga+Paila&background=7c3aed&color=fff&size=40&bold=true&rounded=true"
            alt="avatar"
            className="w-10 h-10 rounded-full object-cover border-2 border-violet-100 dark:border-violet-900 shrink-0"
          />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">Payaldurga Paila</p>
            <p className="text-xs text-gray-400 truncate">payaldurgapaila@gmail.com</p>
          </div>
        </div>

        {/* Actions */}
        <div className="px-5 pb-6 flex flex-col gap-2.5">
          <button
            onClick={handleLogout}
            className="w-full py-3 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <LogOut size={15} /> Sign Out
          </button>
          <button
            onClick={onClose}
            className="w-full py-3 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 rounded-xl font-semibold text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
