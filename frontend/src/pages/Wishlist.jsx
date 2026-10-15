import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getWishlist, removeFromWishlist } from "../services/api";
import WishlistCard from "../components/WishlistCard";
import { Loader2, AlertCircle, Heart } from "lucide-react";

const Wishlist = ({ setWishlistCount }) => {
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadWishlist = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getWishlist();
      // Assume res.data is an array of populated products or has a structure containing products
      const products = res.data.wishlist || (Array.isArray(res.data) ? res.data : []);
      setWishlistProducts(products);
      if (setWishlistCount) {
        setWishlistCount(products.length);
      }
    } catch (err) {
      console.error("Failed to fetch wishlist:", err);
      setError("Unable to load your wishlist. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  const handleRemove = async (productId) => {
    await removeFromWishlist(productId);
    const newWishlist = wishlistProducts.filter(p => p._id !== productId);
    setWishlistProducts(newWishlist);
    if (setWishlistCount) {
      setWishlistCount(newWishlist.length);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="mb-10 flex items-center justify-between pb-4 border-b border-slate-200/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500 shadow-sm">
            <Heart className="w-5 h-5 fill-rose-500" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Wishlist</h1>
        </div>
        {!loading && !error && (
          <div className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
            {wishlistProducts.length} {wishlistProducts.length === 1 ? "product" : "products"} saved
          </div>
        )}
      </div>

      {loading && (
        <div className="min-h-[380px] flex flex-col items-center justify-center bg-white rounded-3xl border border-slate-100 p-12 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center mb-4">
            <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
          </div>
          <p className="text-base font-bold text-slate-800">Loading your wishlist...</p>
        </div>
      )}

      {!loading && error && (
        <div className="min-h-[320px] flex flex-col items-center justify-center bg-rose-50/50 rounded-3xl border border-rose-100 p-8 text-center">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Oops!</h3>
          <p className="text-sm text-rose-600 mt-1 max-w-md">{error}</p>
          <button
            onClick={loadWishlist}
            className="mt-5 px-5 py-2.5 bg-indigo-600 text-white text-xs font-bold rounded-xl shadow-md hover:bg-indigo-700 transition-colors cursor-pointer"
          >
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && wishlistProducts.length === 0 && (
        <div className="min-h-[380px] flex flex-col items-center justify-center bg-white rounded-3xl border border-slate-100 p-12 text-center shadow-sm">
          <div className="text-5xl mb-4">🤍</div>
          <h3 className="text-lg font-bold text-slate-900">Your wishlist is empty</h3>
          <p className="text-sm text-slate-500 mt-1.5 max-w-sm">
            Start saving products you love.
          </p>
          <Link
            to="/products"
            className="mt-6 px-5 py-2.5 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer"
          >
            Browse Products
          </Link>
        </div>
      )}

      {!loading && !error && wishlistProducts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-7">
          {wishlistProducts.map((product) => (
            <WishlistCard key={product._id} product={product} onRemove={handleRemove} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
