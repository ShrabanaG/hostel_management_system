import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaBed,
  FaUsers,
  FaTools,
  FaMoneyBill,
  FaCog,
  FaQuestionCircle,
  FaSignOutAlt,
} from "react-icons/fa";
import { PiBuildingOfficeFill } from "react-icons/pi";

const Sidebar = () => {
  const menuItemClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all
     ${
       isActive
         ? "bg-green-100 text-green-700 font-semibold shadow-sm"
         : "text-gray-600 hover:bg-gray-100"
     }`;

  return (
    <aside className="w-64 h-full  bg-white border-r border-gray-200 p-6 flex flex-col justify-between">
      {/* Logo Section */}
      <div>
        <div className="flex items-center gap-3 mb-10">
          <div className="w-12 h-12 flex items-center justify-center bg-green-600 rounded-xl shadow-sm">
            <PiBuildingOfficeFill className="text-white text-2xl" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Dormify</h1>
        </div>

        {/* Main Menu */}
        <nav className="space-y-2">
          <p className="text-xs text-gray-400 uppercase mb-2">Menu</p>

          <NavLink to="/admin" end className={menuItemClass}>
            <FaHome /> Dashboard
          </NavLink>

          <NavLink to="/admin/rooms" className={menuItemClass}>
            <FaBed /> Rooms
          </NavLink>

          <NavLink to="/admin/residents" className={menuItemClass}>
            <FaUsers /> Residents
          </NavLink>

          <NavLink to="/admin/maintenance" className={menuItemClass}>
            <FaTools /> Maintenance
          </NavLink>

          <NavLink to="/admin/finance" className={menuItemClass}>
            <FaMoneyBill /> Finance
          </NavLink>
        </nav>
      </div>

      {/* Logout Button */}
      <button
        onClick={() => {
          localStorage.clear();
          window.location.href = "/";
        }}
        className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-100 text-red-600 hover:bg-red-200 transition-all"
      >
        <FaSignOutAlt /> Logout
      </button>
    </aside>
  );
};

export default Sidebar;
