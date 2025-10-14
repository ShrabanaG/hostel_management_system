import express from "express";
import {
  getAllResidents,
  getEachResident,
  createResident,
  updateResident,
  deleteResident,
} from "../controllers/residentControllers.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", roleMiddleware(["admin"]), getAllResidents);
router.post("/", roleMiddleware(["admin"]), createResident);
router.put("/:id", roleMiddleware(["admin"]), updateResident);
router.delete("/:id", roleMiddleware(["admin"]), deleteResident);

router.get("/:id", roleMiddleware(["resident", "admin"]), getEachResident);

export default router;
