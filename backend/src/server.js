import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectToDB from "./config/db.js";
import roomRoutes from "./routers/roomRoutes.js";
import maintenanceRoutes from "./routers/maintenanceRoute.js";
import residentRoutes from "./routers/residentRoutes.js";
import authRoutes from "./routers/authRouters.js";
import paymentRoutes from "./routers/paymentRouter.js";
import financeRoutes from "./routers/financialRouter.js";

dotenv.config();

const app = express();

connectToDB();

app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:5173", process.env.CLIENT_URL],
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);

app.use("/api/residents", residentRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/maintenance", maintenanceRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/report", financeRoutes);

app.listen(process.env.PORT, () => {
  console.log("Server is running");
});
