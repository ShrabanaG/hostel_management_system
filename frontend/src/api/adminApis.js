import api from "./axiosInstance";
import apiPost from "./axiosIntancePost";

export const getAllRooms = async () => {
  const res = await api.get("/api/rooms");
  return res.data;
};

export const getAllResidents = async () => {
  const res = await api.get("/api/residents");
  return res.data;
};

export const getFinancialData = async () => {
  const res = await api.get("/api/report");
  return res.data;
};

export const getAllMaintenanceReport = async () => {
  const res = await api.get("/api/maintenance");
  return res.data;
};

export const createNewRoom = async (data) => {
  try {
    const res = await apiPost.post("/api/rooms/add_room", data);
    return res.status;
  } catch (error) {
    console.log(error.message);
  }
};
