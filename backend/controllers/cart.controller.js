import mongoose from "mongoose";
import Customer from "../models/customer.model.js";
import Product from "../models/product.model.js";

// Helper to get fully populated user cart
const getPopulatedCart = async (userId) => {
  const customer = await Customer.findById(userId).populate({
    path: "cart.product",
    select: "name price category imageUrl stock description",
  });
  // Filter out any items where the product reference no longer exists
  const validCart = customer.cart.filter((item) => item.product !== null);
  if (validCart.length !== customer.cart.length) {
    customer.cart = validCart;
    await customer.save();
  }
  return customer.cart;
};

// @desc    Add product to cart or increment quantity
// @route   POST /cart/:productId
export const addToCart = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ success: false, message: "Invalid product ID format" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const customer = await Customer.findById(req.user._id);
    const existingItemIndex = customer.cart.findIndex(
      (item) => item.product.toString() === productId
    );

    if (existingItemIndex > -1) {
      // Product exists in cart - increment quantity
      const newQuantity = customer.cart[existingItemIndex].quantity + 1;
      if (newQuantity > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Cannot add more. Maximum available stock is ${product.stock}`,
        });
      }
      customer.cart[existingItemIndex].quantity = newQuantity;
    } else {
      // Product not in cart - add with quantity = 1
      if (product.stock < 1) {
        return res.status(400).json({
          success: false,
          message: "Product is out of stock",
        });
      }
      customer.cart.push({ product: productId, quantity: 1 });
    }

    await customer.save();
    const updatedCart = await getPopulatedCart(req.user._id);

    return res.status(200).json({
      success: true,
      message: "Product added to cart",
      cart: updatedCart,
    });
  } catch (error) {
    console.error("addToCart error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// @desc    Get authenticated user's cart
// @route   GET /cart
export const getCart = async (req, res) => {
  try {
    const cart = await getPopulatedCart(req.user._id);
    return res.status(200).json({
      success: true,
      count: cart.length,
      cart,
    });
  } catch (error) {
    console.error("getCart error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// @desc    Update quantity of product in cart
// @route   PATCH /cart/:productId
export const updateCartQuantity = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ success: false, message: "Invalid product ID format" });
    }

    const parsedQty = Number(quantity);
    if (isNaN(parsedQty) || parsedQty < 1 || !Number.isInteger(parsedQty)) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be an integer greater than or equal to 1",
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    if (parsedQty > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Cannot request ${parsedQty} units. Maximum available stock is ${product.stock}`,
      });
    }

    const customer = await Customer.findById(req.user._id);
    const itemIndex = customer.cart.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: "Product not found in your cart" });
    }

    customer.cart[itemIndex].quantity = parsedQty;
    await customer.save();

    const updatedCart = await getPopulatedCart(req.user._id);

    return res.status(200).json({
      success: true,
      message: "Cart quantity updated",
      cart: updatedCart,
    });
  } catch (error) {
    console.error("updateCartQuantity error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// @desc    Remove product from cart
// @route   DELETE /cart/:productId
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ success: false, message: "Invalid product ID format" });
    }

    const customer = await Customer.findById(req.user._id);
    const itemExists = customer.cart.some((item) => item.product.toString() === productId);

    if (!itemExists) {
      return res.status(404).json({ success: false, message: "Product not found in your cart" });
    }

    customer.cart = customer.cart.filter((item) => item.product.toString() !== productId);
    await customer.save();

    const updatedCart = await getPopulatedCart(req.user._id);

    return res.status(200).json({
      success: true,
      message: "Product removed from cart",
      cart: updatedCart,
    });
  } catch (error) {
    console.error("removeFromCart error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
