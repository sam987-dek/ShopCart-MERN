import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  ShoppingCart,
  CheckCircle2,
  AlertTriangle,
  Tag,
  ShieldCheck,
  Truck,
  RotateCcw,
  Loader2,
  AlertCircle,
  Sparkles,
  Zap,
  Plus,
  Minus,
  Heart
} from "lucide-react";
import { fetchProductById, toggleWishlistItem, getWishlist } from "../services/api";
import { formatINR } from "../utils/formatCurrency";
import { useCart } from "../context/CartContext";

const ProductDetails = ({ user, onWishlistChange }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cartSuccessNotice, setCartSuccessNotice] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [wishlistNotice, setWishlistNotice] = useState("");

  const { cartItems, addToCartItem, updateQuantityItem, removeFromCartItem, itemLoadingMap } = useCart();
  const isCartLoading = product ? !!itemLoadingMap[product._id] : false;

  const cartItem = cartItems.find((item) => item.product?._id === id);
  const isInCart = !!cartItem;
  const cartQuantity = cartItem ? cartItem.quantity : 0;

  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (user && id) {
        try {
          const res = await getWishlist();
          const items = res.data.wishlist || (Array.isArray(res.data) ? res.data : []);
          const isSaved = items.some((item) => (item._id || item) === id);
          setIsWishlisted(isSaved);
        } catch (err) {
          console.error("Error checking wishlist status", err);
        }
      }
    };
    checkWishlistStatus();
  }, [id, user]);

  useEffect(() => {
    const getProduct = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetchProductById(id);
        setProduct(res.data.product);
      } catch (err) {
        console.error("fetchProductById error:", err);
        setError(err.response?.data?.message || "Product not found or failed to load.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      getProduct();
    }
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      alert("Please log in to add items to your shopping cart.");
      return;
    }
    const res = await addToCartItem(product._id);
    if (res.success) {
      setCartSuccessNotice(true);
      setTimeout(() => setCartSuccessNotice(false), 3000);
    } else {
      alert(res.message);
    }
  };

  const handleIncreaseQuantity = async () => {
    if (cartQuantity >= product.stock || isCartLoading) return;
    await updateQuantityItem(product._id, cartQuantity + 1);
  };

  const handleDecreaseQuantity = async () => {
    if (isCartLoading) return;
    if (cartQuantity <= 1) {
      await removeFromCartItem(product._id);
    } else {
      await updateQuantityItem(product._id, cartQuantity - 1);
    }
  };

  const handleWishlistToggle = async () => {
    if (!user) return;
    setWishlistLoading(true);
    setWishlistNotice("");
    try {
      const res = await toggleWishlistItem(product._id);
      setIsWishlisted(res.data.saved);
      setWishlistNotice(res.data.saved ? "Added to Wishlist ♥" : "Removed from Wishlist ♡");
      if (onWishlistChange) onWishlistChange();
      setTimeout(() => setWishlistNotice(""), 3000);
    } catch (err) {
      console.error("Wishlist error:", err);
      setWishlistNotice("Unable to update wishlist. Please try again.");
      setTimeout(() => setWishlistNotice(""), 3000);
    } finally {
      setWishlistLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        <p className="mt-4 text-sm font-semibold text-slate-700">Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="w-14 h-14 rounded-3xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Product Not Found</h2>
        <p className="text-sm text-slate-500 mt-2 mb-6">{error || "The product you requested does not exist."}</p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-2xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Catalog
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Back button */}
      <Link
        to="/products"
        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-indigo-600 mb-8 group transition-colors"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Products Catalog
      </Link>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] overflow-hidden p-6 sm:p-10 lg:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Large Product Image Preview */}
          <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-gradient-to-b from-slate-100 to-slate-50 border border-slate-100 shadow-inner">
            <img
              src={
                product.imageUrl ||
                "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80"
              }
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute top-5 left-5 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-slate-800 shadow-sm border border-white/60 flex items-center gap-1.5 uppercase tracking-wide">
              <Tag className="w-3.5 h-3.5 text-indigo-600" />
              {product.category}
            </div>
          </div>

          {/* Product Details Column */}
          <div className="flex flex-col h-full justify-between space-y-8">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                {isOutOfStock ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-rose-50 text-rose-700 border border-rose-200">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Currently Unavailable
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    In Stock ({product.stock} units left)
                  </span>
                )}
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700">
                  <Sparkles className="w-3 h-3 text-indigo-500" />
                  Verified Authentic
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {product.name}
              </h1>

              {/* Price block formatted in INR */}
              <div className="mt-5 p-5 rounded-2xl bg-gradient-to-r from-slate-50 to-indigo-50/40 border border-slate-100 flex items-baseline justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Special Offer Price
                  </span>
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                      {formatINR(product.price)}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">Inclusive of all taxes</span>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100/70 px-2.5 py-1 rounded-lg">
                  <Zap className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
                  Best Value
                </div>
              </div>

              <div className="mt-8 border-t border-slate-100 pt-6">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3">
                  Product Overview & Specifications
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4 pt-2">
              {cartSuccessNotice && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 rounded-2xl flex items-center gap-2 animate-in fade-in duration-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Item added to your shopping cart!</span>
                </div>
              )}

              {wishlistNotice && (
                <div className="p-3.5 bg-indigo-50 border border-indigo-200 text-xs font-semibold text-indigo-800 rounded-2xl flex items-center gap-2 animate-in fade-in duration-300">
                  <Heart className="w-4 h-4 text-rose-500 fill-rose-500 flex-shrink-0" />
                  <span>{wishlistNotice}</span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 items-stretch">
                {/* Cart Action: Quantity selector if in cart, or Add to Cart button if not */}
                {isInCart ? (
                  <div className="flex-1 flex items-center justify-between bg-indigo-50/80 border border-indigo-200 rounded-2xl p-2 px-4 shadow-sm">
                    <button
                      onClick={handleDecreaseQuantity}
                      disabled={isCartLoading}
                      className="w-10 h-10 rounded-xl bg-white text-indigo-700 shadow-sm flex items-center justify-center hover:bg-indigo-100 active:scale-95 transition-all disabled:opacity-40 cursor-pointer"
                      title={cartQuantity === 1 ? "Remove from cart" : "Decrease quantity"}
                    >
                      {isCartLoading ? <Loader2 className="w-4 h-4 animate-spin text-indigo-600" /> : <Minus className="w-4 h-4" />}
                    </button>

                    <div className="text-center px-4">
                      <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider block">In Your Cart</span>
                      <span className="text-base font-extrabold text-indigo-950">
                        {cartQuantity} {cartQuantity === 1 ? "Unit" : "Units"}
                      </span>
                    </div>

                    <button
                      onClick={handleIncreaseQuantity}
                      disabled={isCartLoading || cartQuantity >= product.stock}
                      className="w-10 h-10 rounded-xl bg-white text-indigo-700 shadow-sm flex items-center justify-center hover:bg-indigo-100 active:scale-95 transition-all disabled:opacity-40 cursor-pointer"
                      title="Increase quantity"
                    >
                      {isCartLoading ? <Loader2 className="w-4 h-4 animate-spin text-indigo-600" /> : <Plus className="w-4 h-4" />}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock || isCartLoading}
                    className="flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 active:scale-[0.99] text-white font-bold text-base shadow-xl shadow-indigo-200/80 flex items-center justify-center gap-2.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isCartLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Adding to Cart...</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-5 h-5" />
                        <span>{isOutOfStock ? "Out of Stock" : "Add to Shopping Cart"}</span>
                      </>
                    )}
                  </button>
                )}

                {/* Wishlist Toggle Button */}
                {user && (
                  <button
                    onClick={handleWishlistToggle}
                    disabled={wishlistLoading}
                    className={`py-4 px-6 rounded-2xl font-bold text-sm border transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-sm ${
                      isWishlisted
                        ? "bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100"
                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {wishlistLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
                    ) : (
                      <>
                        <Heart className={`w-5 h-5 ${isWishlisted ? "fill-rose-500 text-rose-500" : "text-slate-400"}`} />
                        <span>{isWishlisted ? "In Wishlist" : "Wishlist"}</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-3 gap-3 pt-4 text-center">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100/80 flex flex-col items-center">
                  <Truck className="w-5 h-5 text-indigo-600 mb-1.5" />
                  <span className="text-[11px] font-bold text-slate-700">Free Express Delivery</span>
                  <span className="text-[10px] text-slate-400">All India</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100/80 flex flex-col items-center">
                  <ShieldCheck className="w-5 h-5 text-indigo-600 mb-1.5" />
                  <span className="text-[11px] font-bold text-slate-700">1 Year Warranty</span>
                  <span className="text-[10px] text-slate-400">Brand Coverage</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100/80 flex flex-col items-center">
                  <RotateCcw className="w-5 h-5 text-indigo-600 mb-1.5" />
                  <span className="text-[11px] font-bold text-slate-700">7-Day Replacement</span>
                  <span className="text-[10px] text-slate-400">Easy Returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
