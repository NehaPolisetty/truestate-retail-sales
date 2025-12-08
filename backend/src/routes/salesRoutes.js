// backend/src/routes/salesRoutes.js
import { Router } from "express";
import { getSales } from "../controllers/salesController.js";

const router = Router();

router.get("/", getSales);

export default router;
