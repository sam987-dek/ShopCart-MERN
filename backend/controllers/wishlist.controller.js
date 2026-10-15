import mongoose from "mongoose";
import Customer from "../models/customer.model.js";
import Product from "../models/product.model.js";

export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ success: false, message: "Invalid product ID" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const customer = req.user;
    
    if (customer.wishlist.includes(productId)) {
      return res.status(409).json({ success: false, message: "Product already in wishlist" });
    }

    customer.wishlist.push(productId);
    await customer.save();

    return res.status(200).json({ success: true, message: "Added to wishlist" });
  } catch (error) {
    console.error("Error in addToWishlist:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getWishlist = async (req, res) => {
  try {
    const customer = await Customer.findById(req.user._id).populate({
      path: "wishlist",
      select: "name price category imageUrl stock description",
    });

    return res.status(200).json({
      success: true,
      count: customer.wishlist.length,
      wishlist: customer.wishlist,
    });
  } catch (error) {
    console.error("Error in getWishlist:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ success: false, message: "Invalid product ID" });
    }

    const customer = req.user;

    if (!customer.wishlist.includes(productId)) {
      return res.status(404).json({ success: false, message: "Product not found in wishlist" });
    }

    customer.wishlist = customer.wishlist.filter(
      (id) => id.toString() !== productId.toString()
    );
    await customer.save();

    return res.status(200).json({ success: true, message: "Removed from wishlist" });
  } catch (error) {
    console.error("Error in removeFromWishlist:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ success: false, message: "Invalid product ID" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const customer = req.user;
    const isSaved = customer.wishlist.includes(productId);

    if (isSaved) {
      customer.wishlist = customer.wishlist.filter(
        (id) => id.toString() !== productId.toString()
      );
      await customer.save();
      return res.status(200).json({ success: true, saved: false, message: "Removed from wishlist" });
    } else {
      customer.wishlist.push(productId);
      await customer.save();
      return res.status(200).json({ success: true, saved: true, message: "Added to wishlist" });
    }
  } catch (error) {
    console.error("Error in toggleWishlist:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
