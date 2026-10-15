import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, ArrowRight, Loader2, AlertCircle, ShieldCheck, Truck, Sparkles } from "lucide-react";
import { useCart } from "../context/CartContext";
import CartItem from "../components/CartItem";
import { formatINR } from "../utils/formatCurrency";

const Cart = () => {
  const { cartItems, loading, error, totalCount, subtotal, fetchCart } = useCart();
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Header */}
      <div className="mb-10 flex items-center justify-between pb-4 border-b border-slate-200/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Shopping Cart</h1>
            <p className="text-xs text-slate-500 mt-0.5">Review items before proceeding to checkout</p>
          </div>
        </div>

        {!loading && !error && (
          <div className="text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-3.5 py-1.5 rounded-full">
            {totalCount} {totalCount === 1 ? "Item" : "Total Units"} in Cart
          </div>
        )}
      </div>

      {/* 1. Loading State */}
      {loading && (
        <div className="min-h-[380px] flex flex-col items-center justify-center bg-white rounded-3xl border border-slate-100 p-12 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center mb-4">
            <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
          </div>
          <p className="text-base font-bold text-slate-800">Loading your shopping cart...</p>
          <p className="text-xs text-slate-400 mt-1">Syncing persistent inventory data</p>
        </div>
      )}

      {/* 2. Error State */}
      {!loading && error && (
        <div className="min-h-[320px] flex flex-col items-center justify-center bg-rose-50/50 rounded-3xl border border-rose-100 p-8 text-center">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Unable to Load Cart</h3>
          <p className="text-sm text-rose-600 mt-1 max-w-md">{error}</p>
          <button
            onClick={fetchCart}
            className="mt-5 px-5 py-2.5 bg-indigo-600 text-white text-xs font-bold rounded-xl shadow-md hover:bg-indigo-700 transition-colors cursor-pointer"
          >
            Try Again
          </button>
        </div>
      )}

      {/* 3. Empty State */}
      {!loading && !error && cartItems.length === 0 && (
        <div className="min-h-[380px] flex flex-col items-center justify-center bg-white rounded-3xl border border-slate-100 p-12 text-center shadow-sm">
          <div className="w-16 h-16 rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center mb-4">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Your cart is empty 🛒</h3>
          <p className="text-sm text-slate-500 mt-1.5 max-w-sm">
            Looks like you haven't added any products to your cart yet.
          </p>
          <Link
            to="/products"
            className="mt-6 px-6 py-3 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-all shadow-md inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Browse Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* 4. Cart Grid & Order Summary */}
      {!loading && !error && cartItems.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Cart Items List Column */}
          <div className="lg:col-span-8 space-y-4">
            {cartItems.map((item) => (
              <CartItem key={item.product?._id || item._id} item={item} />
            ))}

            <div className="pt-2 flex justify-between items-center">
              <Link
                to="/products"
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1.5 transition-colors"
              >
                <span>← Continue Shopping</span>
              </Link>
            </div>
          </div>

          {/* Order Summary Column */}
          <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm space-y-6 sticky top-24">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight pb-3 border-b border-slate-100">
              Order Summary
            </h2>

            <div className="space-y-3.5 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Unique Line Items</span>
                <span className="font-semibold text-slate-900">{cartItems.length}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Total Quantity</span>
                <span className="font-semibold text-slate-900">{totalCount} units</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery Charge</span>
                <span className="font-semibold text-emerald-600 uppercase text-xs">FREE Express</span>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
                <span className="text-base font-bold text-slate-900">Subtotal</span>
                <div className="text-right">
                  <span className="text-2xl font-extrabold text-slate-900 tracking-tight block">
                    {formatINR(subtotal)}
                  </span>
                  <span className="text-[10px] text-slate-400">Inclusive of all GST taxes</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate("/checkout")}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 active:scale-[0.99] text-white font-bold text-sm shadow-xl shadow-indigo-200/80 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Value Guarantees */}
            <div className="pt-2 space-y-2 text-xs text-slate-500 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                <span>100% Secure Checkout & Buyer Protection</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                <span>Fast & Reliable Express Shipping</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
