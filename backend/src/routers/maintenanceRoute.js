import express from "express";
import {
  createMaintenanceReport,
  getAllReport,
} from "../controllers/maintenanceControllers.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

const router = express.Router();
router.use(authMiddleware);

router.post(
  "/create_maintenance",
  roleMiddleware(["resident"]),
  createMaintenanceReport
);
router.get("/", roleMiddleware(["admin"]), getAllReport);

export default router;
