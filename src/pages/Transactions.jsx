import { useState, useMemo } from 'react';
import { Search, Download, Plus, Pencil, Trash2, ArrowUpDown, TrendingUp, TrendingDown } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';
import TxModal from '../components/TxModal';

const CATS = ['All','Food & Groceries','Cafe & Restaurants','Rent','Entertainment','Education','Money Transfer','Others','Income'];

export default function Transactions({ onSearch, onNotif, onProfile, onMenu }) {
  const { state, dispatch } = useApp();
  const [modal, setModal]   = useState(null);
  const [search, setSearch] = useState('');
  const [type, setType]     = useState('all');
  const [cat, setCat]       = useState('All');
  const [sortBy, setSortBy] = useState('date');
  const [sortDir, setSortDir] = useState('desc');

  const rows = useMemo(() => {
    let t = [...state.transactions];
    if (search) t = t.filter(r => r.description.toLowerCase().includes(search.toLowerCase()));
    if (type !== 'all') t = t.filter(r => r.type === type);
    if (cat !== 'All')  t = t.filter(r => r.category === cat);
    t.sort((a,b) => {
      const av = sortBy==='date'?new Date(a.date):sortBy==='amount'?Math.abs(a.amount):a.description.toLowerCase();
      const bv = sortBy==='date'?new Date(b.date):sortBy==='amount'?Math.abs(b.amount):b.description.toLowerCase();
      return sortDir==='asc'?(av<bv?-1:1):(av>bv?-1:1);
    });
    return t;
  }, [state.transactions, search, type, cat, sortBy, sortDir]);

  const toggleSort = col => { if (sortBy===col) setSortDir(d=>d==='asc'?'desc':'asc'); else{setSortBy(col);setSortDir('desc');} };

  const exportCSV = () => {
    const lines=[['Date','Description','Category','Type','Amount'],...rows.map(r=>[r.date,r.description,r.category,r.type,r.amount])];
    const a=Object.assign(document.createElement('a'),{href:'data:text/csv,'+encodeURIComponent(lines.map(l=>l.join(',')).join('\n')),download:'transactions.csv'});
    a.click();
  };

  const SortBtn = ({col}) => (
    <button onClick={()=>toggleSort(col)} className="ml-1 opacity-40 hover:opacity-100 transition-opacity inline-flex">
      <ArrowUpDown size={11}/>
    </button>
  );

  return (
    <div className="pb-10">
      <Header title="Transactions" subtitle="All your financial activity"
        onSearch={onSearch} onNotif={onNotif} onProfile={onProfile} onMenu={onMenu}/>

      {/* Toolbar */}
      <div className="px-4 sm:px-6 lg:px-8 pt-4 sm:pt-5 flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="flex items-center gap-2 px-3.5 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl flex-1 focus-within:border-violet-500 transition-all">
          <Search size={14} className="text-gray-400 shrink-0"/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search transactions…"
            className="bg-transparent text-sm text-gray-700 dark:text-gray-200 outline-none flex-1 placeholder-gray-400 min-w-0"/>
        </div>
        {/* Filters + actions */}
        <div className="flex gap-2 flex-wrap">
          <select value={type} onChange={e=>setType(e.target.value)}
            className="text-sm border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 cursor-pointer focus:outline-none focus:border-violet-500 transition-all flex-1 sm:flex-none">
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <select value={cat} onChange={e=>setCat(e.target.value)}
            className="text-sm border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 cursor-pointer focus:outline-none focus:border-violet-500 transition-all flex-1 sm:flex-none">
            {CATS.map(c=><option key={c}>{c}</option>)}
          </select>
          <button onClick={exportCSV}
            className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-900 hover:border-violet-400 transition-all whitespace-nowrap">
            <Download size={13}/> <span className="hidden sm:inline">Export CSV</span>
          </button>
          {state.role==='admin' && (
            <button onClick={()=>setModal('add')}
              className="flex items-center gap-1.5 px-3 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-semibold hover:-translate-y-0.5 transition-all shadow-sm whitespace-nowrap">
              <Plus size={13}/> <span className="hidden sm:inline">Add Transaction</span>
            </button>
          )}
        </div>
      </div>

      <p className="px-4 sm:px-6 lg:px-8 pt-3 text-xs text-gray-400">{rows.length} transactions</p>

      {rows.length===0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <span className="text-5xl mb-4">📭</span>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">No transactions found</h3>
          <p className="text-sm">Try adjusting your filters</p>
        </div>
      ) : (
        <>
          {/* Mobile card list */}
          <div className="sm:hidden px-4 pt-3 flex flex-col gap-2">
            {rows.map(tx => (
              <div key={tx.id} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-3.5 flex items-center gap-3 shadow-sm">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${tx.type==='income'?'bg-emerald-50 dark:bg-emerald-900/30':'bg-red-50 dark:bg-red-900/30'}`}>
                  {tx.type==='income'?<TrendingUp size={15} className="text-emerald-600"/>:<TrendingDown size={15} className="text-red-500"/>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{tx.description}</p>
                  <p className="text-xs text-gray-400">{tx.category}</p>
                  <p className="text-xs text-gray-400">{new Date(tx.date).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}</p>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <span className={`text-sm font-mono font-bold ${tx.amount>0?'text-emerald-600 dark:text-emerald-400':'text-red-500 dark:text-red-400'}`}>
                    {tx.amount>0?'+':''}${Math.abs(tx.amount).toFixed(2)}
                  </span>
                  {state.role==='admin' && (
                    <div className="flex gap-1">
                      <button onClick={()=>setModal(tx)} className="w-6 h-6 rounded-lg flex items-center justify-center text-gray-400 hover:bg-violet-100 dark:hover:bg-violet-900/30 hover:text-violet-600 transition-all"><Pencil size={11}/></button>
                      <button onClick={()=>dispatch({type:'DEL_TX',v:tx.id})} className="w-6 h-6 rounded-lg flex items-center justify-center text-gray-400 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-500 transition-all"><Trash2 size={11}/></button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Table — sm+ */}
          <div className="hidden sm:block px-4 sm:px-6 lg:px-8 pt-3 overflow-x-auto">
            <table className="w-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/60 text-left">
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400">Date<SortBtn col="date"/></th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400">Description<SortBtn col="description"/></th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 hidden md:table-cell">Category</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 hidden lg:table-cell">Type</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 text-right">Amount<SortBtn col="amount"/></th>
                  {state.role==='admin' && <th className="px-4 py-3 text-xs font-semibold text-gray-500 text-center">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {rows.map(tx => (
                  <tr key={tx.id} className="border-t border-gray-50 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                    <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">{new Date(tx.date).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}</td>
                    <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-200 max-w-[160px] truncate">{tx.description}</td>
                    <td className="px-4 py-3 hidden md:table-cell"><span className="bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap">{tx.category}</span></td>
                    <td className="px-4 py-3 hidden lg:table-cell"><span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${tx.type==='income'?'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400':'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400'}`}>{tx.type}</span></td>
                    <td className={`px-4 py-3 font-mono font-semibold text-right whitespace-nowrap ${tx.amount>0?'text-emerald-600 dark:text-emerald-400':'text-red-500 dark:text-red-400'}`}>{tx.amount>0?'+':''}${Math.abs(tx.amount).toFixed(2)}</td>
                    {state.role==='admin' && (
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <button onClick={()=>setModal(tx)} className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-violet-100 dark:hover:bg-violet-900/30 hover:text-violet-600 transition-all"><Pencil size={13}/></button>
                          <button onClick={()=>dispatch({type:'DEL_TX',v:tx.id})} className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-500 transition-all"><Trash2 size={13}/></button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {(modal==='add'||(modal&&modal.id)) && (
        <TxModal
          tx={modal==='add'?null:modal}
          onSave={tx=>{dispatch({type:tx.id&&state.transactions.find(t=>t.id===tx.id)?'EDIT_TX':'ADD_TX',v:tx});setModal(null);}}
          onClose={()=>setModal(null)}/>
      )}
    </div>
  );
}
