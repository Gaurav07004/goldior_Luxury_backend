import express from "express"
import {addOrder, getOrders} from "../controllers/order.controller.js";


const router = express.Router();

router.post("/add", addOrder)
router.get("/", getOrders)

export default router;