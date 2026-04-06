import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ReferenceDot, Legend
} from 'recharts';
import { BALANCE_TREND } from '../data/mockData';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-gray-900 text-white text-xs rounded-xl px-3 py-2 shadow-xl">
      <p className="font-semibold mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>{p.name}: ${p.value?.toLocaleString()}</p>
      ))}
    </div>
  );
};

export default function BalanceChart({ data }) {
  const chartData = data || BALANCE_TREND;
  const peak = chartData.reduce((m, d) => d.thisMonth > m.thisMonth ? d : m, chartData[0]);

  return (
    <div className="w-full h-[190px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 20, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="gradThis" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#7c3aed" stopOpacity={0.18} />
              <stop offset="95%" stopColor="#7c3aed" stopOpacity={0.01} />
            </linearGradient>
            <linearGradient id="gradLast" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#c4b5fd" stopOpacity={0.10} />
              <stop offset="95%" stopColor="#c4b5fd" stopOpacity={0.01} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="4 4" stroke="#f3f4f6" vertical={false} />
          <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
          <YAxis
            tick={{ fontSize: 10, fill: '#9ca3af' }}
            axisLine={false} tickLine={false}
            tickFormatter={v => `$${(v/1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone" dataKey="lastMonth" name="Last month"
            stroke="#c4b5fd" strokeWidth={2} strokeDasharray="6 4"
            fill="url(#gradLast)" dot={false}
          />
          <Area
            type="monotone" dataKey="thisMonth" name="This month"
            stroke="#7c3aed" strokeWidth={2.5}
            fill="url(#gradThis)" dot={false}
          />
          <ReferenceDot
            x={peak.date} y={peak.thisMonth}
            r={6} fill="#7c3aed" stroke="#fff" strokeWidth={2}
            label={{ value: `$${peak.thisMonth.toLocaleString()}`, position: 'top', fontSize: 11, fill: '#1e1b4b', fontWeight: 700 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
