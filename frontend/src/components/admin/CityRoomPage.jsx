import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import CreateRoomDrawer from "./CreateRoomDialog";

const backend = import.meta.env.VITE_BACKEND_URL;

export default function CityRoomsPage() {
  const { city } = useParams();

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const navigate = useNavigate();

  const getImageUrl = (path) => {
    if (!path) return "";
    return `${backend.replace(/\/$/, "")}${path}`;
  };

  const fetchRooms = useCallback(async () => {
    setLoading(true);

    try {
      const res = await axios.get(`${backend}/api/rooms/city/${city}`);

      if (res.data.rooms.length === 0) {
        setNotFound(true);
      } else {
        setNotFound(false);
      }

      setRooms(res.data.rooms);
    } catch (err) {
      setNotFound(true);
      setRooms([]);
    }

    setLoading(false);
  }, [city]);

  useEffect(() => {
    fetchRooms();
  }, [city, fetchRooms]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">
            Rooms in <span className="text-green-600">{city}</span>
          </h1>

          {notFound ? (
            <p className="text-red-600 mt-1">No rooms found in this city.</p>
          ) : (
            <p className="text-gray-600 mt-1">{rooms.length} rooms found.</p>
          )}
        </div>

        <button
          onClick={() => setOpenDrawer(true)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700"
        >
          + Create Room
        </button>
      </div>

      {loading && <p className="text-gray-500">Loading rooms…</p>}

      {notFound && !loading && (
        <div className="text-center py-10 text-gray-600">
          No rooms available in <strong>{city}</strong>.
        </div>
      )}

      {!loading && !notFound && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {rooms.map((room) => {
            return (
              <div
                key={room._id}
                className="bg-white rounded-xl shadow p-4 cursor-pointer"
                onClick={() => navigate(`/admin/rooms/details/${room._id}`)}
              >
                <img
                  src={getImageUrl(room.images?.[0]) || "/placeholder.jpg"}
                  className="w-full h-40 rounded-lg object-cover"
                  alt="Room"
                />

                <h3 className="text-xl font-semibold mt-3">{room.roomType}</h3>
                <p className="text-gray-600">{room.address}</p>

                <p className="mt-2 font-bold text-green-600">
                  ₹{room.price} / month
                </p>

                <p className="text-sm text-gray-500">
                  Available Beds: {room.availableBeds}
                </p>

                <button className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
                  Book Now
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Slide Drawer */}
      <CreateRoomDrawer
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        onSuccess={() => fetchRooms()}
      />
    </div>
  );
}
