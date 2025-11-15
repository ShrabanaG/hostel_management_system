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
import { getFinancialData } from "../api/adminApis";

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

  // Line Chart Data
  const lineData = {
    labels: dates,
    datasets: [
      {
        label: "Daily Revenue (₹)",
        data: amounts,
        borderColor: "rgb(34,197,94)",
        backgroundColor: "rgba(34,197,94,0.3)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  // Doughnut Chart Data
  const doughnutData = {
    labels: ["Occupied Rooms", "Available Rooms"],
    datasets: [
      {
        data: [report.occupiedRooms, report.totalRooms - report.occupiedRooms],
        backgroundColor: ["#4F46E5", "#F43F5E"],
      },
    ],
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Finance Dashboard
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {/* Total Revenue */}
        <div className="bg-white shadow-md p-5 rounded-xl">
          <h3 className="text-lg font-medium text-gray-600">Total Revenue</h3>
          <p className="mt-2 text-3xl font-bold text-green-600">
            ₹{report.totalRevenue}
          </p>
        </div>

        {/* Occupancy Rate */}
        <div className="bg-white shadow-md p-5 rounded-xl">
          <h3 className="text-lg font-medium text-gray-600">Occupancy Rate</h3>
          <p className="mt-2 text-3xl font-bold text-blue-600">
            {report.occupancyRate}%
          </p>
        </div>

        {/* Total Rooms */}
        <div className="bg-white shadow-md p-5 rounded-xl">
          <h3 className="text-lg font-medium text-gray-600">Total Rooms</h3>
          <p className="mt-2 text-3xl font-bold text-gray-800">
            {report.totalRooms}
          </p>
        </div>

        {/* Occupied Rooms */}
        <div className="bg-white shadow-md p-5 rounded-xl">
          <h3 className="text-lg font-medium text-gray-600">Occupied Rooms</h3>
          <p className="mt-2 text-3xl font-bold text-red-600">
            {report.occupiedRooms}
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Line Chart */}
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Daily Revenue
          </h2>
          <Line data={lineData} />
        </div>

        {/* Doughnut Chart */}
        <div className="bg-white rounded-xl p-6 shadow-md flex flex-col items-center">
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

export default FinanceDashboard;
