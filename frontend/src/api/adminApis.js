import axios from "axios";

const base_url = import.meta.env.VITE_BASE_URL;
const token = localStorage.getItem("token");

export const getAllRooms = async () => {
  try {
    if (!token) {
      console.error("No token found in localStorage");
      return;
    }

    const res = await axios.get(`${base_url}/api/rooms/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 200) {
      return res.data;
    }
  } catch (error) {
    console.log("Error message:", error.message);
  }
};

export const getAllResidents = async () => {
  try {
    if (!token) {
      console.error("No token found in localStorage");
      return;
    }

    const res = await axios.get(`${base_url}/api/residents`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 200) {
      return res.data;
    }
  } catch (error) {
    console.log("Error message:", error.message);
  }
};

export const getAllMaintenanceReport = async () => {
  try {
    const res = await axios.get(`${base_url}/api/maintenance`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.status === 200) {
      return res.data;
    }
  } catch (error) {
    console.log("Error fetching data", error);
  }
};

export const createNewRoom = async (data) => {
  try {
    const res = await axios.post(`${base_url}/api/rooms/add_room`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return res.status;
  } catch (error) {
    console.log(error.message);
  }
};
