import express from "express";
import multer from "multer";
import {
  createRoom,
  uploadRoomImages,
  bookRoom,
  getRoomsByCity,
  getAllRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
  allocateRoom,
  getResidentBookings,
} from "../controllers/roomControllers.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

const router = express.Router();

const upload = multer({ dest: "src/uploads/" });

router.post("/", authMiddleware, roleMiddleware(["admin"]), createRoom);

router.post(
  "/:roomId/images",
  authMiddleware,
  roleMiddleware(["admin"]),
  upload.array("images", 5),
  uploadRoomImages
);

router.post(
  "/allocate",
  authMiddleware,
  roleMiddleware(["resident"]),
  allocateRoom
);

// MUST COME BEFORE :id
router.get(
  "/my-bookings",
  authMiddleware,
  roleMiddleware(["resident"]),
  getResidentBookings
);

router.get("/city/:city", getRoomsByCity);
router.get("/", getAllRooms);

router.get("/:id", getRoomById);

router.patch("/:id", authMiddleware, roleMiddleware(["admin"]), updateRoom);

router.delete("/:id", authMiddleware, roleMiddleware(["admin"]), deleteRoom);

export default router;
