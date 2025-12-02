import Sidebar from "./Sidebar";
import DashboardHeader from "./DashboardHeader";
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

export default function AdminLayout() {
  const [adminName, setAdminName] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) setAdminName(user.name);
  }, []);

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <div className="flex-shrink-0">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col min-h-screen">
        <DashboardHeader adminName={adminName} />

        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
