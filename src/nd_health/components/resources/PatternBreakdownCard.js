import React, { useEffect } from "react";
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer, Legend,  Sector, SectorProps } from "recharts";

const COLORS = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'
];
const renderActiveShape = ({
                             cx,
                             cy,
                             midAngle,
                             innerRadius,
                             outerRadius,
                             startAngle,
                             endAngle,
                             fill,
                             payload,
                             percent,
                             value,
                             name
                           }: PieSectorDataItem) => {
  const RADIAN = Math.PI / 180;
  const sin = Math.sin(-RADIAN * (midAngle ?? 1));
  const cos = Math.cos(-RADIAN * (midAngle ?? 1));
  const sx = (cx ?? 0) + ((outerRadius ?? 0) + 10) * cos;
  const sy = (cy ?? 0) + ((outerRadius ?? 0) + 10) * sin;
  const mx = (cx ?? 0) + ((outerRadius ?? 0) + 30) * cos;
  const my = (cy ?? 0) + ((outerRadius ?? 0) + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} fontSize={14}>
        {`${payload.name} Time Billed`}
      </text>
      <text x={cx} y={cy} dy={24} textAnchor="middle" fill="#666" fontSize={12}>
        {`${payload.value} Patients`}
      </text>

      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={(outerRadius ?? 0) + 6}
        outerRadius={(outerRadius ?? 0) + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
        fontSize={12} // adjust as needed
      >
        {`${value} Invoices for ${name} Time`}
      </text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#999"
        fontSize={10} // adjust as needed
      >
        {`(${((percent ?? 1) * 100).toFixed(2)}%)`}
      </text>

    </g>
  );
};


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
            activeShape={renderActiveShape}
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            label
          >
            {/*colors*/}
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={() => null} />

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
