import { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useApp } from '../context/AppContext';
import { CATEGORY_COLORS } from '../data/mockData';

export default function StatisticsChart() {
  const { state } = useApp();
  const [hovered, setHovered] = useState(null);

  const data = useMemo(() => {
    const map = {};
    state.transactions.filter(t => t.type === 'expense').forEach(t => {
      map[t.category] = (map[t.category] || 0) + Math.abs(t.amount);
    });
    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [state.transactions]);

  const total = data.reduce((s, d) => s + d.value, 0);
  const top = data[0];

  return (
    <div className="flex flex-col h-full">
      <p className="text-xs text-gray-400 mb-3 leading-relaxed">
        You have an increase of expenses in several categories this month.
      </p>

      <div className="relative flex justify-center">
        <ResponsiveContainer width={180} height={180}>
          <PieChart>
            <Pie
              data={data}
              cx="50%" cy="50%"
              innerRadius={52} outerRadius={78}
              dataKey="value"
              paddingAngle={2}
              onMouseEnter={(_, i) => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              {data.map((d, i) => (
                <Cell
                  key={i}
                  fill={CATEGORY_COLORS[d.name] || '#8b5cf6'}
                  opacity={hovered === null || hovered === i ? 1 : 0.55}
                  style={{ cursor: 'pointer', transition: 'opacity 0.2s' }}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(v, n) => [`$${v.toFixed(2)}`, n]}
              contentStyle={{ fontSize: 11, borderRadius: 10, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,.15)' }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[10px] text-gray-400 font-medium">This month expense</span>
          <span className="text-xl font-bold font-mono text-gray-900 dark:text-white mt-0.5">
            ${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        </div>

        {/* Top badge */}
        {top && (
          <div className="absolute top-0 right-0 bg-violet-100 dark:bg-violet-900/40 rounded-xl px-2 py-1 text-right">
            <p className="text-[10px] text-violet-600 dark:text-violet-400 font-semibold">
              {((top.value / total) * 100).toFixed(0)}%
            </p>
            <p className="text-[10px] text-violet-700 dark:text-violet-300 font-bold">${top.value.toFixed(0)}</p>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 mt-3">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ background: CATEGORY_COLORS[d.name] || '#8b5cf6' }}
            />
            <span className="text-[11px] text-gray-500 dark:text-gray-400 truncate">{d.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
