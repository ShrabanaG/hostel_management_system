import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { METRO_CITY_GRID } from "../../constants";
import CreateRoomDrawer from "./CreateRoomDialog";

const backend = import.meta.env.VITE_BACKEND_URL;

export default function RoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [searchCity, setSearchCity] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);

  const navigate = useNavigate();

  console.log("Backend", backend);

  const getImageUrl = (path) => {
    if (!path) return "";
    return `${backend.replace(/\/$/, "")}${path}`;
  };

  const fetchRooms = async (city) => {
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await axios.get(`${backend}/api/rooms/city/${city}`);

      if (res.data.rooms.length === 0) {
        setErrorMsg(`No rooms found in “${city}”`);
        setRooms([]);
      } else {
        setRooms(res.data.rooms);
      }
    } catch {
      setErrorMsg("City not found or no results.");
      setRooms([]);
    }

    setLoading(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Available Rooms</h1>

        <button
          onClick={() => setOpenDrawer(true)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700"
        >
          + Create Room
        </button>
      </div>

      <h2 className="text-xl font-bold mb-4">Popular Metro Cities</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mb-10">
        {METRO_CITY_GRID.map((city) => (
          <div
            key={city.name}
            onClick={() => navigate(`/admin/rooms/${city.name}`)}
            className="
              relative h-40 rounded-xl cursor-pointer overflow-hidden group 
              shadow-lg hover:scale-[1.03] transition-transform
            "
          >
            <img
              src={city.image}
              alt={city.name}
              className="absolute inset-0 w-full h-full object-cover group-hover:brightness-75 transition-all"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <h3 className="text-xl font-semibold text-white">{city.name}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3 mb-4">
        <input
          type="text"
          placeholder="Search any city…"
          className="w-full p-3 border rounded-lg"
          value={searchCity}
          onChange={(e) => setSearchCity(e.target.value)}
        />
        <button
          onClick={() => fetchRooms(searchCity)}
          className="px-6 py-2 bg-green-600 text-white rounded-lg"
        >
          Search
        </button>
      </div>

      {errorMsg && (
        <p className="text-red-600 text-lg mb-4 font-medium">{errorMsg}</p>
      )}

      {loading && (
        <p className="text-gray-600 text-lg">Loading available rooms…</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {rooms.map((room) => (
          <div key={room._id} className="bg-white rounded-xl shadow p-4">
            <img
              src={getImageUrl(room.images?.[0])}
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
        ))}
      </div>
      <CreateRoomDrawer
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        onSuccess={() => fetchRooms(searchCity)}
      />
    </div>
  );
}
