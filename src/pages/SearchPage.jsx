import { useState, useMemo } from 'react';
import { Search, X, TrendingUp, TrendingDown } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function SearchPage({ onClose }) {
  const { state } = useApp();
  const [q, setQ] = useState('');

  const results = useMemo(()=>{
    if(!q.trim()) return [];
    const lower=q.toLowerCase();
    return state.transactions.filter(t=>
      t.description.toLowerCase().includes(lower)||t.category.toLowerCase().includes(lower)||
      t.type.toLowerCase().includes(lower)||String(Math.abs(t.amount)).includes(lower)
    ).slice(0,20);
  },[q,state.transactions]);

  const suggestions=['Salary','Grocery','Rent','Netflix','Coffee','Transfer'];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-start justify-center sm:pt-[10vh] px-0 sm:px-4"
      onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="bg-white dark:bg-gray-900 rounded-t-3xl sm:rounded-2xl shadow-2xl w-full sm:max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Search bar */}
        <div className="flex items-center gap-3 px-4 sm:px-5 py-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
          <Search size={18} className="text-gray-400 shrink-0"/>
          <input autoFocus value={q} onChange={e=>setQ(e.target.value)} placeholder="Search transactions, categories, amounts…"
            className="flex-1 text-base bg-transparent text-gray-900 dark:text-white outline-none placeholder-gray-400 min-w-0"/>
          {q && <button onClick={()=>setQ('')} className="text-gray-400 hover:text-gray-600 shrink-0"><X size={16}/></button>}
          <button onClick={onClose} className="text-xs font-medium text-gray-400 hover:text-gray-600 border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1 shrink-0 hidden sm:block">Esc</button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {!q && (
            <div className="px-4 sm:px-5 py-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Quick Search</p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map(s=>(
                  <button key={s} onClick={()=>setQ(s)}
                    className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-violet-100 dark:hover:bg-violet-900/30 hover:text-violet-600 transition-all">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {q && results.length===0 && (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <span className="text-4xl mb-3">🔍</span>
              <p className="font-medium text-gray-600 dark:text-gray-300">No results for "{q}"</p>
              <p className="text-sm mt-1">Try a different keyword</p>
            </div>
          )}

          {results.length>0 && (
            <div className="px-2 sm:px-3 py-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 py-2">{results.length} result{results.length!==1?'s':''}</p>
              {results.map(tx=>(
                <div key={tx.id} className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${tx.type==='income'?'bg-emerald-50 dark:bg-emerald-900/30':'bg-red-50 dark:bg-red-900/30'}`}>
                    {tx.type==='income'?<TrendingUp size={15} className="text-emerald-600 dark:text-emerald-400"/>:<TrendingDown size={15} className="text-red-500 dark:text-red-400"/>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{tx.description}</p>
                    <p className="text-xs text-gray-400">{tx.category} · {new Date(tx.date).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}</p>
                  </div>
                  <span className={`text-sm font-mono font-semibold shrink-0 ${tx.amount>0?'text-emerald-600 dark:text-emerald-400':'text-red-500 dark:text-red-400'}`}>
                    {tx.amount>0?'+':''}${Math.abs(tx.amount).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="px-4 sm:px-5 py-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span>↩ select</span><span>↑↓ navigate</span>
          </div>
          <button onClick={onClose} className="sm:hidden text-xs font-medium text-gray-500 bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-1.5">Close</button>
        </div>
      </div>
    </div>
  );
}
