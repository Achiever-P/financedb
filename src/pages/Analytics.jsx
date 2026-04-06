import { useState, useMemo, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Calendar, LayoutGrid, Plus, X, ChevronDown, TrendingUp, TrendingDown,
  ArrowLeftRight, Tag, Check, GripVertical, Eye, EyeOff, BarChart2,
  PieChart, Activity, DollarSign, Info,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';
import BalanceChart from '../components/BalanceChart';
import BudgetChart from '../components/BudgetChart';
import StatisticsChart from '../components/StatisticsChart';
import FloatingPopover from '../components/FloatingPopover';
import CurrencyPickerPopover, { CURR_LIST, CURRENCY_RATES, getCurrSym } from '../components/CurrencyPickerPopover';
import {
  BALANCE_TREND, BALANCE_BY_WEEK, BALANCE_BY_QUARTER, BALANCE_BY_YEAR,
  BUDGET_BY_MONTH, BUDGET_BY_QUARTER, BUDGET_BY_WEEK,
  CATEGORY_COLORS,
} from '../data/mockData';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Cell,
} from 'recharts';

/* ── Period picker ──────────────────────────────────────────────────────── */
const PERIODS = [
  { id: 'this_week',    label: 'This week'     },
  { id: 'this_month',  label: 'This month'    },
  { id: 'last_month',  label: 'Last month'    },
  { id: 'this_quarter',label: 'This quarter'  },
  { id: 'this_year',   label: 'This year'     },
  { id: 'custom',      label: 'Custom range…' },
];

function PeriodPicker({ triggerRef, period, onChange, onClose }) {
  const [cf, setCf] = useState('');
  const [ct, setCt] = useState('');
  return (
    <FloatingPopover triggerRef={triggerRef} onClose={onClose} align="left">
      <div className="py-2">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-4 py-1.5">Select period</p>
        {PERIODS.map(p => (
          <button key={p.id}
            onClick={() => { onChange(p.id); if (p.id !== 'custom') onClose(); }}
            className={`w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium transition-all
              ${period === p.id ? 'bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
            {p.label}
            {period === p.id && <Check size={13} className="text-violet-600" />}
          </button>
        ))}
        {period === 'custom' && (
          <div className="mx-3 mb-2 mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl flex flex-col gap-2 border-t border-gray-100 dark:border-gray-800">
            {[['From', cf, setCf], ['To', ct, setCt]].map(([lbl, val, set]) => (
              <label key={lbl} className="flex flex-col gap-1">
                <span className="text-[10px] font-semibold text-gray-400">{lbl}</span>
                <input type="date" value={val} onChange={e => set(e.target.value)}
                  className="text-xs border border-gray-200 dark:border-gray-700 rounded-lg px-2.5 py-1.5 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 outline-none focus:border-violet-500" />
              </label>
            ))}
            <button onClick={onClose}
              className="w-full py-2 bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold rounded-xl transition-all mt-1">
              Apply Range
            </button>
          </div>
        )}
      </div>
    </FloatingPopover>
  );
}

/* ── Metric picker ──────────────────────────────────────────────────────── */
const METRICS = [
  { id: 'balance', label: 'Total balance' },
  { id: 'income',  label: 'Income only'   },
  { id: 'expense', label: 'Expense only'  },
  { id: 'net',     label: 'Net cashflow'  },
];

function MetricPicker({ triggerRef, metric, onChange, onClose }) {
  return (
    <FloatingPopover triggerRef={triggerRef} onClose={onClose} align="right">
      <div className="py-2">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-4 py-1.5">Chart metric</p>
        {METRICS.map(m => (
          <button key={m.id}
            onClick={() => { onChange(m.id); onClose(); }}
            className={`w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium transition-all
              ${metric === m.id ? 'bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
            {m.label}
            {metric === m.id && <Check size={13} className="text-violet-600" />}
          </button>
        ))}
      </div>
    </FloatingPopover>
  );
}

/* ── Stat type picker ───────────────────────────────────────────────────── */
function StatTypePicker({ triggerRef, statType, onChange, onClose }) {
  return (
    <FloatingPopover triggerRef={triggerRef} onClose={onClose} align="right">
      <div className="py-2">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-4 py-1.5">View type</p>
        {['Expense', 'Income', 'Both'].map(t => (
          <button key={t}
            onClick={() => { onChange(t); onClose(); }}
            className={`w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium transition-all
              ${statType === t ? 'bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
            {t}
            {statType === t && <Check size={13} className="text-violet-600" />}
          </button>
        ))}
      </div>
    </FloatingPopover>
  );
}

/* ── Budget period picker ───────────────────────────────────────────────── */
const BUDGET_PERIODS = [
  { id: 'this_week',    label: 'This week'    },
  { id: 'this_month',  label: 'This month'   },
  { id: 'this_quarter',label: 'This quarter' },
  { id: 'this_year',   label: 'This year'    },
];

function BudgetPeriodPicker({ triggerRef, value, onChange, onClose }) {
  return (
    <FloatingPopover triggerRef={triggerRef} onClose={onClose} align="right">
      <div className="py-2">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-4 py-1.5">Period</p>
        {BUDGET_PERIODS.map(p => (
          <button key={p.id}
            onClick={() => { onChange(p.id); onClose(); }}
            className={`w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium transition-all
              ${value === p.id ? 'bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
            {p.label}
            {value === p.id && <Check size={13} className="text-violet-600" />}
          </button>
        ))}
      </div>
    </FloatingPopover>
  );
}

/* ── Manage Widgets modal ───────────────────────────────────────────────── */
const DEFAULT_WIDGETS = [
  { id: 'balance_card',  label: 'Total Balance Card',    Icon: DollarSign, visible: true,  locked: true  },
  { id: 'income_card',   label: 'Income Card',           Icon: TrendingUp, visible: true,  locked: false },
  { id: 'expense_card',  label: 'Expense Card',          Icon: TrendingDown,visible: true, locked: false },
  { id: 'balance_chart', label: 'Balance Overview Chart',Icon: Activity,   visible: true,  locked: false },
  { id: 'stats_chart',   label: 'Statistics Donut',      Icon: PieChart,   visible: true,  locked: false },
  { id: 'budget_chart',  label: 'Budget vs Expense Bar', Icon: BarChart2,  visible: true,  locked: false },
];

function ManageWidgets({ widgets, onChange, onClose }) {
  const [local, setLocal] = useState(widgets);
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[200] p-4"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md"
        style={{ animation: 'slideUp .2s ease' }}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white">Manage Widgets</h3>
            <p className="text-xs text-gray-400 mt-0.5">Toggle visibility of analytics widgets</p>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"><X size={15} /></button>
        </div>
        <div className="px-4 py-3 flex flex-col gap-1.5">
          {local.map(w => (
            <div key={w.id} className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${w.visible ? 'bg-gray-50 dark:bg-gray-800/50' : 'opacity-50'}`}>
              <GripVertical size={14} className="text-gray-300 cursor-grab" />
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${w.visible ? 'bg-violet-100 dark:bg-violet-900/40' : 'bg-gray-200 dark:bg-gray-700'}`}>
                <w.Icon size={14} className={w.visible ? 'text-violet-600' : 'text-gray-400'} />
              </div>
              <span className="flex-1 text-sm font-medium text-gray-700 dark:text-gray-300">{w.label}</span>
              {w.locked
                ? <span className="text-[10px] text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">Required</span>
                : <button onClick={() => setLocal(ws => ws.map(x => x.id === w.id ? { ...x, visible: !x.visible } : x))}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all
                      ${w.visible ? 'text-violet-600 hover:bg-violet-100 dark:hover:bg-violet-900/30' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                    {w.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
              }
            </div>
          ))}
        </div>
        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-2.5">
          <button onClick={onClose} className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-300 hover:border-violet-400 transition-all">Cancel</button>
          <button onClick={() => { onChange(local); onClose(); }}
            className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold transition-all hover:-translate-y-0.5 shadow-sm">Save Layout</button>
        </div>
      </div>
    </div>
  );
}

/* ── Add Widget modal ───────────────────────────────────────────────────── */
const WIDGET_TEMPLATES = [
  { id: 'cashflow', label: 'Cash Flow Chart',     Icon: Activity,       desc: 'Net income vs expenses over time' },
  { id: 'savings',  label: 'Savings Rate Meter',  Icon: TrendingUp,     desc: 'Visual savings rate gauge'        },
  { id: 'topcat',   label: 'Top Categories',      Icon: Tag,            desc: 'Highest-spend categories list'    },
  { id: 'txfeed',   label: 'Recent Transactions', Icon: ArrowLeftRight, desc: 'Live mini transaction feed'       },
];

function AddWidget({ onAdd, onClose }) {
  const [sel, setSel] = useState(null);
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[200] p-4"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md"
        style={{ animation: 'slideUp .2s ease' }}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white">Add New Widget</h3>
            <p className="text-xs text-gray-400 mt-0.5">Select a widget to add to your analytics</p>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"><X size={15} /></button>
        </div>
        <div className="px-4 py-4 grid grid-cols-2 gap-3">
          {WIDGET_TEMPLATES.map(w => (
            <button key={w.id} onClick={() => setSel(w.id)}
              className={`flex flex-col items-start gap-2.5 p-4 rounded-xl border-2 text-left transition-all
                ${sel === w.id ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20' : 'border-gray-100 dark:border-gray-800 hover:border-violet-200 hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${sel === w.id ? 'bg-violet-600' : 'bg-gray-100 dark:bg-gray-800'}`}>
                <w.Icon size={17} className={sel === w.id ? 'text-white' : 'text-gray-500'} />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 leading-tight">{w.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{w.desc}</p>
              </div>
              {sel === w.id && <span className="text-[10px] font-bold text-violet-600 bg-violet-100 dark:bg-violet-900/40 px-2 py-0.5 rounded-full">Selected ✓</span>}
            </button>
          ))}
        </div>
        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-2.5">
          <button onClick={onClose} className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-300 hover:border-violet-400 transition-all">Cancel</button>
          <button disabled={!sel} onClick={() => { if (sel) { onAdd(sel); onClose(); } }}
            className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all
              ${sel ? 'bg-violet-600 hover:bg-violet-700 text-white hover:-translate-y-0.5 shadow-sm' : 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'}`}>
            Add Widget
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Details side drawer ────────────────────────────────────────────────── */
function DetailsDrawer({ statType, currency, rate, transactions, onClose }) {
  const sym = getCurrSym(currency);
  const fmt = n => `${sym}${(n * rate).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const byCategory = useMemo(() => {
    const map = {};
    transactions.forEach(t => {
      const ok = statType === 'Both'
        || (statType === 'Expense' && t.type === 'expense')
        || (statType === 'Income'  && t.type === 'income');
      if (ok) map[t.category] = (map[t.category] || 0) + Math.abs(t.amount);
    });
    return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [transactions, statType]);

  const total = byCategory.reduce((s, d) => s + d.value, 0);

  const daily = useMemo(() => {
    const map = {};
    transactions.forEach(t => {
      const ok = statType === 'Both'
        || (statType === 'Expense' && t.type === 'expense')
        || (statType === 'Income'  && t.type === 'income');
      if (!ok) return;
      const key = t.date.slice(5);
      if (!map[key]) map[key] = { date: key, v: 0 };
      map[key].v += Math.abs(t.amount);
    });
    return Object.values(map).slice(-12).map(d => ({ ...d, v: d.v * rate }));
  }, [transactions, statType, rate]);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-end z-[200]"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white dark:bg-gray-900 h-[92vh] sm:h-screen w-full sm:w-[400px] flex flex-col shadow-2xl sm:rounded-l-3xl rounded-t-3xl sm:rounded-tr-none overflow-hidden"
        style={{ animation: 'slideInRight .25s ease' }}>

        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-800 shrink-0">
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white text-lg">{statType} Details</h3>
            <p className="text-xs text-gray-400 mt-0.5">Full breakdown · {currency}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all">
            <X size={15} />
          </button>
        </div>

        {/* Hero */}
        <div className="px-6 py-5 bg-gradient-to-br from-violet-600 to-violet-700 text-white shrink-0">
          <p className="text-sm text-violet-200 font-medium mb-1">Total {statType}</p>
          <p className="text-4xl font-bold font-mono tracking-tight">{fmt(total)}</p>
          <div className="flex gap-4 mt-3 text-xs text-violet-200">
            <span>{byCategory.length} categories</span>
            <span>{transactions.length} transactions</span>
          </div>
        </div>

        {/* Mini chart */}
        <div className="px-4 pt-4 pb-2 border-b border-gray-50 dark:border-gray-800 shrink-0">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 px-2">Daily Activity</p>
          <div className="h-[90px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={daily} margin={{ left: -24, right: 4, top: 4, bottom: 0 }}>
                <CartesianGrid strokeDasharray="4 4" stroke="#f3f4f6" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 8, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 8, fill: '#9ca3af' }} axisLine={false} tickLine={false}
                  tickFormatter={v => `${sym}${(v / 1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 10, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,.12)' }}
                  formatter={v => [`${sym}${v.toFixed(2)}`, '']} />
                <Bar dataKey="v" radius={[4, 4, 0, 0]} maxBarSize={16}>
                  {daily.map((_, i) => <Cell key={i} fill={i === daily.length - 1 ? '#7c3aed' : '#c4b5fd'} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category list */}
        <div className="flex-1 overflow-y-auto px-4 py-3">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 px-2">By Category</p>
          {byCategory.length === 0 && (
            <div className="text-center py-10 text-gray-400 text-sm">No data for this view</div>
          )}
          {byCategory.map((cat, i) => {
            const pct   = total > 0 ? (cat.value / total * 100) : 0;
            const color = CATEGORY_COLORS[cat.name] || '#8b5cf6';
            return (
              <div key={i} className="px-3 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 mb-1 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ background: color }} />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{cat.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold font-mono text-gray-800 dark:text-gray-200">{fmt(cat.value)}</span>
                    <span className="text-xs text-gray-400 ml-1.5">{pct.toFixed(1)}%</span>
                  </div>
                </div>
                <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${pct}%`, background: color }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ── Toast ─────────────────────────────────────────────────────────────── */
function Toast({ msg }) {
  return createPortal(
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[300] flex items-center gap-2.5 px-5 py-3 rounded-2xl shadow-2xl bg-gray-900 text-white text-sm font-semibold"
      style={{ animation: 'slideUp .2s ease' }}>
      <Check size={15} className="text-violet-400" /> {msg}
    </div>,
    document.body
  );
}

/* ── Small dropdown trigger button ─────────────────────────────────────── */
function DropBtn({ btnRef, open, onClick, children }) {
  return (
    <button ref={btnRef} onClick={onClick}
      className={`flex items-center gap-1.5 text-xs border rounded-lg px-2.5 py-1.5 font-medium transition-all
        ${open
          ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-400'
          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:border-violet-400 hover:text-violet-600'}`}>
      {children}
      <ChevronDown size={10} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
    </button>
  );
}

/* ── MAIN ───────────────────────────────────────────────────────────────── */
export default function Analytics({ onSearch, onNotif, onProfile, onMenu }) {
  const { state } = useApp();

  const [period,    setPeriod]    = useState('this_month');
  const [currency,  setCurrency]  = useState('USD');
  const [metric,    setMetric]    = useState('balance');
  const [statType,  setStatType]  = useState('Expense');
  const [budgetPer, setBudgetPer] = useState('this_year');
  const [widgets,   setWidgets]   = useState(DEFAULT_WIDGETS);
  const [addedList, setAddedList] = useState([]);
  const [pop,       setPop]       = useState(null);
  const [modal,     setModal]     = useState(null);
  const [toast,     setToast]     = useState(null);

  // Trigger refs for each popover
  const rPeriod    = useRef(); const rCurrBal = useRef();
  const rCurrInc   = useRef(); const rCurrExp = useRef();
  const rMetric    = useRef(); const rStat    = useRef();
  const rBudget    = useRef();

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(null), 2600); };
  const openPop   = id  => setPop(p => p === id ? null : id);

  const rate = CURRENCY_RATES[currency] || 1;
  const sym  = getCurrSym(currency);
  const fmt  = n => `${sym}${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const { income, expense, balance, incomeTx, expenseTx, incomeCats, expenseCats } = useMemo(() => {
    const txns = state.transactions;
    const inc  = txns.filter(t => t.type === 'income');
    const exp  = txns.filter(t => t.type === 'expense');
    return {
      income:     inc.reduce((s, t) => s + t.amount, 0) * rate,
      expense:    Math.abs(exp.reduce((s, t) => s + t.amount, 0)) * rate,
      balance:    (inc.reduce((s, t) => s + t.amount, 0) + exp.reduce((s, t) => s + t.amount, 0)) * rate,
      incomeTx:   inc.length,  expenseTx:  exp.length,
      incomeCats: [...new Set(inc.map(t => t.category))].length,
      expenseCats:[...new Set(exp.map(t => t.category))].length,
    };
  }, [state.transactions, rate]);

  const chartData  = period === 'this_week' ? BALANCE_BY_WEEK : period === 'this_quarter' ? BALANCE_BY_QUARTER : period === 'this_year' ? BALANCE_BY_YEAR : BALANCE_TREND;
  const budgetData = budgetPer === 'this_week' ? BUDGET_BY_WEEK : budgetPer === 'this_quarter' ? BUDGET_BY_QUARTER : BUDGET_BY_MONTH;

  const periodLabel = PERIODS.find(p => p.id === period)?.label || 'This month';
  const metricLabel = METRICS.find(m => m.id === metric)?.label || 'Total balance';
  const budgetLabel = BUDGET_PERIODS.find(p => p.id === budgetPer)?.label || 'This year';

  const isVis = id => widgets.find(w => w.id === id)?.visible !== false;

  const handleCurrency = (c) => { setCurrency(c); showToast(`Currency → ${c}`); };

  return (
    <div className="pb-10">
      <style>{`
        @keyframes slideUp       { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideInRight  { from{opacity:0;transform:translateX(40px)} to{opacity:1;transform:translateX(0)} }
      `}</style>

      <Header title="Analytics" subtitle="Detailed overview of your financial situation"
        onSearch={onSearch} onNotif={onNotif} onProfile={onProfile} onMenu={onMenu}/>

      {/* ── Toolbar ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 sm:px-6 lg:px-8 pt-4 sm:pt-5 gap-3">
        <div className="relative">
          <button ref={rPeriod} onClick={() => openPop('period')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-sm font-medium transition-all
              ${pop === 'period' ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-400' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-900 hover:border-violet-400 hover:text-violet-600'}`}>
            <Calendar size={14} /> {periodLabel}
            <ChevronDown size={12} className={`transition-transform ${pop === 'period' ? 'rotate-180' : ''}`} />
          </button>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setModal('manage')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-900 hover:border-violet-400 hover:text-violet-600 transition-all">
            <LayoutGrid size={14} /> Manage widgets
          </button>
          <button onClick={() => setModal('addwidget')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold shadow-sm hover:shadow-violet-200 dark:hover:shadow-violet-900/40 hover:-translate-y-0.5 transition-all">
            <Plus size={14} /> Add new widget
          </button>
        </div>
      </div>

      {/* Added widget notice */}
      {addedList.length > 0 && (
        <div className="mx-8 mt-3 p-3 bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800 rounded-xl flex items-center justify-between">
          <span className="text-sm text-violet-700 dark:text-violet-300 flex items-center gap-2">
            <Info size={14} /> Added: {addedList.map(id => WIDGET_TEMPLATES.find(t => t.id === id)?.label).join(', ')}
          </span>
          <button onClick={() => setAddedList([])} className="text-violet-400 hover:text-violet-600"><X size={13} /></button>
        </div>
      )}

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 px-4 sm:px-6 lg:px-8 pt-4 sm:pt-5">
        {isVis('balance_card') && (
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Total balance</span>
              <DropBtn btnRef={rCurrBal} open={pop === 'currBal'} onClick={() => openPop('currBal')}>
                {currency}
              </DropBtn>
            </div>
            <p className="text-2xl sm:text-[28px] font-bold font-mono text-gray-900 dark:text-white tracking-tight mb-3">{fmt(balance)}</p>
            <div className="flex items-center gap-3 flex-wrap mb-2">
              <span className="flex items-center gap-1 text-xs font-semibold text-emerald-500"><TrendingUp size={11} />↑ 12.1%</span>
              <span className="flex items-center gap-1 text-xs text-gray-400"><ArrowLeftRight size={10} />{incomeTx + expenseTx} transactions</span>
              <span className="flex items-center gap-1 text-xs text-gray-400"><Tag size={10} />{incomeCats + expenseCats} categories</span>
            </div>
            <p className="text-xs text-gray-400">You have extra <strong className="text-gray-700 dark:text-gray-300">{fmt(Math.abs(balance * .12))}</strong> vs last month</p>
          </div>
        )}

        {isVis('income_card') && (
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Income</span>
              <DropBtn btnRef={rCurrInc} open={pop === 'currInc'} onClick={() => openPop('currInc')}>
                {currency}
              </DropBtn>
            </div>
            <p className="text-2xl sm:text-[28px] font-bold font-mono text-gray-900 dark:text-white tracking-tight mb-3">{fmt(income)}</p>
            <div className="flex items-center gap-3 flex-wrap mb-2">
              <span className="flex items-center gap-1 text-xs font-semibold text-emerald-500"><TrendingUp size={11} />↑ 6.3%</span>
              <span className="flex items-center gap-1 text-xs text-gray-400"><ArrowLeftRight size={10} />{incomeTx} transactions</span>
              <span className="flex items-center gap-1 text-xs text-gray-400"><Tag size={10} />{incomeCats} categories</span>
            </div>
            <p className="text-xs text-gray-400">You earn extra <strong className="text-gray-700 dark:text-gray-300">{fmt(500 * rate)}</strong> vs last month</p>
          </div>
        )}

        {isVis('expense_card') && (
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Expense</span>
              <DropBtn btnRef={rCurrExp} open={pop === 'currExp'} onClick={() => openPop('currExp')}>
                {currency}
              </DropBtn>
            </div>
            <p className="text-2xl sm:text-[28px] font-bold font-mono text-gray-900 dark:text-white tracking-tight mb-3">{fmt(expense)}</p>
            <div className="flex items-center gap-3 flex-wrap mb-2">
              <span className="flex items-center gap-1 text-xs font-semibold text-red-500"><TrendingDown size={11} />↑ 2.4%</span>
              <span className="flex items-center gap-1 text-xs text-gray-400"><ArrowLeftRight size={10} />{expenseTx} transactions</span>
              <span className="flex items-center gap-1 text-xs text-gray-400"><Tag size={10} />{expenseCats} categories</span>
            </div>
            <p className="text-xs text-gray-400">You spent extra <strong className="text-gray-700 dark:text-gray-300">{fmt(1222 * rate)}</strong> vs last month</p>
          </div>
        )}
      </div>

      {/* ── Charts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4 px-4 sm:px-6 lg:px-8 pt-4">

        {isVis('balance_chart') && (
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-3 flex-wrap mb-4">
              <span className="text-[15px] font-semibold text-gray-900 dark:text-white flex-1">Total balance overview</span>
              <div className="flex items-center gap-3 text-xs text-gray-400">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-violet-600 inline-block" />This period</span>
                <span className="flex items-center gap-1.5"><span className="w-6 border-t-2 border-dashed border-violet-300 inline-block" />Previous</span>
              </div>
              <DropBtn btnRef={rMetric} open={pop === 'metric'} onClick={() => openPop('metric')}>
                {metricLabel}
              </DropBtn>
            </div>
            <BalanceChart data={chartData} />
            <p className="text-[11px] text-gray-400 text-center mt-2">
              <span className="font-medium text-gray-600 dark:text-gray-400">{periodLabel}</span>
              {' · '}
              <span className="text-violet-600 font-medium">{metricLabel}</span>
            </p>
          </div>
        )}

        {isVis('stats_chart') && (
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm row-span-2">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[15px] font-semibold text-gray-900 dark:text-white flex-1">Statistics</span>
              <DropBtn btnRef={rStat} open={pop === 'stat'} onClick={() => openPop('stat')}>
                {statType}
              </DropBtn>
              <button onClick={() => setModal('details')}
                className="text-xs border border-gray-200 dark:border-gray-700 rounded-lg px-2.5 py-1.5 text-violet-600 font-semibold hover:bg-violet-50 dark:hover:bg-violet-900/20 hover:border-violet-400 transition-all">
                Details ›
              </button>
            </div>
            <StatisticsChart />
          </div>
        )}

        {isVis('budget_chart') && (
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-3 flex-wrap mb-3">
              <span className="text-[15px] font-semibold text-gray-900 dark:text-white flex-1">Budget vs Expense</span>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-violet-600 inline-block" />Expense</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-violet-200 inline-block" />Budget</span>
              </div>
              <DropBtn btnRef={rBudget} open={pop === 'budget'} onClick={() => openPop('budget')}>
                {budgetLabel}
              </DropBtn>
            </div>
            <BudgetChart data={budgetData} />
          </div>
        )}
      </div>

      {/* ── Floating Popovers (render in portal via FloatingPopover) ── */}
      {pop === 'period'  && <PeriodPicker    triggerRef={rPeriod}  period={period}    onChange={p => { setPeriod(p); if (p !== 'custom') { setPop(null); showToast(PERIODS.find(x => x.id === p)?.label || ''); } }} onClose={() => setPop(null)} />}
      {pop === 'currBal' && <CurrencyPickerPopover triggerRef={rCurrBal} currency={currency} onChange={handleCurrency} onClose={() => setPop(null)} />}
      {pop === 'currInc' && <CurrencyPickerPopover triggerRef={rCurrInc} currency={currency} onChange={handleCurrency} onClose={() => setPop(null)} />}
      {pop === 'currExp' && <CurrencyPickerPopover triggerRef={rCurrExp} currency={currency} onChange={handleCurrency} onClose={() => setPop(null)} />}
      {pop === 'metric'  && <MetricPicker      triggerRef={rMetric}  metric={metric}    onChange={m => { setMetric(m);    setPop(null); showToast(METRICS.find(x => x.id === m)?.label || ''); }} onClose={() => setPop(null)} />}
      {pop === 'stat'    && <StatTypePicker    triggerRef={rStat}    statType={statType} onChange={t => { setStatType(t);  setPop(null); showToast(`View: ${t}`); }} onClose={() => setPop(null)} />}
      {pop === 'budget'  && <BudgetPeriodPicker triggerRef={rBudget} value={budgetPer}  onChange={p => { setBudgetPer(p); setPop(null); showToast(BUDGET_PERIODS.find(x => x.id === p)?.label || ''); }} onClose={() => setPop(null)} />}

      {/* ── Modals ── */}
      {modal === 'manage'    && <ManageWidgets widgets={widgets} onChange={w => { setWidgets(w); setModal(null); showToast('Widget layout saved'); }} onClose={() => setModal(null)} />}
      {modal === 'addwidget' && <AddWidget onAdd={id => { setAddedList(a => [...a, id]); setModal(null); showToast(`Added: ${WIDGET_TEMPLATES.find(t => t.id === id)?.label}`); }} onClose={() => setModal(null)} />}
      {modal === 'details'   && <DetailsDrawer statType={statType} currency={currency} rate={rate} transactions={state.transactions} onClose={() => setModal(null)} />}

      {toast && <Toast msg={toast} />}
    </div>
  );
}
