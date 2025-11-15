import express from "express";
import {
  createOrder,
  verifyPayment,
} from "../controllers/paymentControllers.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/create-order", createOrder);
router.post("/verify-payment", verifyPayment);

export default router;
