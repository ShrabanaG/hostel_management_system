import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getAllRooms,
  allocateRoom,
  createMaintenanceReport,
} from "../api/residentsApis";
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import { FaBed, FaCalendarAlt, FaDoorOpen, FaTools } from "react-icons/fa";
import { PiBuildingOfficeFill } from "react-icons/pi";
import { CgLogOut } from "react-icons/cg";

const ResidentEnrollment = () => {
  const { id } = useParams();
  const [allRooms, setAllRooms] = useState([]);
  const [residentName, setResidentName] = useState("");
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState({
    desireRoom: "",
    checkInDate: "",
    checkOutDate: "",
  });

  const [maintenance, setMaintenance] = useState({
    room: "",
    description: "",
  });

  const today = new Date().toISOString().split("T")[0];

  const roomBookingForm = () => {
    return (
      <>
        <div className="mb-5 w-full">
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Select Room*
          </label>
          <div className="relative">
            <FaDoorOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={booking.desireRoom}
              onChange={(e) =>
                setBooking({ ...booking, desireRoom: e.target.value })
              }
              className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
            >
              <option value="">Select a Room</option>
              {allRooms
                .filter((room) => room.availability === true)
                .map((room) => (
                  <option key={room._id} value={room._id}>
                    {room.roomNumber}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Check-In Date */}
        <div className="mb-5 w-full">
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Check-In Date*
          </label>
          <div className="relative">
            <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="date"
              min={today}
              value={booking.checkInDate}
              onChange={(e) =>
                setBooking({ ...booking, checkInDate: e.target.value })
              }
              className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
            />
          </div>
        </div>

        {/* Check-Out Date */}
        <div className="mb-6 w-full">
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Check-Out Date*
          </label>
          <div className="relative">
            <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="date"
              min={today}
              value={booking.checkOutDate}
              onChange={(e) =>
                setBooking({ ...booking, checkOutDate: e.target.value })
              }
              className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
            />
          </div>
        </div>
      </>
    );
  };

  const handleBookRoom = async () => {
    if (!booking.desireRoom || !booking.checkInDate || !booking.checkOutDate) {
      toast.error("Please fill all fields");
      return;
    }
    try {
      const res = await allocateRoom(booking, id);
      if (res.status === 200) {
        toast.success("Room booked successfully!");
        setBooking({
          desireRoom: "",
          checkInDate: "",
          checkOutDate: "",
        });
      }
    } catch (error) {
      toast.error(error || "Error booking room");
      console.error(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  useEffect(() => {
    const fetchAllRooms = async () => {
      try {
        setLoading(true);
        const res = await getAllRooms();
        setAllRooms(res);
      } catch (error) {
        toast.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllRooms();
  }, []);

  useEffect(() => {
    const residentUser = JSON.parse(localStorage.getItem("user"));

    if (residentUser && residentUser.role === "resident") {
      setResidentName(residentUser.name);
    } else {
      window.location.href = "/";
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
      />
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
                <p className="text-xs text-gray-500">Resident Portal</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-gray-800">
                    Welcome, {residentName}
                  </p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-sm">
                    {residentName ? residentName.charAt(0).toUpperCase() : "A"}
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
      {loading ? (
        <div className="flex items-center justify-center min-h-screen bg-black/50">
          <div className="loader"></div>
        </div>
      ) : (
        <main className="grid grid-cols-1 lg:grid-cols-3 mx-auto px-6 py-8 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex flex-col justify-center items-center mb-6 gap-4">
              <h2 className="text-2xl font-bold text-indigo-600">
                Room Availability
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {allRooms
                  .filter((room) => room.availability === true)
                  .map((each) => {
                    return (
                      <div
                        key={each._id}
                        className="relative flex flex-col items-center justify-center p-4 rounded-xl shadow-md border bg-green-50 border-green-300 hover:bg-green-100"
                      >
                        <div className="text-center">
                          <h3 className="text-lg font-semibold text-gray-800">
                            {each.roomNumber}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {each.roomType}
                          </p>
                        </div>
                        <div className="mt-3">
                          <p className="text-sm text-gray-700">
                            ₹{each.price.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex flex-col justify-center items-center mb-6 gap-4">
              <h2 className="text-2xl font-bold text-indigo-600">
                Book Your Room
              </h2>
              {roomBookingForm()}
              <button
                onClick={handleBookRoom}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition"
              >
                <div className="flex items-center justify-center space-x-2">
                  <FaBed />
                  <span>Book Room</span>
                </div>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex flex-col justify-center items-center mb-6 gap-4">
              <h2 className="text-2xl font-bold text-indigo-600 flex items-center gap-2">
                <FaTools /> Report Maintenance Issue
              </h2>

              <div className="w-full">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Select Room*
                </label>
                <div className="relative">
                  <FaDoorOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={maintenance.room}
                    onChange={(e) =>
                      setMaintenance({ ...maintenance, room: e.target.value })
                    }
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
                  >
                    <option value="">Select a Room</option>
                    {allRooms.map((room) => (
                      <option key={room._id} value={room._id}>
                        {room.roomNumber}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="w-full">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Description*
                </label>
                <textarea
                  placeholder="Describe the issue (e.g., water leakage, broken light)..."
                  value={maintenance.description}
                  onChange={(e) =>
                    setMaintenance({
                      ...maintenance,
                      description: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg p-4 min-h-[100px] focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <button
                onClick={async () => {
                  if (!maintenance.room || !maintenance.description) {
                    toast.error("Please fill all fields");
                    return;
                  }
                  try {
                    const res = await createMaintenanceReport(maintenance);
                    toast.success("Maintenance report submitted successfully!");
                    setMaintenance({ room: "", description: "" });
                  } catch (error) {
                    console.error(error);
                    toast.error("Error submitting maintenance report");
                  }
                }}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition"
              >
                <div className="flex items-center justify-center space-x-2">
                  <FaTools />
                  <span>Submit Report</span>
                </div>
              </button>
            </div>
          </div>
        </main>
      )}
    </div>
  );
};

export default ResidentEnrollment;
