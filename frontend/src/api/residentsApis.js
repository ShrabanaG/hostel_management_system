import axios from "axios";

const base_url = import.meta.env.VITE_BASE_URL;
const residentToken = localStorage.getItem("resident_token");

export const allocateRoom = async (data, id) => {
  try {
    const res = await axios.post(
      `${base_url}/api/rooms/allocate`,
      {
        userId: id,
        desireRoom: data.desireRoom,
        checkInDate: data.checkInDate,
        checkOutDate: data.checkOutDate,
      },
      {
        headers: {
          Authorization: `Bearer ${residentToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (res.status === 200) {
      return res;
    }
  } catch (error) {
    console.log("Error in finding room", error);
  }
};

export const getAllRooms = async () => {
  try {
    if (!residentToken) {
      console.error("No token found in localStorage");
      return;
    }

    const res = await axios.get(`${base_url}/api/rooms/`, {
      headers: {
        Authorization: `Bearer ${residentToken}`,
      },
    });

    if (res.status === 200) {
      return res.data;
    }
  } catch (error) {
    console.log("Error message:", error.message);
  }
};
