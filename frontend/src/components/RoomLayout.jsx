import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createNewRoom } from "../api/adminApis";

import { FaTimesCircle, FaCheckCircle, FaPlus } from "react-icons/fa";

const RoomLayout = ({ rooms }) => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [formData, setFormData] = useState({
    roomNumber: "",
    roomType: "",
    price: "",
  });

  const handleOpenCreateDialog = () => {
    setShowCreateDialog(true);
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    try {
      const res = await createNewRoom(formData);

      if (res && res.status === 201) {
        toast.success("Room created successfully");
      } else {
        toast.info("Room added, but no confirmation received.");
      }

      setFormData({ roomNumber: "", roomType: "", price: "" });
      setShowCreateDialog(false);
    } catch (error) {
      toast.error("Failed to create room ");
      console.error("Error creating room:", error);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <ToastContainer position="top-right" autoClose={2000} theme="colored" />

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-indigo-600">
          Room Availability
        </h2>
        <button
          onClick={handleOpenCreateDialog}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition-all"
        >
          <FaPlus />
          Create Room
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {rooms.map((room) => (
          <div
            key={room._id}
            className={`relative flex flex-col items-center justify-center p-4 rounded-xl shadow-md border transition-all hover:scale-105 cursor-pointer ${
              room.availability
                ? "bg-green-50 border-green-300 hover:bg-green-100"
                : "bg-red-50 border-red-300 cursor-not-allowed"
            }`}
          >
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-800">
                {room.roomNumber}
              </h3>
              <p className="text-sm text-gray-500">{room.roomType}</p>
            </div>

            <div className="mt-2">
              {room.availability ? (
                <FaCheckCircle className="text-green-600 text-2xl" />
              ) : (
                <FaTimesCircle className="text-red-500 text-2xl" />
              )}
            </div>

            <div className="mt-3">
              <p className="text-sm text-gray-700">
                ₹{room.price.toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-6 gap-6 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <FaCheckCircle className="text-green-600" /> Available
        </div>
        <div className="flex items-center gap-2">
          <FaTimesCircle className="text-red-500" /> Occupied
        </div>
      </div>

      {showCreateDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4 text-indigo-600">
              Create New Room
            </h3>
            <form onSubmit={handleCreateRoom} className="space-y-3">
              <div>
                <label className="text-sm text-gray-600">Room Number</label>
                <input
                  type="text"
                  value={formData.roomNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, roomNumber: e.target.value })
                  }
                  className="w-full border p-2 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Room Type</label>
                <select
                  value={formData.roomType}
                  onChange={(e) =>
                    setFormData({ ...formData, roomType: e.target.value })
                  }
                  className="w-full border p-2 rounded-md"
                  required
                >
                  <option value="">Select type</option>
                  <option value="Single">Single</option>
                  <option value="Double">Double</option>
                  <option value="Triple">Triple</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-600">Price (₹)</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  className="w-full border p-2 rounded-md"
                  required
                />
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateDialog(false)}
                  className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomLayout;
