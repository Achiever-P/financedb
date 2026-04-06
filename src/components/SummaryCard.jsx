import { TrendingUp, TrendingDown, ArrowLeftRight, Tag } from 'lucide-react';

export default function SummaryCard({ title, amount, change, changePositive, txCount, catCount, note }) {
  const isNeg = !changePositive;

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</span>
        <button className="text-xs border border-gray-200 dark:border-gray-700 rounded-md px-2 py-0.5 text-gray-400 hover:border-violet-400 hover:text-violet-600 transition-all">
          USD ▾
        </button>
      </div>

      <p className="text-[28px] font-bold font-mono text-gray-900 dark:text-white tracking-tight mb-3">
        ${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
      </p>

      <div className="flex items-center gap-3 flex-wrap mb-2.5">
        <span className={`flex items-center gap-1 text-xs font-semibold ${isNeg ? 'text-red-500' : 'text-emerald-500'}`}>
          {isNeg ? <TrendingDown size={12} /> : <TrendingUp size={12} />}
          {change}
        </span>
        <span className="flex items-center gap-1 text-xs text-gray-400">
          <ArrowLeftRight size={11} /> {txCount} transactions
        </span>
        <span className="flex items-center gap-1 text-xs text-gray-400">
          <Tag size={11} /> {catCount} categories
        </span>
      </div>

      <p className="text-xs text-gray-400 leading-relaxed">{note}</p>
    </div>
  );
}
