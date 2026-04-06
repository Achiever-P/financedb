import { useState } from 'react';
import { ChevronDown, ChevronRight, Search, BookOpen, MessageCircle, Mail } from 'lucide-react';
import Header from '../components/Header';

const FAQS=[
  {q:'How do I add a new transaction?',a:'Go to Transactions, ensure your role is Admin, then click "+ Add Transaction". Fill in the details and click Save.'},
  {q:'How do I switch between Admin and Viewer roles?',a:'Click your avatar in the top-right to open the Profile panel. At the bottom use the role switcher to change instantly.'},
  {q:'What is the difference between Goals and Budget?',a:'Budget sets monthly category spending limits. Goals are long-term savings targets with a deadline and target amount.'},
  {q:'How do I enable dark mode?',a:'Use the sun/moon toggle at the bottom of the sidebar, or go to Settings → Appearance.'},
  {q:'Can I export my transactions?',a:'Yes! On the Transactions page click "Export CSV" to download your data. Settings → Data Management also offers JSON export.'},
  {q:'Is my data stored securely?',a:'All data lives locally in your browser localStorage — nothing is sent to any server.'},
  {q:'How do I reset to default data?',a:'Go to Settings → Data Management → Reset Data. Note this cannot be undone.'},
  {q:'How does search work?',a:'Press Ctrl+K (Cmd+K on Mac) or the search icon. You can search by description, category, type, or amount.'},
];

const GUIDES=[
  {icon:'▶',title:'Getting Started',desc:'Learn the dashboard in 5 minutes',tag:'5 min'},
  {icon:'📋',title:'Setting Up Budget',desc:'Create category limits and track spending',tag:'3 min'},
  {icon:'🎯',title:'Creating Goals',desc:'Set milestones and track progress',tag:'3 min'},
  {icon:'📈',title:'Understanding Analytics',desc:'Read charts and spot patterns',tag:'4 min'},
];

export default function HelpPage({ onSearch, onNotif, onProfile, onMenu }) {
  const [openFaq, setOpenFaq] = useState(null);
  const [searchQ, setSearchQ] = useState('');
  const [sent, setSent]       = useState(false);
  const [msg, setMsg]         = useState('');

  const filtered = FAQS.filter(f=>!searchQ||f.q.toLowerCase().includes(searchQ.toLowerCase())||f.a.toLowerCase().includes(searchQ.toLowerCase()));

  return (
    <div className="pb-10">
      <Header title="Help & Support" subtitle="Find answers and contact support" onSearch={onSearch} onNotif={onNotif} onProfile={onProfile} onMenu={onMenu}/>

      <div className="px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 flex flex-col gap-5 max-w-2xl w-full mx-auto lg:mx-0">
        {/* Hero */}
        <div className="bg-gradient-to-br from-violet-600 to-violet-700 rounded-2xl p-5 sm:p-6 text-white">
          <h2 className="text-base sm:text-lg font-bold mb-1">How can we help you?</h2>
          <p className="text-violet-200 text-sm mb-4">Search articles or browse the FAQ below</p>
          <div className="flex items-center gap-2.5 bg-white/15 backdrop-blur rounded-xl px-4 py-2.5">
            <Search size={15} className="text-violet-200 shrink-0"/>
            <input value={searchQ} onChange={e=>setSearchQ(e.target.value)} placeholder="Search help articles…"
              className="bg-transparent text-white placeholder-violet-300 text-sm outline-none flex-1"/>
          </div>
        </div>

        {/* Guides */}
        <div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2"><BookOpen size={16} className="text-violet-600"/> Guides</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {GUIDES.map((g,i)=>(
              <button key={i} className="flex items-start gap-3 p-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm hover:border-violet-300 hover:shadow-md transition-all text-left group">
                <div className="w-9 h-9 rounded-xl bg-violet-50 dark:bg-violet-900/30 flex items-center justify-center shrink-0 text-sm group-hover:bg-violet-100 transition-all">{g.icon}</div>
                <div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 leading-tight">{g.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{g.desc}</p>
                  <span className="text-[10px] text-violet-500 font-semibold mt-1.5 inline-block">{g.tag} read</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2"><MessageCircle size={16} className="text-violet-600"/> FAQ</h3>
          {filtered.length===0
            ? <div className="text-center py-10 text-gray-400 text-sm">No results for "{searchQ}"</div>
            : <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden divide-y divide-gray-50 dark:divide-gray-800">
                {filtered.map((faq,i)=>(
                  <div key={i}>
                    <button className="w-full flex items-center justify-between px-4 sm:px-5 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all"
                      onClick={()=>setOpenFaq(openFaq===i?null:i)}>
                      <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 pr-4 leading-snug">{faq.q}</span>
                      {openFaq===i?<ChevronDown size={15} className="text-violet-600 shrink-0"/>:<ChevronRight size={15} className="text-gray-400 shrink-0"/>}
                    </button>
                    {openFaq===i && <div className="px-4 sm:px-5 pb-4"><p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{faq.a}</p></div>}
                  </div>
                ))}
              </div>
          }
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2"><Mail size={16} className="text-violet-600"/> Contact Support</h3>
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 sm:p-5 shadow-sm">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">We'll get back to you within 24 hours.</p>
            <textarea value={msg} onChange={e=>setMsg(e.target.value)} placeholder="Describe your issue…" rows={3}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 outline-none focus:border-violet-500 transition-all resize-none placeholder-gray-400"/>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-3 gap-2">
              <span className="text-xs text-gray-400">support@finset.app</span>
              <button onClick={()=>{setSent(true);setMsg('');setTimeout(()=>setSent(false),3000);}}
                className={`w-full sm:w-auto px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${sent?'bg-emerald-500 text-white':'bg-violet-600 hover:bg-violet-700 text-white hover:-translate-y-0.5'}`}>
                {sent?'✓ Sent!':<><Mail size={13}/> Send Message</>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
