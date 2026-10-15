import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Tag, ArrowRight, CheckCircle2, AlertTriangle, Heart, Loader2 } from "lucide-react";
import { formatINR } from "../utils/formatCurrency";

const WishlistCard = ({ product, onRemove }) => {
  const isOutOfStock = product.stock <= 0;
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = async (e) => {
    e.preventDefault();
    setIsRemoving(true);
    try {
      await onRemove(product._id);
    } catch (err) {
      console.error("Failed to remove", err);
      setIsRemoving(false);
    }
  };

  return (
    <div className="group relative bg-white rounded-3xl border border-slate-100/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-15px_rgba(79,70,229,0.15)] hover:border-indigo-100 transition-all duration-500 flex flex-col overflow-hidden hover:-translate-y-1.5">
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
          
          <button
            onClick={handleRemove}
            disabled={isRemoving}
            className="bg-white/95 backdrop-blur-md text-rose-500 p-2 rounded-full shadow-sm hover:text-white hover:bg-rose-500 transition-colors border border-white/50 focus:outline-none focus:ring-2 focus:ring-rose-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Remove from wishlist"
          >
            {isRemoving ? (
              <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
            ) : (
              <Heart className="w-4 h-4 fill-rose-500" />
            )}
          </button>
        </div>
      </div>

      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1 tracking-tight">
            {product.name}
          </h3>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
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
            className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50/80 hover:bg-indigo-600 hover:text-white px-3.5 py-2 rounded-xl transition-all duration-300 shadow-sm shadow-indigo-100 hover:shadow-indigo-200 group/btn"
          >
            <span>View</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WishlistCard;
