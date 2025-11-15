import { useEffect, useState } from "react";
import {
  getAllRooms,
  getAllResidents,
  getAllMaintenanceReport,
} from "../api/adminApis";
import RoomLayout from "./RoomLayout";
import ResidentsTable from "./ResidentsTable";
import { PiBuildingOfficeFill } from "react-icons/pi";
import { CgLogOut } from "react-icons/cg";
import { FaUsers, FaTools, FaBed } from "react-icons/fa";
import FinanceDashboard from "./FinanceDashboard";

const AdminDashboard = () => {
  const [adminName, setAdminName] = useState(null);
  const [token, setToken] = useState(null);
  const [allRooms, setAllRooms] = useState([]);
  const [allResidents, setAllResidents] = useState([]);
  const [maintenanceCount, setMaintenanceCount] = useState(0);

  const [authLoading, setAuthLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedUser.role === "admin" && storedToken) {
      setAdminName(storedUser.name);
      setToken(storedToken);
    } else {
      window.location.href = "/";
    }
    setAuthLoading(false);
  }, []);

  useEffect(() => {
    if (!token || authLoading) return;

    const fetchData = async () => {
      setDataLoading(true);
      try {
        const rooms = await getAllRooms();
        const residents = await getAllResidents();
        const maintenance = await getAllMaintenanceReport();

        if (Array.isArray(rooms)) setAllRooms(rooms);
        if (Array.isArray(residents)) setAllResidents(residents);
        if (Array.isArray(maintenance)) setMaintenanceCount(maintenance.length);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setTimeout(() => setDataLoading(false), 500);
      }
    };

    fetchData();
  }, [token, authLoading]);

  const DashboardCard = ({ title, value, color, icon }) => (
    <div className="bg-white p-6 rounded-xl shadow-md flex items-center justify-between hover:shadow-lg transition-all">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <h3
          className={`text-3xl font-bold ${
            color === "indigo"
              ? "text-indigo-600"
              : color === "purple"
              ? "text-purple-600"
              : "text-red-600"
          }`}
        >
          {value}
        </h3>
      </div>
      <div
        className={`p-4 rounded-full ${
          color === "indigo"
            ? "bg-indigo-100"
            : color === "purple"
            ? "bg-purple-100"
            : "bg-red-100"
        }`}
      >
        {icon}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <PiBuildingOfficeFill className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Dormify
                </h1>
                <p className="text-xs text-gray-500">Admin Portal</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-gray-800">
                    Welcome, {adminName}
                  </p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-sm">
                    {adminName ? adminName.charAt(0).toUpperCase() : "A"}
                  </span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-red-700 transition-all shadow-md hover:shadow-lg"
              >
                <CgLogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      {authLoading || dataLoading ? (
        <div className="flex items-center justify-center min-h-screen bg-black/50">
          <div className="loader"></div>
        </div>
      ) : (
        <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <DashboardCard
              title="Total Rooms"
              value={allRooms.length}
              color="indigo"
              icon={<FaBed className="text-indigo-600 w-6 h-6" />}
            />
            <DashboardCard
              title="Total Residents"
              value={allResidents.length}
              color="purple"
              icon={<FaUsers className="text-purple-600 w-6 h-6" />}
            />
            <DashboardCard
              title="Maintenance Reports"
              value={maintenanceCount}
              color="red"
              icon={<FaTools className="text-red-600 w-6 h-6" />}
            />
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RoomLayout rooms={allRooms} />
            <ResidentsTable residents={allResidents} />
          </div>
          <FinanceDashboard />
        </main>
      )}
    </div>
  );
};

export default AdminDashboard;
