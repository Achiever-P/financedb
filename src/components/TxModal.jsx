import { useState } from 'react';
import { X } from 'lucide-react';
import { CATEGORIES } from '../data/mockData';

export default function TxModal({ tx, onSave, onClose }) {
  const [form, setForm] = useState(tx||{date:new Date().toISOString().slice(0,10),description:'',category:'Others',type:'expense',amount:''});
  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  const submit = () => {
    if(!form.description||!form.amount) return;
    const amt=form.type==='expense'?-Math.abs(parseFloat(form.amount)):Math.abs(parseFloat(form.amount));
    onSave({...form,amount:amt,id:form.id||Date.now()});
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"
      onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="bg-white dark:bg-gray-900 rounded-t-3xl sm:rounded-2xl shadow-2xl w-full sm:max-w-md">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-900">
          <h3 className="font-bold text-gray-900 dark:text-white">{tx?'Edit Transaction':'Add Transaction'}</h3>
          <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"><X size={16}/></button>
        </div>
        <div className="px-5 py-4 flex flex-col gap-4">
          {[{label:'Date',key:'date',type:'date'},{label:'Description',key:'description',type:'text',ph:'e.g. Netflix'}].map(({label,key,type,ph})=>(
            <label key={key} className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">{label}</span>
              <input type={type} value={form[key]} placeholder={ph} onChange={e=>set(key,e.target.value)}
                className="px-3 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-violet-500 transition-all"/>
            </label>
          ))}
          {[{label:'Type',key:'type',opts:[['income','Income'],['expense','Expense']]},{label:'Category',key:'category',opts:CATEGORIES.map(c=>[c,c])}].map(({label,key,opts})=>(
            <label key={key} className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">{label}</span>
              <select value={form[key]} onChange={e=>set(key,e.target.value)}
                className="px-3 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-violet-500 transition-all cursor-pointer">
                {opts.map(([v,l])=><option key={v} value={v}>{l}</option>)}
              </select>
            </label>
          ))}
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Amount ($)</span>
            <input type="number" min="0" step="0.01" value={Math.abs(form.amount)||''} placeholder="0.00" onChange={e=>set('amount',e.target.value)}
              className="px-3 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-violet-500 transition-all"/>
          </label>
        </div>
        <div className="px-5 py-4 border-t border-gray-100 dark:border-gray-800 flex gap-2.5">
          <button onClick={onClose} className="flex-1 sm:flex-none px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-300 hover:border-violet-400 transition-all">Cancel</button>
          <button onClick={submit} className="flex-1 sm:flex-none px-5 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold transition-all hover:-translate-y-0.5 shadow-sm">Save</button>
        </div>
      </div>
    </div>
  );
}
