import { useState, useMemo } from 'react';
import { Plus, Target, Trash2, Calendar } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';

const DEFAULT_GOALS = [
  { id:1, name:'Emergency Fund',    target:10000, saved:6500,  deadline:'2024-12-31', color:'#7c3aed', icon:'🛡️' },
  { id:2, name:'Vacation to Japan', target:3500,  saved:1200,  deadline:'2025-03-15', color:'#10b981', icon:'✈️' },
  { id:3, name:'New Laptop',        target:1800,  saved:1800,  deadline:'2024-08-01', color:'#f59e0b', icon:'💻' },
  { id:4, name:'Home Down Payment', target:50000, saved:12000, deadline:'2027-01-01', color:'#3b82f6', icon:'🏠' },
];

function GoalModal({ onSave, onClose }) {
  const [form, setForm] = useState({ name:'', target:'', saved:'', deadline:'', icon:'🎯', color:'#7c3aed' });
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  const ICONS = ['🎯','🏠','✈️','🚗','💻','📚','🛡️','💍','🎵','🏋️'];
  const COLORS = ['#7c3aed','#10b981','#f59e0b','#3b82f6','#ef4444','#ec4899','#14b8a6','#f97316'];
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"
      onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="bg-white dark:bg-gray-900 rounded-t-3xl sm:rounded-2xl shadow-2xl w-full sm:max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-900 z-10">
          <h3 className="font-bold text-gray-900 dark:text-white">New Savings Goal</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl w-7 h-7 flex items-center justify-center">×</button>
        </div>
        <div className="px-5 py-4 flex flex-col gap-4">
          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">Icon</p>
            <div className="flex gap-2 flex-wrap">
              {ICONS.map(ic=>(
                <button key={ic} onClick={()=>set('icon',ic)}
                  className={`text-xl w-10 h-10 rounded-xl flex items-center justify-center transition-all ${form.icon===ic?'bg-violet-100 dark:bg-violet-900/40 ring-2 ring-violet-500':'hover:bg-gray-100 dark:hover:bg-gray-800'}`}>{ic}</button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">Color</p>
            <div className="flex gap-2 flex-wrap">
              {COLORS.map(c=>(
                <button key={c} onClick={()=>set('color',c)}
                  className={`w-8 h-8 rounded-full transition-all ${form.color===c?'ring-2 ring-offset-2 ring-gray-400 scale-110':'hover:scale-110'}`}
                  style={{background:c}}/>
              ))}
            </div>
          </div>
          {[{label:'Goal Name',key:'name',type:'text',ph:'e.g. Vacation Fund'},{label:'Target Amount ($)',key:'target',type:'number',ph:'5000'},{label:'Already Saved ($)',key:'saved',type:'number',ph:'0'},{label:'Deadline',key:'deadline',type:'date',ph:''}].map(({label,key,type,ph})=>(
            <label key={key} className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">{label}</span>
              <input type={type} value={form[key]} placeholder={ph} onChange={e=>set(key,e.target.value)}
                className="px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-violet-500 transition-all"/>
            </label>
          ))}
        </div>
        <div className="px-5 py-4 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-2.5 sticky bottom-0 bg-white dark:bg-gray-900">
          <button onClick={onClose} className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-300">Cancel</button>
          <button onClick={()=>{if(!form.name||!form.target)return;onSave({...form,id:Date.now(),target:parseFloat(form.target),saved:parseFloat(form.saved)||0});}}
            className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold transition-all shadow-sm flex-1 sm:flex-none">Create Goal</button>
        </div>
      </div>
    </div>
  );
}

export default function Goals({ onSearch, onNotif, onProfile, onMenu }) {
  const { state } = useApp();
  const [goals, setGoals] = useState(()=>{try{return JSON.parse(localStorage.getItem('fs_goals'))||DEFAULT_GOALS;}catch{return DEFAULT_GOALS;}});
  const [modal, setModal] = useState(false);

  const saveGoals = g => { setGoals(g); localStorage.setItem('fs_goals',JSON.stringify(g)); };
  const addGoal   = g => saveGoals([g,...goals]);
  const delGoal   = id => saveGoals(goals.filter(g=>g.id!==id));

  const totalSaved  = goals.reduce((s,g)=>s+g.saved,0);
  const totalTarget = goals.reduce((s,g)=>s+g.target,0);
  const completed   = goals.filter(g=>g.saved>=g.target).length;
  const daysLeft    = d => Math.max(0,Math.ceil((new Date(d)-new Date())/(1000*60*60*24)));

  return (
    <div className="pb-10">
      <Header title="Goals" subtitle="Track your savings goals" onSearch={onSearch} onNotif={onNotif} onProfile={onProfile} onMenu={onMenu}/>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 px-4 sm:px-6 lg:px-8 pt-4 sm:pt-5">
        {[{icon:'🎯',label:'Total Goals',value:goals.length,sub:`${completed} completed`},{icon:'💰',label:'Total Saved',value:`$${totalSaved.toLocaleString()}`,sub:`of $${totalTarget.toLocaleString()} target`},{icon:'📈',label:'Overall Progress',value:`${totalTarget>0?((totalSaved/totalTarget)*100).toFixed(1):0}%`,sub:`$${(totalTarget-totalSaved).toLocaleString()} remaining`}].map((c,i)=>(
          <div key={i} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 sm:p-5 shadow-sm flex items-center gap-4">
            <span className="text-3xl">{c.icon}</span>
            <div><p className="text-xs text-gray-400 font-medium">{c.label}</p><p className="text-xl font-bold text-gray-900 dark:text-white font-mono">{c.value}</p><p className="text-xs text-gray-400 mt-0.5">{c.sub}</p></div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 pt-5">
        <h3 className="text-base font-bold text-gray-900 dark:text-white">Your Goals</h3>
        {state.role==='admin' && (
          <button onClick={()=>setModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-semibold hover:-translate-y-0.5 transition-all shadow-sm">
            <Plus size={14}/> <span>New Goal</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 px-4 sm:px-6 lg:px-8 pt-4">
        {goals.map(goal=>{
          const pct=Math.min(100,(goal.saved/goal.target)*100);
          const done=goal.saved>=goal.target;
          const days=daysLeft(goal.deadline);
          return (
            <div key={goal.id} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl shrink-0" style={{background:goal.color+'20'}}>{goal.icon}</div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{goal.name}</h4>
                    <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5"><Calendar size={10}/>{done?'Completed! 🎉':`${days} days left`}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {done && <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full hidden sm:inline">Done ✓</span>}
                  {state.role==='admin' && <button onClick={()=>delGoal(goal.id)} className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-500 transition-all"><Trash2 size={13}/></button>}
                </div>
              </div>
              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-gray-400">Progress</span>
                  <span className="font-semibold" style={{color:goal.color}}>{pct.toFixed(1)}%</span>
                </div>
                <div className="w-full h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700" style={{width:`${pct}%`,background:done?'#10b981':goal.color}}/>
                </div>
              </div>
              <div className="flex justify-between items-end">
                <div><p className="text-xs text-gray-400">Saved</p><p className="text-lg font-bold font-mono text-gray-900 dark:text-white">${goal.saved.toLocaleString()}</p></div>
                <div className="text-right"><p className="text-xs text-gray-400">Target</p><p className="text-lg font-bold font-mono text-gray-400">${goal.target.toLocaleString()}</p></div>
              </div>
              {!done && <p className="text-xs text-gray-400 mt-2 pt-2 border-t border-gray-50 dark:border-gray-800"><span className="font-semibold text-gray-600 dark:text-gray-300">${(goal.target-goal.saved).toLocaleString()}</span> more to reach your goal</p>}
            </div>
          );
        })}
        {goals.length===0 && <div className="col-span-2 flex flex-col items-center justify-center py-20 text-gray-400"><span className="text-5xl mb-4">🎯</span><h3 className="text-lg font-semibold">No goals yet</h3><p className="text-sm mt-1">Create your first savings goal</p></div>}
      </div>

      {modal && <GoalModal onSave={g=>{addGoal(g);setModal(false);}} onClose={()=>setModal(false)}/>}
    </div>
  );
}
