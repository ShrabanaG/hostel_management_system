import { useEffect, useState } from "react";
import { getMyBookings } from "../../api/residentsApis";
import { FaCalendarAlt, FaHome } from "react-icons/fa";

const backend = import.meta.env.VITE_BACKEND_URL;

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await getMyBookings();
      setBookings(data || []);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-green-700 mb-6 flex items-center gap-2">
        <FaHome className="text-green-600" /> My Bookings
      </h1>

      {bookings.length === 0 ? (
        <p className="text-gray-600 text-lg text-center py-10">
          You haven't booked any rooms yet.
        </p>
      ) : (
        <div className="space-y-6">
          {bookings.map((b, index) => (
            <div
              key={index}
              className="bg-white shadow-md p-6 rounded-xl border border-green-200"
            >
              <div className="flex flex-col md:flex-row gap-6">
                {/* Image */}
                <div className="w-full md:w-48 h-48 overflow-hidden rounded-lg border">
                  <img
                    src={`${backend}${b.images?.[0]}`}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Room {b.roomNumber}
                  </h2>
                  <p className="text-gray-600">
                    {b.roomType} • {b.city}
                  </p>
                  <p className="text-gray-500 text-sm">{b.address}</p>

                  <p className="text-xl font-bold text-green-600 mt-2">
                    ₹{b.price}{" "}
                    <span className="text-sm text-gray-500">/ month</span>
                  </p>

                  {/* Dates */}
                  <div className="mt-4 flex items-center gap-2 text-sm text-gray-700">
                    <FaCalendarAlt className="text-green-600" />
                    <span>
                      {new Date(b.checkInDate).toDateString()} →{" "}
                      {new Date(b.checkOutDate).toDateString()}
                    </span>
                  </div>

                  {/* Payment Status */}
                  <span
                    className={`inline-block mt-4 px-3 py-1 rounded-full text-white text-xs font-semibold ${
                      b.paymentStatus === "paid"
                        ? "bg-green-600"
                        : b.paymentStatus === "pending"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                  >
                    {b.paymentStatus.toUpperCase()}
                  </span>

                  <button className="mt-4 block px-4 py-2 bg-green-600 text-white rounded-xl text-sm hover:bg-green-700 transition">
                    View Room Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
