import React, { useEffect, useState } from "react";
import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { getFinancialData } from "../../api/adminApis";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  ArcElement
);

const FinanceDashboard = () => {
  const [report, setReport] = useState(null);

  useEffect(() => {
    async function loadData() {
      const data = await getFinancialData();
      setReport(data);
    }
    loadData();
  }, []);

  if (!report)
    return (
      <div className="flex justify-center py-10 text-xl font-semibold">
        Loading financial data...
      </div>
    );

  const dates = Object.keys(report.dailyRevenue);
  const amounts = Object.values(report.dailyRevenue);

  const lineData = {
    labels: dates,
    datasets: [
      {
        label: "Daily Revenue (₹)",
        data: amounts,
        borderColor: "#16A34A",
        backgroundColor: "rgba(22,163,74,0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const doughnutData = {
    labels: ["Occupied", "Available"],
    datasets: [
      {
        data: [report.occupiedRooms, report.totalRooms - report.occupiedRooms],
        backgroundColor: ["#4F46E5", "#F43F5E"],
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Finance Overview</h1>
        <p className="text-gray-500">
          Daily revenue insights & occupancy status.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* CARD */}
        <SummaryCard
          title="Total Revenue"
          value={`₹${report.totalRevenue}`}
          color="green"
          note="This month"
        />

        <SummaryCard
          title="Occupancy Rate"
          value={`${report.occupancyRate}%`}
          color="blue"
          note="Live Status"
        />

        <SummaryCard
          title="Total Rooms"
          value={report.totalRooms}
          color="gray"
          note="Inventory"
        />

        <SummaryCard
          title="Occupied Rooms"
          value={report.occupiedRooms}
          color="red"
          note="Currently Filled"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* LINE CHART */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-md border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Daily Revenue Trend
          </h2>
          <Line data={lineData} />
        </div>

        {/* DOUGHNUT */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-md border border-gray-200 flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Occupancy Overview
          </h2>
          <div className="w-64">
            <Doughnut data={doughnutData} />
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Summary Card Component
const SummaryCard = ({ title, value, color, note }) => {
  const colorMap = {
    green: "text-green-600 bg-green-50",
    blue: "text-blue-600 bg-blue-50",
    red: "text-red-600 bg-red-50",
    gray: "text-gray-700 bg-gray-100",
  };

  return (
    <div className="p-5 rounded-2xl bg-white shadow-sm border border-gray-100">
      <p className="text-sm text-gray-500">{title}</p>
      <h1 className={`text-3xl font-bold mt-2 ${colorMap[color]}`}>{value}</h1>
      <p className="text-xs text-gray-400 mt-1">{note}</p>
    </div>
  );
};

export default FinanceDashboard;
