import { FiSearch } from "react-icons/fi";
import { IoNotificationsOutline } from "react-icons/io5";

export default function DashboardHeader({ adminName }) {
  return (
    <header
      className="
      
      backdrop-blur-xl bg-white/70
      border-b border-gray-200
      px-6 py-4 flex items-center justify-between
    "
    >
      <div className="relative w-96">
        <FiSearch className="absolute left-3 top-3 text-gray-400" />
        <input
          type="text"
          placeholder="Search task"
          className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
        />
      </div>

      <div className="flex items-center gap-6">
        <IoNotificationsOutline className="text-2xl text-gray-600 cursor-pointer" />

        <div className="flex items-center gap-3">
          <div>
            <p className="font-semibold text-gray-800">{adminName}</p>
          </div>

          <div className="w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">
            {adminName ? adminName[0].toUpperCase() : "A"}
          </div>
        </div>
      </div>
    </header>
  );
}
