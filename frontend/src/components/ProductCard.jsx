import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Tag,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Heart,
  Loader2,
  ShoppingCart,
  Check,
  Star,
} from "lucide-react";
import { formatINR } from "../utils/formatCurrency";
import { toggleWishlistItem } from "../services/api";
import { useCart } from "../context/CartContext";

const ProductCard = ({ product, user, wishlistedIds = [], onWishlistChange }) => {
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);
  const [cartNotice, setCartNotice] = useState("");
  const isWishlisted = wishlistedIds.includes(product._id);

  const { cartItems, addToCartItem, itemLoadingMap } = useCart();
  const isCartLoading = !!itemLoadingMap[product._id];

  // Check if item is already in cart
  const cartItem = cartItems.find((item) => item.product?._id === product._id);
  const isInCart = !!cartItem;
  const cartQty = cartItem ? cartItem.quantity : 0;

  // Stable simulated rating based on product ID
  const rating = 4.0 + (parseInt(product._id.slice(-2), 16) % 10) * 0.1;

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please log in to add items to your wishlist.");
      return;
    }

    setIsTogglingWishlist(true);
    try {
      await toggleWishlistItem(product._id);
      if (onWishlistChange) {
        onWishlistChange();
      }
    } catch (err) {
      console.error("Wishlist toggle error:", err);
    } finally {
      setIsTogglingWishlist(false);
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please log in to add items to your shopping cart.");
      return;
    }
    const res = await addToCartItem(product._id);
    if (res.success) {
      setCartNotice(res.message);
      setTimeout(() => setCartNotice(""), 2500);
    } else {
      alert(res.message);
    }
  };

  return (
    <div className="group relative bg-white rounded-3xl border border-slate-200/80 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_-15px_rgba(79,70,229,0.12)] hover:border-indigo-200 transition-all duration-300 flex flex-col overflow-hidden hover:-translate-y-1">
      {/* Image Container with subtle background */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center p-3">
        <img
          src={
            product.imageUrl ||
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80"
          }
          alt={product.name}
          className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Ambient gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Category Badge */}
        <div className="absolute top-3.5 left-3.5 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-slate-700 shadow-xs border border-slate-100 flex items-center gap-1.5 tracking-wide">
          <Tag className="w-3 h-3 text-indigo-600" />
          <span>{product.category}</span>
        </div>

        {/* Top-Right Badges & Wishlist Button */}
        <div className="absolute top-3.5 right-3.5 flex flex-col gap-1.5 items-end">
          {/* Wishlist Button */}
          <button
            onClick={handleWishlistToggle}
            disabled={isTogglingWishlist}
            className="w-8 h-8 rounded-full bg-white/95 backdrop-blur-md shadow-xs border border-slate-100 flex items-center justify-center text-slate-500 hover:text-rose-500 hover:bg-rose-50 transition-all active:scale-95 cursor-pointer"
            title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            {isTogglingWishlist ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-400" />
            ) : (
              <Heart
                className={`w-4 h-4 transition-colors ${
                  isWishlisted ? "fill-rose-500 text-rose-500" : ""
                }`}
              />
            )}
          </button>

          {/* Stock Badges */}
          {isOutOfStock ? (
            <span className="bg-rose-500/90 backdrop-blur-md text-white px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider uppercase shadow-xs flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> Out
            </span>
          ) : isLowStock ? (
            <span className="bg-amber-500/90 backdrop-blur-md text-white px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider uppercase shadow-xs flex items-center gap-1">
              Only {product.stock} left
            </span>
          ) : (
            <span className="bg-emerald-500/90 backdrop-blur-md text-white px-2 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider uppercase shadow-xs flex items-center gap-1">
              <CheckCircle2 className="w-2.5 h-2.5" /> In Stock
            </span>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Rating & Stock Counter */}
          <div className="flex items-center justify-between text-xs mb-1.5">
            <div className="flex items-center gap-1 text-amber-500 font-bold text-[11px]">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{rating.toFixed(1)}</span>
              <span className="text-slate-400 font-normal">({product.stock * 4 + 12})</span>
            </div>
            <span className="text-[11px] font-semibold text-slate-400">
              {product.stock} available
            </span>
          </div>

          <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1 tracking-tight">
            {product.name}
          </h3>
          <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {cartNotice && (
          <div className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5 animate-in fade-in">
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span>{cartNotice}</span>
          </div>
        )}

        {/* Pricing & Actions */}
        <div className="pt-3 border-t border-slate-100 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Price (INR)
              </span>
              <span className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-indigo-950 transition-colors">
                {formatINR(product.price)}
              </span>
            </div>

            <Link
              to={`/products/${product._id}`}
              className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 px-3 py-1.5 rounded-xl transition-all"
            >
              <span>View</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock || isCartLoading}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
              isOutOfStock
                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                : isInCart
                ? "bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100"
                : "bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white shadow-sm shadow-indigo-200"
            } disabled:opacity-50`}
          >
            {isCartLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Adding...</span>
              </>
            ) : isInCart ? (
              <>
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>In Cart ({cartQty})</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
