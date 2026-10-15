import express from "express";
import protect from "../middlewares/auth.middleware.js";
import { addToWishlist, getWishlist, removeFromWishlist, toggleWishlist } from "../controllers/wishlist.controller.js";

const router = express.Router();

router.use(protect);

router.get("/", getWishlist);
router.post("/:productId", addToWishlist);
router.delete("/:productId", removeFromWishlist);
router.patch("/:productId/toggle", toggleWishlist);

export default router;
