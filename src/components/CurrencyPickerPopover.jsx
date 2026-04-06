import { Check } from 'lucide-react';
import FloatingPopover from './FloatingPopover';

export const CURR_LIST = [
  { code: 'USD', sym: '$',  name: 'US Dollar'        },
  { code: 'EUR', sym: '€',  name: 'Euro'             },
  { code: 'GBP', sym: '£',  name: 'British Pound'    },
  { code: 'INR', sym: '₹',  name: 'Indian Rupee'     },
  { code: 'JPY', sym: '¥',  name: 'Japanese Yen'     },
  { code: 'CAD', sym: 'C$', name: 'Canadian Dollar'  },
  { code: 'AUD', sym: 'A$', name: 'Australian Dollar' },
];

export const CURRENCY_RATES = {
  USD: 1, EUR: 0.92, GBP: 0.79,
  INR: 83.5, JPY: 149.2, CAD: 1.36, AUD: 1.53,
};

export function getCurrSym(code) {
  return CURR_LIST.find(c => c.code === code)?.sym || '$';
}

export default function CurrencyPickerPopover({ triggerRef, currency, onChange, onClose }) {
  return (
    <FloatingPopover triggerRef={triggerRef} onClose={onClose} align="right">
      <div className="py-2">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-4 py-1.5">
          Select Currency
        </p>
        {CURR_LIST.map(c => (
          <button
            key={c.code}
            onClick={() => { onChange(c.code); onClose(); }}
            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-all
              ${currency === c.code
                ? 'bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
          >
            {/* Symbol badge */}
            <span className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-700 dark:text-gray-300 shrink-0">
              {c.sym}
            </span>
            <span className="font-semibold w-10 shrink-0">{c.code}</span>
            <span className="text-xs text-gray-400 flex-1 text-left">{c.name}</span>
            {currency === c.code && <Check size={13} className="text-violet-600 shrink-0" />}
          </button>
        ))}
      </div>
    </FloatingPopover>
  );
}
