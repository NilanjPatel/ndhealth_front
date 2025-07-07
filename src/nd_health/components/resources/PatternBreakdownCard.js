import React, { useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const ProfessionalGraph = ({ title, data, color = '#3B82F6', xAxisTitle, yAxisTitle }) => {
  // Convert data into a format suitable for the chart
  const chartData = Object.entries(data).map(([key, value]) => ({
    name: key,
    value,
  }));
  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <div style={{
      width: '100%',
      // height: '350px',
      // padding: '16px',
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      border: '1px solid rgba(0, 0, 0, 0.1)',
    }}>
      {/* Title */}
      <h3 style={{
        fontWeight: 700,
        textAlign: 'center',
        // marginBottom: '16px',
        textTransform: 'uppercase',
        letterSpacing: '1.2px',
        color: '#374151',
        fontSize: '18px',
        margin: '0 0 16px 0'
      }}>
        {title}
      </h3>

      {/* Graph */}
      <ResponsiveContainer width="100%" height="80%">
        <LineChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 15 }}>
          <XAxis
            dataKey="name"
            stroke="#6B7280"
            tick={{ fontSize: 12 }}
            axisLine={{ stroke: '#E5E7EB' }}
            tickLine={{ stroke: '#E5E7EB' }}
            label={{
              value: xAxisTitle,
              position: 'insideBottom',
              offset: -10,
              style: { textAnchor: 'middle', fill: '#6B7280', fontSize: '14px', fontWeight: 600 }
            }}
          />
          <YAxis
            stroke="#6B7280"
            tick={{ fontSize: 12 }}
            axisLine={{ stroke: '#E5E7EB' }}
            tickLine={{ stroke: '#E5E7EB' }}
            label={{
              value: yAxisTitle,
              angle: -90,
              position: 'insideLeft',
              style: { textAnchor: 'middle', fill: '#6B7280', fontSize: '14px', fontWeight: 600 }
            }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#ffffff',
              border: `1px solid ${color}20`,
              borderRadius: '4px',
            }}
            labelStyle={{ color: '#374151' }}
            itemStyle={{ color: color }}
          />
          <Legend
            verticalAlign="top"
            align="right"
            wrapperStyle={{
              paddingBottom: 10,
              fontSize: 12,
              color: '#6B7280',
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={{ r: 4, fill: color }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};


export default ProfessionalGraph;