import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Cell, ReferenceLine
} from 'recharts';
import { BUDGET_VS_EXPENSE } from '../data/mockData';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const exp = payload.find(p => p.dataKey === 'expense')?.value;
  const bgt = payload.find(p => p.dataKey === 'budget')?.value;
  const over = exp > bgt;
  return (
    <div className="bg-gray-900 text-white text-xs rounded-xl px-3 py-2 shadow-xl">
      <p className="font-semibold mb-1">{label}</p>
      <p className="text-violet-300">Expense: ${exp?.toLocaleString()}</p>
      <p className="text-violet-200">Budget:  ${bgt?.toLocaleString()}</p>
      {over && <p className="text-red-400 mt-1">Exceeded by ${(exp - bgt).toLocaleString()}</p>}
    </div>
  );
};

export default function BudgetChart({ data }) {
  const chartData = data || BUDGET_VS_EXPENSE;
  return (
    <div className="w-full h-[160px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barGap={4}>
          <CartesianGrid strokeDasharray="4 4" stroke="#f3f4f6" vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="budget" fill="#ddd6fe" radius={[6,6,0,0]} maxBarSize={20} />
          <Bar dataKey="expense" radius={[6,6,0,0]} maxBarSize={20}>
            {chartData.map((d, i) => (
              <Cell key={i} fill={d.expense > d.budget ? '#4f46e5' : '#7c3aed'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
