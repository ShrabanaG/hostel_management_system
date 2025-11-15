import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

const base_url = import.meta.env.VITE_BASE_URL || "";

// Small presentational components
const Header = ({ residentName, onLogout }) => (
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
            onClick={onLogout}
            className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-red-700 transition-all shadow-md hover:shadow-lg"
          >
            <CgLogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </div>
  </header>
);

const RoomCard = ({ room }) => (
  <div className="relative flex flex-col items-center justify-center p-4 rounded-xl shadow-md border bg-green-50 border-green-300 hover:bg-green-100">
    <div className="text-center">
      <h3 className="text-lg font-semibold text-gray-800">{room.roomNumber}</h3>
      <p className="text-sm text-gray-500">{room.roomType}</p>
    </div>
    <div className="mt-3">
      <p className="text-sm text-gray-700">
        ₹{Number(room.price).toLocaleString()}
      </p>
    </div>
  </div>
);

export default function ResidentEnrollment() {
  const { id } = useParams(); // resident id from route (if required)
  const navigate = useNavigate();

  const [allRooms, setAllRooms] = useState([]);
  const [residentName, setResidentName] = useState("");
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);

  const [booking, setBooking] = useState({
    desireRoom: "",
    checkInDate: "",
    checkOutDate: "",
  });
  const [maintenance, setMaintenance] = useState({ room: "", description: "" });

  const today = new Date().toISOString().split("T")[0];

  // Load Razorpay SDK dynamically once
  useEffect(() => {
    if (window.Razorpay) return; // already loaded
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  // Fetch rooms
  const fetchAllRooms = useCallback(async () => {
    try {
      setLoading(true);
      const rooms = await getAllRooms();
      setAllRooms(rooms || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch rooms");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllRooms();
  }, [fetchAllRooms]);

  // Resident auth & name
  useEffect(() => {
    const residentUser = JSON.parse(localStorage.getItem("user"));
    if (residentUser && residentUser.role === "resident") {
      setResidentName(residentUser.name);
    } else {
      navigate("/");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("resident_token");
    navigate("/");
  };

  const validateBooking = () => {
    if (!booking.desireRoom || !booking.checkInDate || !booking.checkOutDate) {
      toast.error("Please fill all fields");
      return false;
    }
    if (new Date(booking.checkOutDate) <= new Date(booking.checkInDate)) {
      toast.error("Check-out must be after check-in");
      return false;
    }
    return true;
  };

  const handleBookRoom = async () => {
    if (!validateBooking()) return;
    try {
      setProcessing(true);

      // 1) allocate room on backend
      const res = await allocateRoom(booking, id);
      // Expect res to contain the room object including price at res.data.room.price
      if (!res || res.status !== 200) {
        toast.error(res?.message || "Failed to allocate room");
        setProcessing(false);
        return;
      }

      toast.success("Room reserved — starting payment...");

      // 2) create order on backend (Razorpay order)
      const token =
        localStorage.getItem("resident_token") || localStorage.getItem("token");
      const orderResp = await fetch(`${base_url}/api/payment/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ amount: res.data.room.price, resident: id }),
      }).then((r) => r.json());

      if (!orderResp || !orderResp.success) {
        throw new Error(orderResp?.message || "Could not create payment order");
      }

      // 3) open Razorpay checkout
      const options = {
        key: orderResp.key,
        amount: orderResp.amount * 100,
        currency: "INR",
        name: "Dormify Hostel",
        description: "Room Booking Payment",
        order_id: orderResp.orderId,
        handler: async function (response) {
          try {
            const verifyResp = await fetch(
              `${base_url}/api/payment/verify-payment`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: token ? `Bearer ${token}` : "",
                },
                body: JSON.stringify(response),
              }
            ).then((r) => r.json());

            if (verifyResp?.success) {
              toast.success("Payment successful — booking complete");
              setBooking({ desireRoom: "", checkInDate: "", checkOutDate: "" });

              navigate("/resident/:id");
            } else {
              toast.error(
                "Payment verification failed — please contact support"
              );
            }
          } catch (err) {
            console.error(err);
            toast.error("Payment verification error");
          } finally {
            setProcessing(false);
          }
        },
        modal: {
          ondismiss: function () {
            toast.info("Payment cancelled");
            setProcessing(false);
          },
        },
        prefill: {
          name: residentName,
          email: JSON.parse(localStorage.getItem("user"))?.email || "",
          contact: JSON.parse(localStorage.getItem("user"))?.contact || "",
        },
        method: {
          upi: false,
          wallet: true,
          card: true,
          netbanking: true,
        },
        theme: { color: "#6366F1" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Booking/payment error");
      setProcessing(false);
    }
  };

  const handleSubmitMaintenance = async () => {
    if (!maintenance.room || !maintenance.description) {
      toast.error("Please fill all fields");
      return;
    }
    try {
      setProcessing(true);
      await createMaintenanceReport(maintenance);
      toast.success("Maintenance report submitted");
      setMaintenance({ room: "", description: "" });
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit maintenance");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
      />
      <Header residentName={residentName} onLogout={handleLogout} />

      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="loader" />
        </div>
      ) : (
        <main className="grid grid-cols-1 lg:grid-cols-3 mx-auto px-6 py-8 gap-6 max-w-7xl">
          {/* Room Availability */}
          <section className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-indigo-600">
              Room Availability
            </h2>
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {allRooms
                .filter((r) => r.availability)
                .map((room) => (
                  <RoomCard key={room._id} room={room} />
                ))}
            </div>
          </section>

          {/* Booking Form */}
          <section className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-indigo-600 flex items-center gap-2">
              Book Your Room
            </h2>
            <div className="mt-4">
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
                    .filter((room) => room.availability)
                    .map((room) => (
                      <option key={room._id} value={room._id}>
                        {room.roomNumber} — ₹
                        {Number(room.price).toLocaleString()}
                      </option>
                    ))}
                </select>
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
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

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Check-Out Date*
                  </label>
                  <div className="relative">
                    <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      min={booking.checkInDate || today}
                      value={booking.checkOutDate}
                      onChange={(e) =>
                        setBooking({ ...booking, checkOutDate: e.target.value })
                      }
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={handleBookRoom}
                disabled={processing}
                className={`w-full mt-6 bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition ${
                  processing ? "opacity-60 cursor-not-allowed" : ""
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <FaBed />
                  <span>
                    {processing ? "Processing..." : "Book Room & Pay"}
                  </span>
                </div>
              </button>
            </div>
          </section>

          {/* Maintenance */}
          <section className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-indigo-600 flex items-center gap-2">
              <FaTools /> Report Maintenance Issue
            </h2>

            <div className="mt-4">
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

              <label className="block text-sm font-bold text-gray-700 mb-2 mt-4">
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

              <button
                onClick={handleSubmitMaintenance}
                disabled={processing}
                className={`w-full mt-4 bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition ${
                  processing ? "opacity-60 cursor-not-allowed" : ""
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <FaTools />
                  <span>Submit Report</span>
                </div>
              </button>
            </div>
          </section>
        </main>
      )}
    </div>
  );
}
