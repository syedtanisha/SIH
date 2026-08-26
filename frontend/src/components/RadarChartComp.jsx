import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';

export const RadarChartComp = ({ competencies }) => {
  if (!competencies || competencies.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-400 text-xs">
        No competency assessment data recorded yet.
      </div>
    );
  }

  const data = competencies.map((c) => ({
    subject: c.name.length > 22 ? c.name.substring(0, 20) + '...' : c.name,
    fullName: c.name,
    Current: c.current_level,
    Required: c.required_level,
  }));

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: '#475569', fontSize: 11, fontWeight: 500 }} 
          />
          <PolarRadiusAxis 
            angle={30} 
            domain={[0, 100]} 
            tick={{ fill: '#94a3b8', fontSize: 10 }} 
          />
          <Tooltip 
            formatter={(value, name, props) => [`${value}%`, name]}
            labelFormatter={(label, payload) => {
              if (payload && payload[0]) {
                return payload[0].payload.fullName;
              }
              return label;
            }}
            contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '0.5rem', fontSize: '12px' }}
          />
          <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
          <Radar
            name="Current Level"
            dataKey="Current"
            stroke="#1E40AF"
            fill="#3B82F6"
            fillOpacity={0.45}
          />
          <Radar
            name="Benchmark Target"
            dataKey="Required"
            stroke="#F59E0B"
            fill="#FBBF24"
            fillOpacity={0.15}
            strokeDasharray="4 4"
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
