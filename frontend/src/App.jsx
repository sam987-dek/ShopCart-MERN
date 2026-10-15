import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Wishlist from "./pages/Wishlist";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import { getMyProfile, getWishlist } from "./services/api";
import { CartProvider } from "./context/CartContext";

function App() {
  const [user, setUser] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [wishlistCount, setWishlistCount] = useState(0);

  const fetchWishlistCount = async () => {
    if (user) {
      try {
        const res = await getWishlist();
        const items = res.data.wishlist || (Array.isArray(res.data) ? res.data : []);
        setWishlistCount(items.length);
      } catch (err) {
        console.error("Failed to fetch wishlist", err);
      }
    } else {
      setWishlistCount(0);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await getMyProfile();
        setUser(res.data);
      } catch (err) {
        setUser(null);
      } finally {
        setInitialLoading(false);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    fetchWishlistCount();
  }, [user]);

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <CartProvider user={user}>
      <Router>
        <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 font-sans">
          <Navbar user={user} setUser={setUser} wishlistCount={wishlistCount} />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={user ? <Navigate to="/home" replace /> : <Navigate to="/products" replace />} />
              <Route path="/register" element={user ? <Navigate to="/home" replace /> : <Register />} />
              <Route path="/login" element={user ? <Navigate to="/home" replace /> : <Login setUser={setUser} />} />
              <Route path="/home" element={<Home user={user} setUser={setUser} />} />
              <Route path="/products" element={<Products user={user} onWishlistChange={fetchWishlistCount} />} />
              <Route path="/products/:id" element={<ProductDetails user={user} onWishlistChange={fetchWishlistCount} />} />
              <Route path="/wishlist" element={user ? <Wishlist setWishlistCount={setWishlistCount} /> : <Navigate to="/login" replace />} />
              <Route path="/cart" element={user ? <Cart /> : <Navigate to="/login" replace />} />
              <Route path="/checkout" element={user ? <Checkout /> : <Navigate to="/login" replace />} />
              <Route path="/orders" element={user ? <Orders /> : <Navigate to="/login" replace />} />
              <Route path="/orders/:id" element={user ? <OrderDetails /> : <Navigate to="/login" replace />} />
              <Route path="*" element={<Navigate to="/products" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
