import express from "express";
import protect from "../middlewares/auth.middleware.js";
import {
  addToCart,
  getCart,
  updateCartQuantity,
  removeFromCart,
} from "../controllers/cart.controller.js";

const router = express.Router();

// Protect all cart routes with JWT authentication middleware
router.use(protect);

router.get("/", getCart);
router.post("/:productId", addToCart);
router.patch("/:productId", updateCartQuantity);
router.delete("/:productId", removeFromCart);

export default router;
