import express from "express";
import dotenv from "dotenv";
import connectToDB from "./config/db.js";
import roomRoutes from "./routers/roomRoutes.js";
import maintenanceRoutes from "./routers/maintenanceRoute.js";
import residentRoutes from "./routers/residentRoutes.js";

dotenv.config();

const app = express();

connectToDB();

app.use(express.json());

app.use("/api/residents", residentRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/maintenance", maintenanceRoutes);

app.listen(process.env.PORT, () => {
  console.log("Server is running");
});
