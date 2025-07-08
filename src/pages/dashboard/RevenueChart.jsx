// src/components/RevenueChart.jsx
import React, { useMemo } from "react";
import { Bar } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const RevenueChart = ({ monthlySales }) => {
  const labels = monthlySales.map((item) => item._id); // e.g. '2025-04'
  const revenueData = monthlySales.map((item) => item.totalSales);

  const data = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: "Revenue (AED)",
          data: revenueData,
          backgroundColor: "rgba(34, 197, 94, 0.7)",
          borderColor: "rgba(34, 197, 94, 1)",
          borderWidth: 1,
        },
      ],
    }),
    [monthlySales]
  );
  const options = useMemo(
    () => ({
      responsive: true,
      plugins: {
        legend: { position: "top" },
        title: { display: true, text: "Monthly Revenue" },
      },
      scales: {
        y: { beginAtZero: true },
      },
    }),
    []
  );

  return (
    <div className="w-full max-w-3xl mx-auto p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-center text-2xl font-bold text-gray-800 mb-4">
        Monthly Revenue
      </h2>
      <Bar data={data} options={options} />
    </div>
  );
};

export default RevenueChart;
