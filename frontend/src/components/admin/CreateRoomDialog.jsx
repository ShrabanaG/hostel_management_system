import { useState } from "react";
import axios from "axios";
import { CITIES } from "../../constants";

const AMENITIES = [
  "WiFi",
  "Air Conditioning",
  "Laundry",
  "Parking",
  "Power Backup",
  "CCTV",
  "Housekeeping",
  "Kitchen Access",
];

const ROOM_TYPES = ["Single", "Double", "Triple"];

export default function CreateRoomDialog({ open, onClose, onSuccess }) {
  const [roomNumber, setRoomNumber] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [roomType, setRoomType] = useState("");
  const [capacity, setCapacity] = useState("");
  const [price, setPrice] = useState("");
  const [amenities, setAmenities] = useState([]);
  const [images, setImages] = useState([]);

  const backend = import.meta.env.VITE_BACKEND_URL;

  if (!open) return null;

  const handleRoomType = (type) => {
    setRoomType(type);
    setCapacity(type === "Single" ? 1 : type === "Double" ? 2 : 3);
  };

  const toggleAmenity = (item) => {
    setAmenities((prev) =>
      prev.includes(item) ? prev.filter((a) => a !== item) : [...prev, item]
    );
  };

  const handleUploadFiles = (files) => {
    files = Array.from(files);

    if (images.length + files.length > 5) return alert("Max 5 images allowed.");

    setImages([...images, ...files]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleUploadFiles(e.dataTransfer.files);
  };

  const handleCreateRoom = async () => {
    if (!roomNumber || !city || !address || !roomType || !price)
      return alert("All fields are required");

    try {
      // Step 1: Create Room
      const res = await axios.post(
        `${backend}/api/rooms`,
        {
          roomNumber,
          city,
          address,
          roomType,
          capacity,
          price,
          amenities,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      const roomId = res.data.room._id;

      // Step 2: Upload Images
      if (images.length > 0) {
        const formData = new FormData();
        images.forEach((img) => formData.append("images", img));

        await axios.post(`${backend}/api/rooms/${roomId}/images`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.log(error);
      alert("Error creating room");
    }
  };

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose}></div>

      {/* Dialog Container */}
      <div className="fixed inset-0 flex justify-center items-center z-50 p-4">
        <div
          className="
          bg-white w-full max-w-xl p-6 rounded-xl shadow-xl 
          animate-fadeIn max-h-[90vh] overflow-y-auto
        "
        >
          {/* HEADER */}
          <div className="flex justify-between items-center mb-4 sticky top-0 bg-white pb-2">
            <h2 className="text-2xl font-bold">Create Room</h2>
            <button onClick={onClose} className="text-xl">
              ✕
            </button>
          </div>

          {/* FORM */}
          <div className="space-y-4">
            {/* Room Number */}
            <div>
              <label>Room Number *</label>
              <input
                className="w-full mt-1 p-2 border rounded-lg"
                placeholder="Ex: A-202"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
              />
            </div>

            {/* City */}
            <div>
              <label>City *</label>
              <select
                className="w-full mt-1 p-2 border rounded-lg bg-white"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              >
                <option value="">Select a city</option>
                {CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Address */}
            <div>
              <label>Address *</label>
              <textarea
                rows="2"
                className="w-full mt-1 p-2 border rounded-lg"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              ></textarea>
            </div>

            {/* Room Type */}
            <div>
              <label>Room Type *</label>
              <div className="flex gap-3 mt-2">
                {ROOM_TYPES.map((type) => (
                  <button
                    key={type}
                    onClick={() => handleRoomType(type)}
                    className={`
                    px-4 py-2 rounded-lg border 
                    ${
                      roomType === type
                        ? "bg-green-600 text-white"
                        : "bg-gray-100"
                    }
                  `}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Price */}
            <div>
              <label>Price (₹ per month) *</label>
              <input
                type="number"
                className="w-full mt-1 p-2 border rounded-lg"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>

            {/* Amenities */}
            <div>
              <label>Amenities</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {AMENITIES.map((a) => (
                  <button
                    key={a}
                    onClick={() => toggleAmenity(a)}
                    className={`
                    px-3 py-1 rounded-full border
                    ${
                      amenities.includes(a)
                        ? "bg-green-600 text-white"
                        : "bg-gray-100"
                    }
                  `}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>

            {/* FILE UPLOAD */}
            <div>
              <label>Upload Images (max 5)</label>

              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => document.getElementById("fileInputRoom").click()}
                className="
                w-full h-32 mt-2 border border-dashed border-gray-400 
                rounded-lg flex flex-col items-center justify-center
                cursor-pointer hover:bg-gray-50
              "
              >
                <p className="text-gray-500 text-sm">
                  Drag & Drop or Click to Upload
                </p>
              </div>

              <input
                id="fileInputRoom"
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={(e) => handleUploadFiles(e.target.files)}
              />

              <div className="flex gap-2 flex-wrap mt-3">
                {images.map((img, index) => (
                  <img
                    key={index}
                    src={URL.createObjectURL(img)}
                    className="h-20 w-20 rounded-lg object-cover border"
                  />
                ))}
              </div>
            </div>

            {/* BUTTONS */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded-lg"
                onClick={onClose}
              >
                Cancel
              </button>

              <button
                className="px-4 py-2 bg-green-600 text-white rounded-lg"
                onClick={handleCreateRoom}
              >
                Create Room
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
