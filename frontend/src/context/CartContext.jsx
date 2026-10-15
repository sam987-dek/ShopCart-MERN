import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  getCart,
  addToCart as apiAddToCart,
  updateCartQuantity as apiUpdateQuantity,
  removeFromCart as apiRemoveFromCart,
} from "../services/api";

const CartContext = createContext();

export const CartProvider = ({ children, user }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [itemLoadingMap, setItemLoadingMap] = useState({});

  // Fetch cart from backend whenever user logs in or mounts
  const fetchCart = useCallback(async () => {
    if (!user) {
      setCartItems([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await getCart();
      setCartItems(res.data.cart || []);
    } catch (err) {
      console.error("Fetch cart error:", err);
      setError("Unable to load your shopping cart. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Derived values
  const totalCount = cartItems.reduce((acc, item) => acc + (item.quantity || 0), 0);
  
  const subtotal = cartItems.reduce((acc, item) => {
    const price = item.product?.price || 0;
    return acc + price * (item.quantity || 0);
  }, 0);

  // Set loading state for a specific product item
  const setItemLoading = (productId, isBtnLoading) => {
    setItemLoadingMap((prev) => ({
      ...prev,
      [productId]: isBtnLoading,
    }));
  };

  // Add product to cart
  const addToCartItem = async (productId) => {
    if (!user) return { success: false, message: "Please log in to add items to your cart." };
    setItemLoading(productId, true);
    try {
      const res = await apiAddToCart(productId);
      setCartItems(res.data.cart || []);
      return { success: true, message: res.data.message || "Item added to cart" };
    } catch (err) {
      console.error("Add to cart error:", err);
      const msg = err.response?.data?.message || "Failed to add item to cart.";
      return { success: false, message: msg };
    } finally {
      setItemLoading(productId, false);
    }
  };

  // Update item quantity in cart
  const updateQuantityItem = async (productId, newQuantity) => {
    if (!user) return { success: false, message: "Unauthorized" };
    setItemLoading(productId, true);
    try {
      const res = await apiUpdateQuantity(productId, newQuantity);
      setCartItems(res.data.cart || []);
      return { success: true, message: res.data.message || "Cart updated" };
    } catch (err) {
      console.error("Update quantity error:", err);
      const msg = err.response?.data?.message || "Failed to update quantity.";
      return { success: false, message: msg };
    } finally {
      setItemLoading(productId, false);
    }
  };

  // Remove item from cart
  const removeFromCartItem = async (productId) => {
    if (!user) return { success: false, message: "Unauthorized" };
    setItemLoading(productId, true);
    try {
      const res = await apiRemoveFromCart(productId);
      setCartItems(res.data.cart || []);
      return { success: true, message: res.data.message || "Item removed from cart" };
    } catch (err) {
      console.error("Remove from cart error:", err);
      const msg = err.response?.data?.message || "Failed to remove item from cart.";
      return { success: false, message: msg };
    } finally {
      setItemLoading(productId, false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        error,
        totalCount,
        subtotal,
        itemLoadingMap,
        fetchCart,
        addToCartItem,
        updateQuantityItem,
        removeFromCartItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export default CartContext;
