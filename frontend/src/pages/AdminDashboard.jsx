import { useEffect, useState } from "react";

import {
  getAllRooms,
  getAllResidents,
  getAllMaintenanceReport,
} from "../api/adminApis";

import DashboardHome from "../components/admin/DashboardHome";

export default function AdminDashboard() {
  const [rooms, setRooms] = useState([]);
  const [residents, setResidents] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const roomsData = await getAllRooms();
        const residentsData = await getAllResidents();
        const maintenanceData = await getAllMaintenanceReport();

        setRooms(roomsData || []);
        setResidents(residentsData || []);
        setMaintenance(maintenanceData || []);
      } catch (error) {
        console.error("Error loading admin dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <DashboardHome
      allRooms={rooms.rooms}
      allResidents={residents}
      maintenanceCount={maintenance.length}
    />
  );
}
