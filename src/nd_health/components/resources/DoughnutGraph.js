import React, { useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { LineChart } from "recharts";

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutGraph = ({ title, data, color = '#3B82F6' }) => {
  // Convert object data into labels and values
  const labels = Object.keys(data || {});
  const values = Object.values(data || {});

  const chartData = {
    labels,
    datasets: [
      {
        label: title,
        data: values,
        backgroundColor: labels.map((_, i) =>
          `hsl(${(i * 360) / labels.length}, 70%, 60%)`
        ),
        borderColor: "#ffffff",
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    cutout: "65%", // makes it doughnut instead of pie
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#6B7280",
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: "#ffffff",
        titleColor: "#374151",
        bodyColor: "#374151",
        borderColor: color,
        borderWidth: 1,
      },
    },
  };

  useEffect(() => {
    console.log("Doughnut chart data:", data);
  }, [data]);

  return (
    <div
      style={{
        width: 300,
        height: 400,
        margin: "auto",
        backgroundColor: "#ffffff",
        borderRadius: "8px",
        padding: "16px",
        boxShadow:
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        border: "1px solid rgba(0, 0, 0, 0.1)",
      }}
    >
      <h4
        style={{
          textAlign: "center",
          color: "#374151",
          fontSize: "16px",
          marginBottom: "12px",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
        }}
      >
        {title}
      </h4>
      <DoughnutGraph data={chartData} options={options} />
    </div>
  );
};

export default DoughnutGraph;
