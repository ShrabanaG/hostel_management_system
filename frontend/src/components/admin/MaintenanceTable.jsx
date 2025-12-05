import { useEffect, useState, useCallback } from "react";
import axios from "axios";

const base_url = import.meta.env.VITE_BACKEND_URL;

const AdminMaintenanceTable = () => {
  const [reports, setReports] = useState([]);

  const fetchReports = useCallback(async () => {
    try {
      const res = await axios.get(`${base_url}/api/maintenance`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setReports(res.data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-green-600 mb-4">
        Maintenance Reports
      </h1>

      <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
        <table className="w-full text-left bg-white">
          <thead className="bg-green-600 text-white">
            <tr>
              <th className="px-6 py-3">Resident</th>
              <th className="px-6 py-3">Room</th>
              <th className="px-6 py-3">Description</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Created At</th>
            </tr>
          </thead>

          <tbody>
            {reports.map((item) => (
              <tr
                key={item._id}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="px-6 py-4 font-medium">
                  {item.resident?.user?.name || "Unknown"}
                  <br />
                  <span className="text-sm text-gray-500">
                    {item.resident?.user?.email}
                  </span>
                </td>

                <td className="px-6 py-4">{item.room?.roomNumber || "N/A"}</td>

                <td className="px-6 py-4">{item.description}</td>

                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 text-sm rounded-full 
                    ${
                      item.status === "Resolved"
                        ? "bg-green-100 text-green-700"
                        : item.status === "In Progress"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>

                <td className="px-6 py-4">
                  {new Date(item.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {reports.length === 0 && (
        <p className="text-gray-500 mt-4 text-center">
          No maintenance reports found.
        </p>
      )}
    </div>
  );
};

export default AdminMaintenanceTable;
