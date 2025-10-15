const ResidentsTable = ({ residents }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold text-indigo-600 mb-4">Resident List</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">
                Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold">
                Email
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold">
                Room Number
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold">
                Room Type
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold">
                Check-In
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold">
                Check-Out
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold">
                Payment Status
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {residents.length > 0 ? (
              residents.map((resident) => (
                <tr
                  key={resident._id}
                  className="hover:bg-gray-50 transition-all"
                >
                  <td className="px-6 py-3 text-sm text-gray-800">
                    {resident.user?.name || "N/A"}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-600">
                    {resident.user?.email || "N/A"}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-700 font-medium">
                    {resident.desireRoom?.roomNumber}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-700">
                    {resident.desireRoom?.roomType}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-600">
                    {new Date(resident.checkInDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-600">
                    {new Date(resident.checkOutDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-3 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        resident.paymentStatus === "Paid"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {resident.paymentStatus}
                    </span>
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
