import FinanceDashboard from "./FinanceDashboard";

export default function DashboardHome({
  allRooms,
  allResidents,
  maintenanceCount,
}) {
  return (
    <>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500">Manage hostel operations efficiently.</p>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-xl shadow hover:shadow-md transition">
            <p className="text-gray-500">Total Rooms</p>
            <h1 className="text-4xl font-bold mt-2">{allRooms.length}</h1>
          </div>

          <div className="p-6 bg-white rounded-xl shadow hover:shadow-md transition">
            <p className="text-gray-500">Total Residents</p>
            <h1 className="text-4xl font-bold mt-2">{allResidents.length}</h1>
          </div>

          <div className="p-6 bg-white rounded-xl shadow hover:shadow-md transition">
            <p className="text-gray-500">Maintenance Reports</p>
            <h1 className="text-4xl font-bold mt-2">{maintenanceCount}</h1>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <FinanceDashboard />
      </div>
    </>
  );
}
