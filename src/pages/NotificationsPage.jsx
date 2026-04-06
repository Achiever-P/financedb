import { useState } from 'react';
import { X, Bell, AlertTriangle, TrendingUp, TrendingDown, Target, CheckCircle } from 'lucide-react';

const INITIAL_NOTIFS=[
  {id:1,type:'alert',   icon:AlertTriangle,color:'text-red-500',    bg:'bg-red-50 dark:bg-red-900/20',    title:'Budget Exceeded',     body:'Your Cafe & Restaurants budget is $6.50 over the $150 limit.',time:'2 min ago', read:false},
  {id:2,type:'income',  icon:TrendingUp,   color:'text-emerald-600',bg:'bg-emerald-50 dark:bg-emerald-900/20',title:'Income Received', body:'Freelance payment of $1,200 has been credited.',           time:'1 hr ago',  read:false},
  {id:3,type:'warning', icon:AlertTriangle,color:'text-amber-500',  bg:'bg-amber-50 dark:bg-amber-900/20', title:'Budget Warning',      body:'Food & Groceries is at 83% of your $400 monthly limit.',  time:'3 hr ago',  read:false},
  {id:4,type:'goal',    icon:Target,       color:'text-violet-600', bg:'bg-violet-50 dark:bg-violet-900/20',title:'Goal Milestone',     body:"You're 65% of the way to your Emergency Fund goal!",      time:'5 hr ago',  read:true},
  {id:5,type:'expense', icon:TrendingDown, color:'text-blue-600',   bg:'bg-blue-50 dark:bg-blue-900/20',   title:'Large Transaction',   body:'Rent payment of $1,500 was recorded successfully.',        time:'Yesterday', read:true},
  {id:6,type:'success', icon:CheckCircle,  color:'text-emerald-600',bg:'bg-emerald-50 dark:bg-emerald-900/20',title:'Goal Completed!', body:"Congratulations! You've reached your New Laptop goal 🎉",  time:'Yesterday', read:true},
  {id:7,type:'alert',   icon:AlertTriangle,color:'text-red-500',    bg:'bg-red-50 dark:bg-red-900/20',    title:'Unusual Spending',    body:'Spending this week is 42% higher than your weekly average.',time:'2 days ago',read:true},
];

export default function NotificationsPage({ onClose }) {
  const [notifs, setNotifs] = useState(INITIAL_NOTIFS);
  const [filter, setFilter] = useState('all');

  const markAllRead = () => setNotifs(n=>n.map(x=>({...x,read:true})));
  const markRead    = id  => setNotifs(n=>n.map(x=>x.id===id?{...x,read:true}:x));
  const dismiss     = id  => setNotifs(n=>n.filter(x=>x.id!==id));
  const unread = notifs.filter(n=>!n.read).length;
  const shown  = filter==='unread'?notifs.filter(n=>!n.read):notifs;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end sm:items-start sm:justify-end p-0 sm:p-4"
      onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="bg-white dark:bg-gray-900 rounded-t-3xl sm:rounded-2xl shadow-2xl w-full sm:w-[380px] sm:mt-14 flex flex-col max-h-[90vh] sm:max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
          <div className="flex items-center gap-2">
            <Bell size={16} className="text-violet-600"/>
            <span className="font-bold text-gray-900 dark:text-white">Notifications</span>
            {unread>0 && <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{unread}</span>}
          </div>
          <div className="flex items-center gap-2">
            {unread>0 && <button onClick={markAllRead} className="text-xs text-violet-600 font-semibold hover:text-violet-700">Mark all read</button>}
            <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"><X size={15}/></button>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 px-4 sm:px-5 pt-3 pb-2 shrink-0">
          {['all','unread'].map(f=>(
            <button key={f} onClick={()=>setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${filter===f?'bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-400':'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
              {f} {f==='unread'&&unread>0&&`(${unread})`}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto px-3 pb-4">
          {shown.length===0
            ? <div className="flex flex-col items-center justify-center py-12 text-gray-400"><Bell size={32} className="mb-3 opacity-30"/><p className="text-sm font-medium">All caught up!</p></div>
            : shown.map(n=>{
                const Icon=n.icon;
                return (
                  <div key={n.id}
                    className={`flex gap-3 p-3 rounded-xl mb-1.5 cursor-pointer transition-all group ${!n.read?'bg-violet-50/50 dark:bg-violet-900/10':'hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}
                    onClick={()=>markRead(n.id)}>
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${n.bg}`}><Icon size={15} className={n.color}/></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-sm font-semibold leading-tight ${!n.read?'text-gray-900 dark:text-white':'text-gray-600 dark:text-gray-400'}`}>{n.title}</p>
                        <button onClick={e=>{e.stopPropagation();dismiss(n.id);}} className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-gray-500 shrink-0 transition-opacity"><X size={12}/></button>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{n.body}</p>
                      <p className="text-[10px] text-gray-300 dark:text-gray-600 mt-1">{n.time}</p>
                    </div>
                    {!n.read && <div className="w-2 h-2 rounded-full bg-violet-500 shrink-0 mt-1.5"/>}
                  </div>
                );
              })
          }
        </div>
      </div>
    </div>
  );
}
