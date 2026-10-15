import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";

import customerRoutes from "./routes/customer.routes.js";
import productRoutes from "./routes/product.routes.js";
import wishlistRoutes from "./routes/wishlist.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import orderRoutes from "./routes/order.routes.js";

dotenv.config();

const app = express();

// Trust proxy in production (required for secure cookies behind Vercel/Render proxies)
app.set("trust proxy", 1);

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app") ||
        origin.endsWith(".onrender.com") ||
        process.env.NODE_ENV !== "production"
      ) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes (direct and /api prefixed for Vercel Services routing)
app.use("/customers", customerRoutes);
app.use("/products", productRoutes);
app.use("/wishlist", wishlistRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);

app.use("/api/customers", customerRoutes);
app.use("/api/products", productRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

app.get(["/", "/api"], (req, res) => {
  res.json({ message: "ShopKart API is running" });
});

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

let isConnected = false;
export const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  const uri = process.env.MONGO_URI || MONGO_URI;
  if (!uri) {
    throw new Error("MONGO_URI environment variable is not defined");
  }
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000,
  });
  isConnected = true;
  console.log("✅ Connected to MongoDB");
};

// Ensure DB is connected on incoming requests (serverless friendly)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Database connection failed",
      error: err.message,
    });
  }
});

app.get("/api/db-status", async (req, res) => {
  try {
    await connectDB();
    res.json({
      status: "connected",
      readyState: mongoose.connection.readyState,
      hasMongoUri: Boolean(process.env.MONGO_URI),
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
      hasMongoUri: Boolean(process.env.MONGO_URI),
    });
  }
});

// For persistent servers (local dev, Render, Railway), listen on PORT
if (!process.env.VERCEL) {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  });
}

export default app;
