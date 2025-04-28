import express from "express"
import {addProduct, getMostOrderedProducts, getProductById, getProducts }from "../controllers/product.controller.js";

const router = express.Router();

router.post("/add", addProduct)
router.get("/", getProducts)
router.get("/mostOrdered", getMostOrderedProducts)
router.get("/:productId", getProductById);
export default router;