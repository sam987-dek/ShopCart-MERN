import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ShoppingBag, LogOut, User, Package, LogIn, UserPlus, Heart } from "lucide-react";
import { logoutUser } from "../services/api";
import { useCart } from "../context/CartContext";

const Navbar = ({ user, setUser, wishlistCount = 0 }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { totalCount } = useCart();

  const handleLogout = async () => {
    try {
      await logoutUser();
      setUser(null);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
      setUser(null);
      navigate("/login");
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to={user ? "/home" : "/products"} className="flex items-center space-x-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-100 group-hover:scale-105 transition-transform">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <span className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-indigo-950 to-indigo-700 tracking-tight">
              ShopKart
            </span>
          </Link>

          <nav className="flex items-center space-x-1 sm:space-x-4">
            <Link
              to="/products"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                isActive("/products")
                  ? "text-indigo-600 bg-indigo-50 font-semibold"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Explore Products</span>
            </Link>

            {user ? (
              <>
                <Link
                  to="/wishlist"
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                    isActive("/wishlist")
                      ? "text-indigo-600 bg-indigo-50 font-semibold"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <div className="relative inline-flex items-center justify-center">
                    <Heart className={`w-4 h-4 ${wishlistCount > 0 ? "text-rose-500 fill-rose-500/20" : ""}`} />
                    {wishlistCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-[10px] font-extrabold h-4 min-w-[16px] px-1 rounded-full flex items-center justify-center leading-none shadow-sm border border-white">
                        {wishlistCount}
                      </span>
                    )}
                  </div>
                  <span className="hidden sm:inline">Wishlist</span>
                </Link>

                <Link
                  to="/cart"
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                    isActive("/cart")
                      ? "text-indigo-600 bg-indigo-50 font-semibold"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <div className="relative inline-flex items-center justify-center">
                    <ShoppingBag className="w-4 h-4 text-indigo-600" />
                    {totalCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-[10px] font-extrabold h-4 min-w-[16px] px-1 rounded-full flex items-center justify-center leading-none shadow-sm border border-white">
                        {totalCount}
                      </span>
                    )}
                  </div>
                  <span className="hidden sm:inline">Cart</span>
                </Link>

                <Link
                  to="/orders"
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    isActive("/orders")
                      ? "text-indigo-600 bg-indigo-50 font-semibold"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <Package className="w-4 h-4" />
                  <span className="hidden sm:inline">My Orders</span>
                </Link>

                <Link
                  to="/home"
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    isActive("/home")
                      ? "text-indigo-600 bg-indigo-50 font-semibold"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">My Account</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 ml-2 px-3.5 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100/80 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-red-500/20 active:scale-95 cursor-pointer"
                  title="Logout from ShopKart"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-2 pl-2 border-l border-gray-200">
                <Link
                  to="/login"
                  className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                    isActive("/login")
                      ? "text-indigo-600 bg-indigo-50 font-semibold"
                      : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
                  }`}
                >
                  <LogIn className="w-4 h-4" />
                  <span>Log in</span>
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm shadow-indigo-200 transition-all hover:shadow-indigo-300 active:scale-95"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Register</span>
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
