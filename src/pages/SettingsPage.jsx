import { useState } from 'react';
import { Sun, Moon, Monitor, Bell, Shield, Globe, Palette, Database, Download, Trash2, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';
import { TRANSACTIONS } from '../data/mockData';

function Toggle({ value, onChange }) {
  return (
    <button onClick={()=>onChange(!value)} style={{width:40,height:22}}
      className={`relative rounded-full transition-all duration-200 shrink-0 ${value?'bg-violet-600':'bg-gray-200 dark:bg-gray-700'}`}>
      <span className="absolute top-0.5 bg-white rounded-full shadow transition-all duration-200"
        style={{width:18,height:18,left:value?20:2}}/>
    </button>
  );
}

function Section({title,children}) {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
      <div className="px-4 sm:px-5 py-3.5 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
        <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{title}</h3>
      </div>
      <div className="divide-y divide-gray-50 dark:divide-gray-800">{children}</div>
    </div>
  );
}

function Row({icon:Icon,iconBg,label,description,children}) {
  return (
    <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 gap-4 flex-wrap">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}><Icon size={15}/></div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{label}</p>
          {description&&<p className="text-xs text-gray-400 mt-0.5 hidden sm:block">{description}</p>}
        </div>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

const CURRENCIES=['USD','EUR','GBP','INR','JPY','CAD','AUD'];
const THEMES=[{id:'light',label:'Light',Icon:Sun},{id:'dark',label:'Dark',Icon:Moon},{id:'system',label:'System',Icon:Monitor}];

export default function SettingsPage({ onSearch, onNotif, onProfile, onMenu }) {
  const { state, dispatch } = useApp();
  const [currency, setCurrency] = useState(localStorage.getItem('fs_currency')||'USD');
  const [notifs, setNotifs]     = useState({budgetAlerts:true,goalMilestones:true,weeklyReport:false,largeTransactions:true});
  const [privacy, setPrivacy]   = useState({hideAmounts:false,twoFactor:false});
  const [saved, setSaved]       = useState(false);

  const handleCurrency = c => { setCurrency(c); localStorage.setItem('fs_currency',c); };
  const resetData = () => { if(window.confirm('Reset all transactions to default?')){ localStorage.setItem('fs_txns',JSON.stringify(TRANSACTIONS)); window.location.reload(); } };
  const exportJSON = () => { const a=Object.assign(document.createElement('a'),{href:'data:application/json,'+encodeURIComponent(JSON.stringify({transactions:state.transactions,exportedAt:new Date().toISOString()},null,2)),download:'finset-data.json'}); a.click(); };
  const handleSave = () => { setSaved(true); setTimeout(()=>setSaved(false),2000); };

  return (
    <div className="pb-10">
      <Header title="Settings" subtitle="Manage your preferences" onSearch={onSearch} onNotif={onNotif} onProfile={onProfile} onMenu={onMenu}/>
      <div className="px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 flex flex-col gap-4 sm:gap-5 max-w-2xl w-full mx-auto lg:mx-0">

        <Section title="Appearance">
          <Row icon={Palette} iconBg="bg-violet-50 dark:bg-violet-900/30 text-violet-600" label="Theme" description="Choose your preferred colour scheme">
            <div className="flex gap-1.5 flex-wrap">
              {THEMES.map(({id,label,Icon})=>{
                const active=state.theme===id||(id==='system'&&!['light','dark'].includes(state.theme));
                return <button key={id} onClick={()=>dispatch({type:'SET_THEME',v:id==='system'?'light':id})}
                  className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${active?'bg-violet-600 text-white shadow-sm':'border border-gray-200 dark:border-gray-700 text-gray-500 hover:border-violet-400 hover:text-violet-600'}`}>
                  <Icon size={11}/> {label}
                </button>;
              })}
            </div>
          </Row>
        </Section>

        <Section title="Regional">
          <Row icon={Globe} iconBg="bg-blue-50 dark:bg-blue-900/30 text-blue-600" label="Currency" description="Default display currency">
            <select value={currency} onChange={e=>handleCurrency(e.target.value)}
              className="text-sm border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 focus:outline-none focus:border-violet-500 cursor-pointer transition-all">
              {CURRENCIES.map(c=><option key={c}>{c}</option>)}
            </select>
          </Row>
        </Section>

        <Section title="Notifications">
          {[{key:'budgetAlerts',label:'Budget Alerts',desc:'Notify when spending exceeds limits'},{key:'goalMilestones',label:'Goal Milestones',desc:'Celebrate savings milestones'},{key:'largeTransactions',label:'Large Transactions',desc:'Alert for transactions above $500'},{key:'weeklyReport',label:'Weekly Summary',desc:'Weekly spending summary every Monday'}].map(({key,label,desc})=>(
            <Row key={key} icon={Bell} iconBg="bg-amber-50 dark:bg-amber-900/30 text-amber-600" label={label} description={desc}>
              <Toggle value={notifs[key]} onChange={v=>setNotifs(n=>({...n,[key]:v}))}/>
            </Row>
          ))}
        </Section>

        <Section title="Privacy & Security">
          <Row icon={Shield} iconBg="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600" label="Hide Amounts" description="Mask all currency values">
            <Toggle value={privacy.hideAmounts} onChange={v=>setPrivacy(p=>({...p,hideAmounts:v}))}/>
          </Row>
          <Row icon={Shield} iconBg="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600" label="Two-Factor Auth" description="Extra security layer">
            <Toggle value={privacy.twoFactor} onChange={v=>setPrivacy(p=>({...p,twoFactor:v}))}/>
          </Row>
        </Section>

        <Section title="Data Management">
          <Row icon={Download} iconBg="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600" label="Export Data" description="Download all data as JSON">
            <button onClick={exportJSON} className="flex items-center gap-1.5 text-xs font-semibold border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-gray-600 dark:text-gray-300 hover:border-violet-400 hover:text-violet-600 transition-all whitespace-nowrap">
              <Download size={11}/> Export
            </button>
          </Row>
          <Row icon={Database} iconBg="bg-gray-100 dark:bg-gray-800 text-gray-500" label="Reset Data" description="Restore default sample data">
            <button onClick={resetData} className="flex items-center gap-1.5 text-xs font-semibold border border-red-200 dark:border-red-900/40 rounded-xl px-3 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all whitespace-nowrap">
              <Trash2 size={11}/> Reset
            </button>
          </Row>
        </Section>

        <button onClick={handleSave}
          className={`w-full py-3 rounded-2xl font-semibold text-sm transition-all flex items-center justify-center gap-2
            ${saved?'bg-emerald-500 text-white':'bg-violet-600 hover:bg-violet-700 text-white hover:-translate-y-0.5 shadow-sm'}`}>
          {saved?<><Check size={15}/> Saved!</>:'Save Settings'}
        </button>

        <p className="text-center text-xs text-gray-400">Finset v1.0.0 · React + Tailwind</p>
      </div>
    </div>
  );
}
