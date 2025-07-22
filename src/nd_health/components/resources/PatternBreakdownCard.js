import React, { useEffect } from "react";
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer, Legend } from "recharts";

const COLORS = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'
];

const ProfessionalGraph = ({ title, data, color = '#3B82F6' }) => {
  // Convert data into array format for PieChart
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
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      border: '1px solid rgba(0, 0, 0, 0.1)',
      padding: '16px',
      height: '400px'
    }}>
      {/* Title */}
      <h3 style={{
        fontWeight: 700,
        textAlign: 'center',
        textTransform: 'uppercase',
        letterSpacing: '1.2px',
        color: '#374151',
        fontSize: '18px',
        marginBottom: '16px'
      }}>
        {title}
      </h3>

      {/* Pie Chart */}
      <ResponsiveContainer width="100%" height="85%">
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            wrapperStyle={{ fontSize: 12 }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProfessionalGraph;
