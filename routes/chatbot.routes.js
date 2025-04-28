import express from "express";
import recommendFragrances from "../controllers/recommend.controller.js";
const router = express.Router();

router.post("/recommend", recommendFragrances);

export default router;
