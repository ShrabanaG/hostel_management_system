import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getAllRooms,
  allocateRoom,
  createMaintenanceReport,
} from "../api/residentsApis";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  FaBed,
  FaCalendarAlt,
  FaTools,
  FaHome,
  FaCheckCircle,
} from "react-icons/fa";

import { PiBuildingOfficeFill } from "react-icons/pi";
import { CgLogOut } from "react-icons/cg";

const backend = import.meta.env.VITE_BACKEND_URL;

const Header = ({ residentName, onLogout, id }) => {
  const navigate = useNavigate();
  return (
    <header className="bg-white shadow-md border-b sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center shadow-md">
            <PiBuildingOfficeFill className="text-white text-xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-green-700">Dormify</h1>
            <p className="text-xs text-gray-500">Resident Portal</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(`/resident/${id}/bookings`)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
          >
            My Bookings
          </button>
          <span className="font-semibold text-gray-700 hidden sm:block">
            Hi, {residentName}
          </span>

          <button
            onClick={onLogout}
            className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition shadow"
          >
            <CgLogOut /> Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default function ResidentEnrollment() {
  const { id } = useParams();
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

  const [maintenance, setMaintenance] = useState({
    room: "",
    description: "",
  });

  const today = new Date().toISOString().split("T")[0];

  const availableRooms = allRooms.filter((room) => room.availableBeds > 0);
  const isAnyRoomAvailable = availableRooms.length > 0;

  const residentHasBooking = allRooms.some((room) =>
    room.residents.includes(id)
  );

  const fetchAllRooms = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getAllRooms();
      setAllRooms(res.rooms || []);
    } catch (err) {
      toast.error("Failed to load rooms");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllRooms();
  }, [fetchAllRooms]);

  // ----------------------------
  // Load Resident Data
  // ----------------------------
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.role === "resident") {
      setResidentName(user.name);
    } else {
      navigate("/");
    }
  }, [navigate]);

  // ----------------------------
  // Logout
  // ----------------------------
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // ----------------------------
  // Booking Logic
  // ----------------------------
  const validateBooking = () => {
    if (!booking.desireRoom || !booking.checkInDate || !booking.checkOutDate) {
      toast.error("Please complete all fields");
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
    console.log(booking);

    try {
      setProcessing(true);

      const res = await allocateRoom(booking, id);

      if (!res || res.status !== 200) {
        toast.error("Room booking failed");
        setProcessing(false);
        return;
      }

      const roomPrice = res.data.room.price;

      const token =
        localStorage.getItem("resident_token") || localStorage.getItem("token");

      const orderResp = await fetch(`${backend}/api/payment/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          amount: roomPrice,
          resident: id,
          roomId: booking.desireRoom,
        }),
      }).then((r) => r.json());

      if (!orderResp.success) {
        toast.error("Failed to create payment order");
        setProcessing(false);
        return;
      }

      const options = {
        key: orderResp.key,
        amount: orderResp.amount * 100,
        currency: "INR",
        name: "Dormify Hostel Booking",
        description: "Room Booking Payment",
        order_id: orderResp.orderId,
        handler: async function (response) {
          try {
            const verifyResp = await fetch(
              `${backend}/api/payment/verify-payment`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  ...response,
                  resident: id,
                  roomId: booking.desireRoom,
                }),
              }
            ).then((r) => r.json());

            if (verifyResp.success) {
              toast.success("Payment successful 🎉 Your room is booked!");
              setBooking({
                desireRoom: "",
                checkInDate: "",
                checkOutDate: "",
              });
            } else {
              toast.error("Payment verification failed");
            }
          } catch (err) {
            console.error(err);
            toast.error("Payment verification error");
          } finally {
            setProcessing(false);
          }
        },
        prefill: {
          name: residentName,
          email: JSON.parse(localStorage.getItem("user")).email,
        },
        theme: { color: "#16a34a" }, // green-600
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      toast.error("Booking failed");
      setProcessing(false);
    }
  };

  const handleSubmitMaintenance = async () => {
    if (!maintenance.room || !maintenance.description)
      return toast.error("Please fill both fields");

    try {
      await createMaintenanceReport(maintenance);
      toast.success("Maintenance report submitted successfully");
      setMaintenance({ room: "", description: "" });
    } catch {
      toast.error("Failed to submit report");
    }
  };

  useEffect(() => {
    if (!window.Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div className="min-h-screen bg-green-50">
      <ToastContainer position="top-right" autoClose={3000} />
      <Header residentName={residentName} onLogout={handleLogout} id={id} />

      {loading ? (
        <div className="flex justify-center items-center min-h-[70vh]">
          <div className="loader"></div>
        </div>
      ) : (
        <main className="max-w-7xl mx-auto p-6 space-y-12">
          <section className="bg-white border border-green-200 rounded-2xl p-8 shadow-lg">
            <h2 className="text-3xl font-bold text-green-700 flex items-center gap-3">
              <FaHome className="text-green-600" /> Available Rooms
            </h2>
            <p className="text-gray-500">Pick a room that suits you</p>

            {residentHasBooking && (
              <div className="mt-6 bg-green-100 border border-green-300 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-green-700">
                  You already booked a room
                </h3>
                <p className="text-gray-700 mt-1">
                  You can view your booking details below.
                </p>

                <button
                  onClick={() => navigate(`/resident/${id}/bookings`)}
                  className="mt-4 px-5 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700"
                >
                  View My Bookings
                </button>
              </div>
            )}

            {!residentHasBooking && !isAnyRoomAvailable && (
              <div className="mt-6 bg-yellow-100 border border-yellow-300 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-yellow-700">
                  No rooms are available
                </h3>
                <p className="text-gray-700">
                  All rooms are currently full. Please check again later.
                </p>
              </div>
            )}

            {/* CASE 3: Rooms are available (default grid) */}
            {!residentHasBooking && isAnyRoomAvailable && (
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
                {availableRooms.map((room) => (
                  <div
                    key={room._id}
                    className="group bg-white rounded-2xl border border-green-300 overflow-hidden shadow hover:shadow-xl transition cursor-pointer"
                  >
                    {/* Image */}
                    <div className="h-44 bg-gray-100 overflow-hidden relative">
                      <img
                        src={`${backend}${room.images?.[0]}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition"
                      />
                      <span className="absolute top-2 right-2 px-3 py-1 text-xs font-semibold bg-green-600 text-white rounded-full shadow">
                        {room.availableBeds} beds
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-2">
                      <h3 className="text-xl font-bold text-gray-800">
                        {room.roomNumber}
                      </h3>

                      <p className="text-sm text-gray-600">
                        {room.roomType} · {room.city}
                      </p>

                      <p className="text-gray-500 text-sm">{room.address}</p>

                      <p className="text-2xl font-extrabold text-green-600">
                        ₹{room.price}
                        <span className="text-sm font-normal text-gray-500 ml-1">
                          / month
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="bg-white border border-green-200 rounded-2xl p-8 shadow-lg">
            <h2 className="text-3xl font-bold text-green-700 flex items-center gap-3">
              <FaCalendarAlt className="text-green-600" /> Book a Room
            </h2>
            <p className="text-gray-500">Provide details to confirm a room</p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Room Selection */}
              <div>
                <label className="font-semibold">Select Room *</label>
                <select
                  className="w-full mt-2 p-3 border rounded-lg focus:ring-2 focus:ring-green-600"
                  value={booking.desireRoom}
                  onChange={(e) =>
                    setBooking({ ...booking, desireRoom: e.target.value })
                  }
                >
                  <option value="">Choose room</option>
                  {allRooms.map((room) => (
                    <option key={room._id} value={room._id}>
                      {room.roomNumber}
                    </option>
                  ))}
                </select>
              </div>

              {/* Check-in */}
              <div>
                <label className="font-semibold">Check-in *</label>
                <input
                  type="date"
                  min={today}
                  className="w-full mt-2 p-3 border rounded-lg focus:ring-2 focus:ring-green-600"
                  value={booking.checkInDate}
                  onChange={(e) =>
                    setBooking({ ...booking, checkInDate: e.target.value })
                  }
                />
              </div>

              {/* Check-out */}
              <div>
                <label className="font-semibold">Check-out *</label>
                <input
                  type="date"
                  min={booking.checkInDate || today}
                  className="w-full mt-2 p-3 border rounded-lg focus:ring-2 focus:ring-green-600"
                  value={booking.checkOutDate}
                  onChange={(e) =>
                    setBooking({ ...booking, checkOutDate: e.target.value })
                  }
                />
              </div>
            </div>

            <button
              onClick={handleBookRoom}
              disabled={processing}
              className="w-full mt-8 py-4 bg-green-600 text-white rounded-xl text-lg 
           hover:bg-green-700 transition disabled:opacity-50"
            >
              {processing ? "Processing..." : "Confirm Booking & Pay"}
            </button>
          </section>

          {/* ------------------------- */}
          {/* MAINTENANCE SECTION */}
          {/* ------------------------- */}
          <section className="bg-white border border-green-200 rounded-2xl p-8 shadow-lg">
            <h2 className="text-3xl font-bold text-green-700 flex items-center gap-3">
              <FaTools className="text-green-600" /> Maintenance Request
            </h2>
            <p className="text-gray-500">Report an issue in your room</p>

            <div className="mt-6 space-y-4">
              <select
                value={maintenance.room}
                onChange={(e) =>
                  setMaintenance({ ...maintenance, room: e.target.value })
                }
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-600"
              >
                <option value="">Select Room</option>
                {allRooms.map((room) => (
                  <option key={room._id} value={room._id}>
                    {room.roomNumber}
                  </option>
                ))}
              </select>

              <textarea
                className="w-full p-3 border rounded-lg min-h-[120px] focus:ring-2 focus:ring-green-600"
                placeholder="Describe the issue..."
                value={maintenance.description}
                onChange={(e) =>
                  setMaintenance({
                    ...maintenance,
                    description: e.target.value,
                  })
                }
              />

              <button
                onClick={handleSubmitMaintenance}
                className="w-full py-3 bg-green-600 text-white rounded-xl shadow hover:bg-green-700 transition"
              >
                Submit Maintenance Report
              </button>
            </div>
          </section>
        </main>
      )}
    </div>
  );
}
