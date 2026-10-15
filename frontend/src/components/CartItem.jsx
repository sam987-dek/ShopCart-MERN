import React from "react";
import { Link } from "react-router-dom";
import { Plus, Minus, Trash2, Tag, Loader2, AlertCircle } from "lucide-react";
import { formatINR } from "../utils/formatCurrency";
import { useCart } from "../context/CartContext";

const CartItem = ({ item }) => {
  const { updateQuantityItem, removeFromCartItem, itemLoadingMap } = useCart();
  const { product, quantity } = item;

  if (!product) return null;

  const isItemLoading = !!itemLoadingMap[product._id];
  const isAtMaxStock = quantity >= product.stock;
  const isAtMinQty = quantity <= 1;
  const itemTotal = (product.price || 0) * quantity;

  const handleIncrease = async () => {
    if (isAtMaxStock || isItemLoading) return;
    await updateQuantityItem(product._id, quantity + 1);
  };

  const handleDecrease = async () => {
    if (isAtMinQty || isItemLoading) return;
    await updateQuantityItem(product._id, quantity - 1);
  };

  const handleRemove = async () => {
    if (isItemLoading) return;
    await removeFromCartItem(product._id);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      {/* Left section: Product Thumbnail & Meta */}
      <div className="flex items-center gap-4 w-full sm:w-auto">
        <Link to={`/products/${product._id}`} className="relative aspect-square w-20 sm:w-24 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 group">
          <img
            src={product.imageUrl || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80"}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          />
        </Link>

        <div className="flex-1 min-w-0">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-600 uppercase tracking-wider mb-1">
            <Tag className="w-2.5 h-2.5" />
            {product.category}
          </span>
          <Link to={`/products/${product._id}`} className="block">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate hover:text-indigo-600 transition-colors">
              {product.name}
            </h3>
          </Link>
          <p className="text-xs text-slate-500 mt-0.5">
            Unit Price: <span className="font-semibold text-slate-700">{formatINR(product.price)}</span>
          </p>

          {/* Stock hint */}
          {isAtMaxStock && (
            <p className="text-[11px] font-semibold text-amber-600 flex items-center gap-1 mt-1">
              <AlertCircle className="w-3 h-3" /> Max available stock reached ({product.stock} units)
            </p>
          )}
        </div>
      </div>

      {/* Right section: Quantity controls & Item Subtotal */}
      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
        {/* Quantity Controls */}
        <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200/80">
          <button
            onClick={handleDecrease}
            disabled={isAtMinQty || isItemLoading}
            className="w-7 h-7 rounded-lg bg-white text-slate-700 flex items-center justify-center shadow-xs hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all focus:outline-none"
            title="Decrease quantity"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>

          <span className="w-8 text-center text-sm font-extrabold text-slate-900">
            {isItemLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin mx-auto text-indigo-600" /> : quantity}
          </span>

          <button
            onClick={handleIncrease}
            disabled={isAtMaxStock || isItemLoading}
            className="w-7 h-7 rounded-lg bg-white text-slate-700 flex items-center justify-center shadow-xs hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all focus:outline-none"
            title="Increase quantity"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Item Total */}
        <div className="text-right min-w-[90px]">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Total</span>
          <span className="text-base font-extrabold text-slate-900">{formatINR(itemTotal)}</span>
        </div>

        {/* Remove Button */}
        <button
          onClick={handleRemove}
          disabled={isItemLoading}
          className="p-2 text-rose-500 hover:text-white hover:bg-rose-500 rounded-xl transition-colors border border-rose-100 bg-rose-50/50 disabled:opacity-50"
          title="Remove from cart"
        >
          {isItemLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};

export default CartItem;
