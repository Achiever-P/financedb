import { useMemo, useRef, useState } from 'react';
import { TrendingUp, TrendingDown, ArrowLeftRight, Tag, ChevronDown } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';
import BalanceChart from '../components/BalanceChart';
import CurrencyPickerPopover, { CURRENCY_RATES, getCurrSym } from '../components/CurrencyPickerPopover';

function DropBtn({ btnRef, open, onClick, label }) {
  return (
    <button ref={btnRef} onClick={onClick}
      className={`flex items-center gap-1 text-xs border rounded-lg px-2 py-0.5 font-medium transition-all
        ${open ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-400'
               : 'border-gray-200 dark:border-gray-700 text-gray-400 hover:border-violet-400 hover:text-violet-600'}`}>
      {label} <ChevronDown size={9} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
    </button>
  );
}

export default function Dashboard({ onSearch, onNotif, onProfile, onMenu }) {
  const { state } = useApp();
  const [currency, setCurrency] = useState('USD');
  const [pop, setPop] = useState(null);
  const rBal = useRef(); const rInc = useRef(); const rExp = useRef();

  const rate = CURRENCY_RATES[currency] || 1;
  const sym  = getCurrSym(currency);
  const fmt  = n => `${sym}${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const { income, expense, balance, incomeTx, expenseTx, incomeCats, expenseCats, recent } = useMemo(() => {
    const txns = state.transactions;
    const inc  = txns.filter(t => t.type === 'income');
    const exp  = txns.filter(t => t.type === 'expense');
    return {
      income:     inc.reduce((s, t) => s + t.amount, 0) * rate,
      expense:    Math.abs(exp.reduce((s, t) => s + t.amount, 0)) * rate,
      balance:    txns.reduce((s, t) => s + t.amount, 0) * rate,
      incomeTx:   inc.length, expenseTx: exp.length,
      incomeCats: [...new Set(inc.map(t => t.category))].length,
      expenseCats:[...new Set(exp.map(t => t.category))].length,
      recent: [...txns].sort((a,b) => new Date(b.date)-new Date(a.date)).slice(0,6),
    };
  }, [state.transactions, rate]);

  const cards = [
    { key:'bal', ref:rBal, title:'Total Balance', amount:balance, change:'↑ 12.1%', pos:true,  txCount:incomeTx+expenseTx, cats:incomeCats+expenseCats, note:`Extra ${fmt(1700*rate)} vs last month` },
    { key:'inc', ref:rInc, title:'Income',        amount:income,  change:'↑ 6.3%',  pos:true,  txCount:incomeTx,  cats:incomeCats,  note:`Earned extra ${fmt(500*rate)} vs last month` },
    { key:'exp', ref:rExp, title:'Expenses',      amount:expense, change:'↑ 2.4%',  pos:false, txCount:expenseTx, cats:expenseCats, note:`Spent extra ${fmt(1222*rate)} vs last month` },
  ];

  return (
    <div className="pb-10">
      <Header title="Dashboard" subtitle="Welcome back, Payaldurga! Here's your overview."
        onSearch={onSearch} onNotif={onNotif} onProfile={onProfile} onMenu={onMenu} />

      {/* Summary Cards — 1 col mobile, 2 col tablet, 3 col desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 px-4 sm:px-6 lg:px-8 pt-4 sm:pt-5">
        {cards.map(c => (
          <div key={c.key} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{c.title}</span>
              <DropBtn btnRef={c.ref} open={pop===c.key} onClick={()=>setPop(p=>p===c.key?null:c.key)} label={currency} />
            </div>
            <p className="text-2xl sm:text-[28px] font-bold font-mono text-gray-900 dark:text-white tracking-tight mb-3">{fmt(c.amount)}</p>
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap mb-2">
              <span className={`flex items-center gap-1 text-xs font-semibold ${c.pos?'text-emerald-500':'text-red-500'}`}>
                {c.pos ? <TrendingUp size={11}/> : <TrendingDown size={11}/>}{c.change}
              </span>
              <span className="flex items-center gap-1 text-xs text-gray-400"><ArrowLeftRight size={10}/>{c.txCount} tx</span>
              <span className="flex items-center gap-1 text-xs text-gray-400"><Tag size={10}/>{c.cats} cats</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">{c.note}</p>
          </div>
        ))}
      </div>

      {pop==='bal' && <CurrencyPickerPopover triggerRef={rBal} currency={currency} onChange={c=>{setCurrency(c);setPop(null);}} onClose={()=>setPop(null)}/>}
      {pop==='inc' && <CurrencyPickerPopover triggerRef={rInc} currency={currency} onChange={c=>{setCurrency(c);setPop(null);}} onClose={()=>setPop(null)}/>}
      {pop==='exp' && <CurrencyPickerPopover triggerRef={rExp} currency={currency} onChange={c=>{setCurrency(c);setPop(null);}} onClose={()=>setPop(null)}/>}

      {/* Balance Chart */}
      <div className="px-4 sm:px-6 lg:px-8 pt-4 sm:pt-5">
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 sm:p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <span className="text-[15px] font-semibold text-gray-900 dark:text-white">Balance Overview</span>
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-violet-600 inline-block"/>This month</span>
              <span className="flex items-center gap-1.5"><span className="w-5 border-t-2 border-dashed border-violet-300 inline-block"/>Last month</span>
            </div>
          </div>
          <BalanceChart />
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="px-4 sm:px-6 lg:px-8 pt-4 sm:pt-5">
        <h3 className="text-base font-bold text-gray-900 dark:text-white mb-3">Recent Transactions</h3>
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">
          {/* Mobile card view */}
          <div className="sm:hidden divide-y divide-gray-50 dark:divide-gray-800">
            {recent.map(tx => (
              <div key={tx.id} className="flex items-center gap-3 px-4 py-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${tx.type==='income'?'bg-emerald-50 dark:bg-emerald-900/30':'bg-red-50 dark:bg-red-900/30'}`}>
                  {tx.type==='income' ? <TrendingUp size={14} className="text-emerald-600"/> : <TrendingDown size={14} className="text-red-500"/>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{tx.description}</p>
                  <p className="text-xs text-gray-400">{tx.category} · {new Date(tx.date).toLocaleDateString('en-US',{month:'short',day:'numeric'})}</p>
                </div>
                <span className={`text-sm font-mono font-semibold shrink-0 ${tx.amount>0?'text-emerald-600 dark:text-emerald-400':'text-red-500 dark:text-red-400'}`}>
                  {tx.amount>0?'+':''}{sym}{Math.abs(tx.amount*rate).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          {/* Table view sm+ */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/60">
                  {['Date','Description','Category','Type','Amount'].map((h,i)=>(
                    <th key={h} className={`px-4 sm:px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 ${i===4?'text-right':'text-left'}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recent.map(tx => (
                  <tr key={tx.id} className="border-t border-gray-50 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                    <td className="px-4 sm:px-5 py-3 text-xs text-gray-400 whitespace-nowrap">{new Date(tx.date).toLocaleDateString('en-US',{month:'short',day:'numeric'})}</td>
                    <td className="px-4 sm:px-5 py-3 font-medium text-gray-800 dark:text-gray-200 max-w-[140px] truncate">{tx.description}</td>
                    <td className="px-4 sm:px-5 py-3"><span className="bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap">{tx.category}</span></td>
                    <td className="px-4 sm:px-5 py-3"><span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${tx.type==='income'?'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400':'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400'}`}>{tx.type}</span></td>
                    <td className={`px-4 sm:px-5 py-3 font-mono font-semibold text-right whitespace-nowrap ${tx.amount>0?'text-emerald-600 dark:text-emerald-400':'text-red-500 dark:text-red-400'}`}>{tx.amount>0?'+':''}{sym}{Math.abs(tx.amount*rate).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
