import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Package, ArrowRight, Loader2, AlertCircle, ShoppingBag, Clock, CheckCircle2, Truck, Check } from "lucide-react";
import { getMyOrders } from "../services/api";
import { formatINR } from "../utils/formatCurrency";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getMyOrders();
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error("Fetch orders error:", err);
      setError("Unable to load your order history. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.body.style.overflow = "unset";
    document.documentElement.style.overflow = "unset";
    fetchOrders();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case "PLACED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
            <CheckCircle2 className="w-3 h-3 text-indigo-600" /> Placed
          </span>
        );
      case "CONFIRMED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
            <Check className="w-3 h-3 text-blue-600" /> Confirmed
          </span>
        );
      case "SHIPPED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-100">
            <Truck className="w-3 h-3 text-amber-600" /> Shipped
          </span>
        );
      case "DELIVERED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Delivered
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
            <Clock className="w-3 h-3" /> {status}
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Header */}
      <div className="mb-10 flex items-center justify-between pb-4 border-b border-slate-200/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Orders</h1>
            <p className="text-xs text-slate-500 mt-0.5">Track and view your past ShopKart purchases</p>
          </div>
        </div>

        {!loading && !error && (
          <div className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full">
            {orders.length} {orders.length === 1 ? "Order Placed" : "Orders Placed"}
          </div>
        )}
      </div>

      {/* 1. Loading State */}
      {loading && (
        <div className="min-h-[380px] flex flex-col items-center justify-center bg-white rounded-3xl border border-slate-100 p-12 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center mb-4">
            <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
          </div>
          <p className="text-base font-bold text-slate-800">Loading your order history...</p>
        </div>
      )}

      {/* 2. Error State */}
      {!loading && error && (
        <div className="min-h-[320px] flex flex-col items-center justify-center bg-rose-50/50 rounded-3xl border border-rose-100 p-8 text-center">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Unable to Load Orders</h3>
          <p className="text-sm text-rose-600 mt-1 max-w-md">{error}</p>
          <button
            onClick={fetchOrders}
            className="mt-5 px-5 py-2.5 bg-indigo-600 text-white text-xs font-bold rounded-xl shadow-md hover:bg-indigo-700 transition-colors cursor-pointer"
          >
            Try Again
          </button>
        </div>
      )}

      {/* 3. Empty State */}
      {!loading && !error && orders.length === 0 && (
        <div className="min-h-[380px] flex flex-col items-center justify-center bg-white rounded-3xl border border-slate-100 p-12 text-center shadow-sm">
          <div className="w-16 h-16 rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center mb-4">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">You have not placed any orders yet</h3>
          <p className="text-sm text-slate-500 mt-1.5 max-w-sm">
            Save products to your cart and place your first order today!
          </p>
          <Link
            to="/products"
            className="mt-6 px-6 py-3 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-all shadow-md inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Start Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* 4. Orders List */}
      {!loading && !error && orders.length > 0 && (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Order Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Order ID
                  </span>
                  <span className="text-sm font-mono font-bold text-slate-900">#{order._id}</span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Date
                    </span>
                    <span className="text-xs font-semibold text-slate-700">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  {getStatusBadge(order.status)}
                </div>
              </div>

              {/* Items Preview */}
              <div className="py-4 space-y-3 border-b border-slate-100">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-100">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 truncate">{item.name}</p>
                        <p className="text-[11px] text-slate-500">
                          {formatINR(item.price)} × {item.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-slate-900 flex-shrink-0">
                      {formatINR(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Order Card Footer */}
              <div className="pt-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Total Amount
                  </span>
                  <span className="text-xl font-extrabold text-indigo-600">{formatINR(order.totalAmount)}</span>
                </div>

                <Link
                  to={`/orders/${order._id}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
