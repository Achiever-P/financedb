import { useState } from 'react';
import { X, User, Mail, Phone, MapPin, Shield, Camera, LogOut, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ProfilePage({ onClose }) {
  const { state, dispatch } = useApp();
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState(()=>{
    try{return JSON.parse(localStorage.getItem('fs_profile'))||{name:'Payaldurga Paila',email:'payaldurgapaila@gmail.com',phone:'+91 98765 43210',location:'Hyderabad, India'};}
    catch{return{name:'Payaldurga Paila',email:'payaldurgapaila@gmail.com',phone:'+91 98765 43210',location:'Hyderabad, India'};}
  });
  const [form, setForm] = useState(profile);

  const save = () => { setProfile(form); localStorage.setItem('fs_profile',JSON.stringify(form)); setEditing(false); };

  const stats = {
    totalTx: state.transactions.length,
    income:  state.transactions.filter(t=>t.type==='income').reduce((s,t)=>s+t.amount,0),
    expense: Math.abs(state.transactions.filter(t=>t.type==='expense').reduce((s,t)=>s+t.amount,0)),
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end sm:items-start sm:justify-end p-0 sm:p-4"
      onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="bg-white dark:bg-gray-900 rounded-t-3xl sm:rounded-2xl shadow-2xl w-full sm:w-[360px] sm:mt-14 flex flex-col max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-900 z-10">
          <span className="font-bold text-gray-900 dark:text-white">Profile</span>
          <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"><X size={15}/></button>
        </div>

        {/* Avatar */}
        <div className="flex flex-col items-center px-5 pt-6 pb-4">
          <div className="relative">
            <img src="https://ui-avatars.com/api/?name=Payaldurga+Paila&background=7c3aed&color=fff&size=80&bold=true&rounded=true" alt="avatar"
              className="w-20 h-20 rounded-full object-cover border-4 border-violet-100 dark:border-violet-900"/>
            <button className="absolute bottom-0 right-0 w-7 h-7 bg-violet-600 hover:bg-violet-700 text-white rounded-full flex items-center justify-center shadow-lg transition-all"><Camera size={12}/></button>
          </div>
          <h2 className="mt-3 font-bold text-gray-900 dark:text-white text-lg text-center">{profile.name}</h2>
          <p className="text-sm text-gray-400 text-center">{profile.email}</p>
          <div className="flex items-center gap-1.5 mt-2">
            <Shield size={13} className="text-violet-600"/>
            <span className={`text-xs font-semibold capitalize px-2 py-0.5 rounded-full ${state.role==='admin'?'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400':'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}>{state.role}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 px-4 sm:px-5 pb-4">
          {[{label:'Transactions',value:stats.totalTx},{label:'Total Income',value:`$${(stats.income/1000).toFixed(1)}k`},{label:'Total Spent',value:`$${(stats.expense/1000).toFixed(1)}k`}].map((s,i)=>(
            <div key={i} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-2.5 text-center">
              <p className="text-base font-bold text-gray-900 dark:text-white font-mono">{s.value}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Info */}
        <div className="px-4 sm:px-5 pb-4 border-t border-gray-100 dark:border-gray-800 pt-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Personal Info</p>
            <button onClick={()=>editing?save():setEditing(true)}
              className={`text-xs font-semibold px-3 py-1 rounded-lg transition-all ${editing?'bg-violet-600 text-white':'text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/30'}`}>
              {editing?'Save':'Edit'}
            </button>
          </div>
          {[{Icon:User,label:'Name',key:'name'},{Icon:Mail,label:'Email',key:'email'},{Icon:Phone,label:'Phone',key:'phone'},{Icon:MapPin,label:'Location',key:'location'}].map(({Icon,label,key})=>(
            <div key={key} className="flex items-center gap-3 py-2.5 border-b border-gray-50 dark:border-gray-800 last:border-0">
              <div className="w-7 h-7 rounded-lg bg-violet-50 dark:bg-violet-900/30 flex items-center justify-center shrink-0"><Icon size={13} className="text-violet-600"/></div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-gray-400 font-medium">{label}</p>
                {editing
                  ? <input value={form[key]} onChange={e=>setForm(f=>({...f,[key]:e.target.value}))}
                      className="text-sm text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-800 border border-violet-300 rounded-lg px-2 py-0.5 w-full mt-0.5 focus:outline-none focus:border-violet-500"/>
                  : <p className="text-sm text-gray-700 dark:text-gray-300 truncate">{profile[key]}</p>
                }
              </div>
            </div>
          ))}
        </div>

        {/* Role switcher */}
        <div className="px-4 sm:px-5 pb-4">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Switch Role</p>
          <div className="flex gap-2">
            {['admin','viewer'].map(r=>(
              <button key={r} onClick={()=>dispatch({type:'SET_ROLE',v:r})}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold capitalize transition-all ${state.role===r?'bg-violet-600 text-white shadow-sm':'border border-gray-200 dark:border-gray-700 text-gray-500 hover:border-violet-400 hover:text-violet-600'}`}>
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Logout */}
        <div className="px-4 sm:px-5 pb-6">
          <button className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-red-100 dark:border-red-900/30 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all">
            <div className="flex items-center gap-2"><LogOut size={15}/><span className="text-sm font-semibold">Sign out</span></div>
            <ChevronRight size={14}/>
          </button>
        </div>
      </div>
    </div>
  );
}
