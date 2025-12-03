import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

const backend = import.meta.env.VITE_BACKEND_URL;

const RoomDetailsPage = () => {
  const { roomId } = useParams();
  const [room, setRoom] = useState(null);

  const getImageUrl = (path) => `${backend}${path}`;

  useEffect(() => {
    async function loadRoom() {
      const res = await axios.get(`${backend}/api/rooms/${roomId}`);
      setRoom(res.data.room);
    }
    loadRoom();
  }, [roomId]);

  if (!room) {
    return <div className="p-6">Loading details...</div>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Swiper
        navigation={true}
        modules={[Navigation]}
        spaceBetween={10}
        slidesPerView={1}
        className="rounded-xl overflow-hidden shadow-lg"
      >
        {room.images.map((img, i) => (
          <SwiperSlide key={i}>
            <img
              src={getImageUrl(img)}
              className="w-full h-80 object-cover"
              alt="Room"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="mt-6 bg-white p-6 rounded-xl shadow">
        <h1 className="text-3xl font-bold">{room.roomType} Room</h1>

        <p className="text-lg text-gray-600">{room.address}</p>

        <p className="mt-4 text-2xl font-bold text-green-600">
          ₹{room.price} / month
        </p>

        <div className="mt-4 text-gray-700">
          <p>
            <strong>City:</strong> {room.city}
          </p>
          <p>
            <strong>Capacity:</strong> {room.capacity} people
          </p>
          <p>
            <strong>Available Beds:</strong> {room.availableBeds}
          </p>
        </div>

        {room.amenities?.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2">Amenities</h3>
            <div className="flex flex-wrap gap-2">
              {room.amenities.map((a, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-gray-100 rounded-full text-gray-700"
                >
                  {a}
                </span>
              ))}
            </div>
          </div>
        )}

        <button className="mt-6 w-full bg-green-600 text-white py-3 rounded-lg text-lg hover:bg-green-700">
          Book This Room
        </button>
      </div>
    </div>
  );
};

export default RoomDetailsPage;
