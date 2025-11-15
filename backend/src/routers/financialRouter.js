import express from "express";
import { getFinancialReport } from "../controllers/financeController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

const router = express.Router();
router.use(authMiddleware);

router.get("/", roleMiddleware(["admin"]), getFinancialReport);

export default router;
