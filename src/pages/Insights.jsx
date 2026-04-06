import { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';
import { CATEGORY_COLORS } from '../data/mockData';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';

export default function Insights({ onSearch, onNotif, onProfile, onMenu }) {
  const { state } = useApp();
  const data = useMemo(()=>{
    const txns=state.transactions; const exp=txns.filter(t=>t.type==='expense'); const inc=txns.filter(t=>t.type==='income');
    const byCat={}; exp.forEach(t=>{byCat[t.category]=(byCat[t.category]||0)+Math.abs(t.amount);});
    const catArr=Object.entries(byCat).map(([name,value])=>({name,value})).sort((a,b)=>b.value-a.value);
    const totalInc=inc.reduce((s,t)=>s+t.amount,0); const totalExp=Math.abs(exp.reduce((s,t)=>s+t.amount,0));
    const savingsRate=totalInc>0?((totalInc-totalExp)/totalInc*100):0;
    const now=new Date();
    const thisM=exp.filter(t=>{const d=new Date(t.date);return d.getMonth()===now.getMonth();}).reduce((s,t)=>s+Math.abs(t.amount),0);
    const lastM=exp.filter(t=>{const d=new Date(t.date);return d.getMonth()===now.getMonth()-1;}).reduce((s,t)=>s+Math.abs(t.amount),0);
    return{catArr,totalInc,totalExp,savingsRate,thisM,lastM,monthChange:lastM>0?((thisM/lastM-1)*100):0,avgTx:totalExp/(exp.length||1)};
  },[state.transactions]);

  const cards=[
    {icon:'🏆',title:'Highest Spending Category',value:data.catArr[0]?.name||'N/A',sub:`$${data.catArr[0]?.value?.toFixed(2)||0} total`,color:'text-violet-600'},
    {icon:'📅',title:'Monthly Comparison',value:`${data.monthChange>=0?'+':''}${data.monthChange.toFixed(1)}%`,sub:data.monthChange>=0?'↑ Spending up':'↓ Spending down',color:data.monthChange>=0?'text-red-500':'text-emerald-500'},
    {icon:'💰',title:'Savings Rate',value:`${data.savingsRate.toFixed(1)}%`,sub:`$${(data.totalInc-data.totalExp).toLocaleString()} saved`,color:'text-emerald-600'},
    {icon:'📊',title:'Avg Transaction',value:`$${data.avgTx.toFixed(2)}`,sub:`${state.transactions.length} total transactions`,color:'text-amber-600'},
  ];

  return (
    <div className="pb-10">
      <Header title="Insights" subtitle="Smart observations from your data" onSearch={onSearch} onNotif={onNotif} onProfile={onProfile} onMenu={onMenu}/>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 px-4 sm:px-6 lg:px-8 pt-4 sm:pt-5">
        {cards.map((c,i)=>(
          <div key={i} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 sm:p-5 shadow-sm flex items-center gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all">
            <span className="text-3xl shrink-0">{c.icon}</span>
            <div className="min-w-0"><p className="text-xs text-gray-400 font-medium">{c.title}</p><p className={`text-xl font-bold font-mono ${c.color} truncate`}>{c.value}</p><p className="text-xs text-gray-400 mt-1">{c.sub}</p></div>
          </div>
        ))}
      </div>
      <div className="px-4 sm:px-6 lg:px-8 pt-5 sm:pt-6">
        <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">Spending by Category</h3>
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 sm:p-6 shadow-sm overflow-x-auto">
          <div style={{minWidth:300}}>
            <ResponsiveContainer width="100%" height={Math.max(200,data.catArr.length*34)}>
              <BarChart data={data.catArr} layout="vertical" margin={{left:10,right:20}}>
                <CartesianGrid strokeDasharray="4 4" horizontal={false} stroke="#f3f4f6"/>
                <XAxis type="number" tick={{fontSize:11,fill:'#9ca3af'}} axisLine={false} tickLine={false} tickFormatter={v=>`$${v.toFixed(0)}`}/>
                <YAxis type="category" dataKey="name" tick={{fontSize:11,fill:'#6b7280'}} axisLine={false} tickLine={false} width={130}/>
                <Tooltip formatter={v=>[`$${v.toFixed(2)}`,'Spent']} contentStyle={{fontSize:12,borderRadius:10,border:'none',boxShadow:'0 4px 20px rgba(0,0,0,.12)'}}/>
                <Bar dataKey="value" radius={[0,6,6,0]} maxBarSize={20}>
                  {data.catArr.map((d,i)=><Cell key={i} fill={CATEGORY_COLORS[d.name]||'#8b5cf6'}/>)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="px-4 sm:px-6 lg:px-8 pt-4 sm:pt-5">
        <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">Financial Health</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[{label:'Total Income',value:`+$${data.totalInc.toLocaleString()}`,cls:'text-emerald-600'},{label:'Total Expenses',value:`-$${data.totalExp.toLocaleString()}`,cls:'text-red-500'},{label:'Net Balance',value:`$${(data.totalInc-data.totalExp).toLocaleString()}`,cls:'text-violet-600'},{label:'Categories',value:data.catArr.length,cls:'text-gray-800 dark:text-white'}].map((item,i)=>(
            <div key={i} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 sm:p-5 text-center shadow-sm">
              <p className="text-xs text-gray-400 mb-2">{item.label}</p>
              <p className={`text-lg sm:text-xl font-bold font-mono ${item.cls}`}>{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
