import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Tag, ArrowRight, CheckCircle2, AlertTriangle, Heart, Loader2, ShoppingCart, Check } from "lucide-react";
import { formatINR } from "../utils/formatCurrency";
import { toggleWishlistItem } from "../services/api";
import { useCart } from "../context/CartContext";

const ProductCard = ({ product, user, wishlistedIds = [], onWishlistChange }) => {
  const isOutOfStock = product.stock <= 0;
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);
  const [cartNotice, setCartNotice] = useState("");
  const isWishlisted = wishlistedIds.includes(product._id);

  const { cartItems, addToCartItem, itemLoadingMap } = useCart();
  const isCartLoading = !!itemLoadingMap[product._id];

  // Check if item is already in cart
  const cartItem = cartItems.find((item) => item.product?._id === product._id);
  const isInCart = !!cartItem;
  const cartQty = cartItem ? cartItem.quantity : 0;

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    if (!user) return;

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
    <div className="group relative bg-white rounded-3xl border border-slate-100/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-15px_rgba(79,70,229,0.15)] hover:border-indigo-100 transition-all duration-500 flex flex-col overflow-hidden hover:-translate-y-1.5">
      {/* Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-b from-slate-100 to-slate-50">
        <img
          src={
            product.imageUrl ||
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80"
          }
          alt={product.name}
          className="h-full w-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        <div className="absolute top-3.5 left-3.5 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-slate-700 shadow-sm border border-white/50 flex items-center gap-1.5 tracking-wide uppercase">
          <Tag className="w-3 h-3 text-indigo-600" />
          {product.category}
        </div>

        <div className="absolute top-3.5 right-3.5 flex flex-col gap-2 items-end">
          {isOutOfStock ? (
            <span className="bg-rose-500/95 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wider uppercase shadow-sm flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> Out of stock
            </span>
          ) : (
            <span className="bg-emerald-500/95 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wider uppercase shadow-sm flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> In Stock
            </span>
          )}

          {user && (
            <button
              onClick={handleWishlistToggle}
              disabled={isTogglingWishlist}
              className="bg-white/95 backdrop-blur-md text-slate-700 p-2 rounded-full shadow-sm hover:text-rose-500 hover:bg-rose-50 transition-colors border border-white/50 focus:outline-none focus:ring-2 focus:ring-rose-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              {isTogglingWishlist ? (
                <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
              ) : (
                <Heart className={`w-4 h-4 ${isWishlisted ? "fill-rose-500 text-rose-500" : ""}`} />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Content & Actions */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1 tracking-tight">
            {product.name}
          </h3>
          <p className="mt-1.5 text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {cartNotice && (
          <div className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg flex items-center gap-1 animate-in fade-in">
            <Check className="w-3 h-3 text-emerald-600" />
            <span>{cartNotice}</span>
          </div>
        )}

        <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                Price
              </span>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-indigo-950 transition-colors">
                {formatINR(product.price)}
              </span>
            </div>

            <Link
              to={`/products/${product._id}`}
              className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 px-3 py-1.5 rounded-xl transition-all"
            >
              <span>Details</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock || isCartLoading}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
              isOutOfStock
                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                : isInCart
                ? "bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100"
                : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-100"
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
                <span>Add Another ({cartQty} in cart)</span>
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
