    import express from "express";
    import { addToFavourite, getFavourites } from "../controllers/user.controller.js";

    const router = express.Router();

    router.post("/addToFavourites", addToFavourite);
    router.get("/getFavourites/:userId", getFavourites);

    export default router;
