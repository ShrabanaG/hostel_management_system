import express from "express";
import {
  getAllRooms,
  allocateRoom,
  freeEachRoom,
  createRoom,
} from "../controllers/roomControllers.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getAllRooms);
router.post("/add_room", roleMiddleware(["admin"]), createRoom);
router.post("/allocate", roleMiddleware(["admin"]), allocateRoom);
router.post("/free/:id", roleMiddleware(["admin"]), freeEachRoom);

export default router;
