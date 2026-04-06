import { useState, useMemo } from 'react';
import { Plus, Pencil, Trash2, AlertTriangle, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';
import { CATEGORY_COLORS } from '../data/mockData';
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';

const DEFAULT_BUDGETS = [
  {id:1,category:'Food & Groceries',limit:400},{id:2,category:'Cafe & Restaurants',limit:150},
  {id:3,category:'Rent',limit:2000},{id:4,category:'Entertainment',limit:80},
  {id:5,category:'Education',limit:250},{id:6,category:'Others',limit:200},
];
const ALL_CATS = ['Food & Groceries','Cafe & Restaurants','Rent','Entertainment','Education','Money Transfer','Others'];

function BudgetModal({ existing, onSave, onClose }) {
  const [form, setForm] = useState(existing||{category:'Food & Groceries',limit:''});
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"
      onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="bg-white dark:bg-gray-900 rounded-t-3xl sm:rounded-2xl shadow-2xl w-full sm:max-w-sm">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <h3 className="font-bold text-gray-900 dark:text-white">{existing?'Edit Budget':'Set Budget'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl w-7 h-7 flex items-center justify-center">×</button>
        </div>
        <div className="px-5 py-4 flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Category</span>
            <select value={form.category} onChange={e=>set('category',e.target.value)}
              className="px-3 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-violet-500 transition-all cursor-pointer">
              {ALL_CATS.map(c=><option key={c}>{c}</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Monthly Limit ($)</span>
            <input type="number" min="0" step="10" value={form.limit} onChange={e=>set('limit',e.target.value)} placeholder="e.g. 500"
              className="px-3 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-violet-500 transition-all"/>
          </label>
        </div>
        <div className="px-5 py-4 border-t border-gray-100 dark:border-gray-800 flex gap-2.5">
          <button onClick={onClose} className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-300">Cancel</button>
          <button onClick={()=>{if(!form.limit)return;onSave({...form,id:form.id||Date.now(),limit:parseFloat(form.limit)});}}
            className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold transition-all shadow-sm">Save</button>
        </div>
      </div>
    </div>
  );
}

export default function Budget({ onSearch, onNotif, onProfile, onMenu }) {
  const { state } = useApp();
  const [budgets, setBudgets] = useState(()=>{try{return JSON.parse(localStorage.getItem('fs_budgets'))||DEFAULT_BUDGETS;}catch{return DEFAULT_BUDGETS;}});
  const [modal, setModal] = useState(null);

  const save  = b => { setBudgets(b); localStorage.setItem('fs_budgets',JSON.stringify(b)); };
  const upsert = b => { const ex=budgets.find(x=>x.id===b.id); save(ex?budgets.map(x=>x.id===b.id?b:x):[b,...budgets]); };
  const del   = id => save(budgets.filter(b=>b.id!==id));

  const spending = useMemo(()=>{
    const map={};
    state.transactions.filter(t=>t.type==='expense').forEach(t=>{map[t.category]=(map[t.category]||0)+Math.abs(t.amount);});
    return map;
  },[state.transactions]);

  const totalBudget = budgets.reduce((s,b)=>s+b.limit,0);
  const totalSpent  = budgets.reduce((s,b)=>s+(spending[b.category]||0),0);
  const overCount   = budgets.filter(b=>(spending[b.category]||0)>b.limit).length;
  const overallPct  = totalBudget>0?Math.min(100,(totalSpent/totalBudget)*100):0;
  const radialData  = [{name:'Budget',value:overallPct,fill:overallPct>90?'#ef4444':overallPct>70?'#f59e0b':'#7c3aed'}];

  return (
    <div className="pb-10">
      <Header title="Budget" subtitle="Monthly spending limits" onSearch={onSearch} onNotif={onNotif} onProfile={onProfile} onMenu={onMenu}/>

      {/* Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 px-4 sm:px-6 lg:px-8 pt-4 sm:pt-5">
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 sm:p-5 shadow-sm flex items-center gap-4">
          <span className="text-3xl">💳</span>
          <div><p className="text-xs text-gray-400 font-medium">Total Budget</p><p className="text-xl font-bold font-mono text-gray-900 dark:text-white">${totalBudget.toLocaleString()}</p><p className="text-xs text-gray-400 mt-0.5">monthly limit</p></div>
        </div>
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 sm:p-5 shadow-sm flex items-center gap-4">
          <span className="text-3xl">📊</span>
          <div><p className="text-xs text-gray-400 font-medium">Total Spent</p><p className={`text-xl font-bold font-mono ${totalSpent>totalBudget?'text-red-500':'text-gray-900 dark:text-white'}`}>${totalSpent.toLocaleString()}</p><p className="text-xs text-gray-400 mt-0.5">${Math.max(0,totalBudget-totalSpent).toLocaleString()} remaining</p></div>
        </div>
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col items-center justify-center">
          <div className="relative w-24 h-24">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart innerRadius="65%" outerRadius="100%" data={radialData} startAngle={90} endAngle={-270}>
                <RadialBar dataKey="value" cornerRadius={6} background={{fill:'#f3f4f6'}}/>
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-lg font-bold font-mono text-gray-900 dark:text-white">{overallPct.toFixed(0)}%</span>
              <span className="text-[10px] text-gray-400">used</span>
            </div>
          </div>
          {overCount>0 && <p className="text-xs text-red-500 font-semibold mt-1 flex items-center gap-1"><AlertTriangle size={11}/>{overCount} over budget</p>}
        </div>
      </div>

      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 pt-5">
        <h3 className="text-base font-bold text-gray-900 dark:text-white">Category Budgets</h3>
        {state.role==='admin' && (
          <button onClick={()=>setModal('add')} className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-semibold hover:-translate-y-0.5 transition-all shadow-sm">
            <Plus size={14}/> Add Budget
          </button>
        )}
      </div>

      <div className="px-4 sm:px-6 lg:px-8 pt-4 flex flex-col gap-3">
        {budgets.map(b=>{
          const spent=spending[b.category]||0; const pct=Math.min(100,(spent/b.limit)*100);
          const over=spent>b.limit; const warn=!over&&pct>=80;
          const color=over?'#ef4444':warn?'#f59e0b':(CATEGORY_COLORS[b.category]||'#7c3aed');
          return (
            <div key={b.id} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{background:color}}/>
                  <span className="font-semibold text-sm text-gray-800 dark:text-gray-200">{b.category}</span>
                  {over && <span className="flex items-center gap-1 text-xs font-bold text-red-500 bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded-full"><AlertTriangle size={10}/> Over</span>}
                  {!over&&pct===0 && <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full"><CheckCircle size={10}/> No spending</span>}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono font-semibold" style={{color}}>${spent.toFixed(0)}<span className="text-gray-400 font-normal text-xs">/${b.limit}</span></span>
                  {state.role==='admin' && <>
                    <button onClick={()=>setModal(b)} className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-violet-100 dark:hover:bg-violet-900/30 hover:text-violet-600 transition-all"><Pencil size={12}/></button>
                    <button onClick={()=>del(b.id)} className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-500 transition-all"><Trash2 size={12}/></button>
                  </>}
                </div>
              </div>
              <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden mb-1.5">
                <div className="h-full rounded-full transition-all duration-700" style={{width:`${pct}%`,background:color}}/>
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span>{pct.toFixed(1)}% used</span>
                {over ? <span className="text-red-500 font-semibold">${(spent-b.limit).toFixed(2)} over</span>
                       : <span>${(b.limit-spent).toFixed(2)} left</span>}
              </div>
            </div>
          );
        })}
        {budgets.length===0 && <div className="flex flex-col items-center justify-center py-20 text-gray-400"><span className="text-5xl mb-4">💳</span><h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">No budgets set</h3><p className="text-sm">Add a budget to start tracking</p></div>}
      </div>

      {(modal==='add'||(modal&&modal.id)) && (
        <BudgetModal existing={modal==='add'?null:modal} onSave={b=>{upsert(b);setModal(null);}} onClose={()=>setModal(null)}/>
      )}
    </div>
  );
}
