import express from "express";
import { registerUser, logIn } from "../controllers/authControllers.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/login", logIn);
router.post("/register", registerUser);

router.get(
  "/admin-dashboard",
  authMiddleware,
  roleMiddleware(["admin"]),
  (req, res) => {
    res.json({ message: "Welcome Admin!" });
  }
);

router.get(
  "/profile",
  authMiddleware,
  roleMiddleware(["resident", "admin"]),
  (req, res) => {
    res.json({ userId: req.user.id, role: req.user.role });
  }
);

export default router;
