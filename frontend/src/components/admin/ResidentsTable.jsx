import { useState, useEffect } from "react";
import { getAllResidents } from "../../api/adminApis";

const ResidentsTable = () => {
  const [residents, setResidents] = useState([]);

  useEffect(() => {
    const getResidents = async () => {
      const res = await getAllResidents();
      setResidents(res);
    };

    getResidents();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold text-green-600 mb-4">Resident List</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead className="bg-green-600 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">
                Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold">
                Email
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {residents?.length > 0 ? (
              residents?.map((resident) => (
                <tr
                  key={resident._id}
                  className="hover:bg-gray-50 transition-all"
                >
                  <td className="px-6 py-3 text-sm text-gray-800">
                    {resident.name || "N/A"}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-600">
                    {resident.email || "N/A"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="text-center py-6 text-gray-500 text-sm"
                >
                  No residents found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResidentsTable;
