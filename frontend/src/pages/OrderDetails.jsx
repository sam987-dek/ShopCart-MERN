import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  CheckCircle2,
  Clock,
  Truck,
  Package,
  MapPin,
  CreditCard,
  ArrowLeft,
  Loader2,
  AlertCircle,
  ShoppingBag,
  ShieldCheck,
  Check,
} from "lucide-react";
import { getOrderById, updateOrderStatus } from "../services/api";
import { formatINR } from "../utils/formatCurrency";

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusUpdating, setStatusUpdating] = useState(false);

  const fetchOrder = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getOrderById(id);
      setOrder(res.data.order);
    } catch (err) {
      console.error("Fetch order error:", err);
      setError(err.response?.data?.message || "Order not found or access denied.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.body.style.overflow = "unset";
    document.documentElement.style.overflow = "unset";
    if (id) {
      fetchOrder();
    }
  }, [id]);

  const handleStatusUpdate = async (newStatus) => {
    setStatusUpdating(true);
    try {
      const res = await updateOrderStatus(id, newStatus);
      setOrder(res.data.order);
    } catch (err) {
      console.error("Status update error:", err);
      alert("Failed to update status");
    } finally {
      setStatusUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="w-14 h-14 rounded-3xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Order Not Found</h2>
        <p className="text-sm text-slate-500 mt-2 mb-6">{error || "The order you requested does not exist."}</p>
        <Link
          to="/orders"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-2xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to My Orders
        </Link>
      </div>
    );
  }

  const { shippingAddress, items, totalAmount, paymentStatus, status, razorpayPaymentId, createdAt } = order;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Confirmation Hero Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-emerald-900/10 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">Payment Verified</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Order Placed Successfully!</h1>
          </div>
        </div>
        <p className="text-xs text-emerald-100 max-w-lg leading-relaxed">
          Your payment has been verified via Razorpay and your cart has been cleared. Below is your permanent purchase receipt snapshot.
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            to="/orders"
            className="px-4 py-2 bg-white text-emerald-800 text-xs font-bold rounded-xl shadow-sm hover:bg-emerald-50 transition-colors"
          >
            View All My Orders
          </Link>
          <Link
            to="/products"
            className="px-4 py-2 bg-emerald-700/60 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors border border-white/20"
          >
            Continue Shopping
          </Link>
        </div>
      </div>

      {/* Order Meta & Status Progression */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Order Reference</span>
            <span className="text-base font-mono font-bold text-slate-900">#{order._id}</span>
            <span className="text-xs text-slate-400 block mt-0.5">
              Placed on {new Date(createdAt).toLocaleString("en-IN")}
            </span>
          </div>

          <div className="flex flex-col items-start sm:items-end gap-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Status:</span>
              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase tracking-wider">
                {status}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>Payment:</span>
              <span className="font-extrabold text-emerald-600 uppercase">{paymentStatus}</span>
            </div>
          </div>
        </div>

        {/* Bonus Challenge: Status Progression Controller */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            ⭐ Bonus Status Progression Controller
          </span>
          <div className="flex flex-wrap gap-2">
            {["PLACED", "CONFIRMED", "SHIPPED", "DELIVERED"].map((st) => (
              <button
                key={st}
                onClick={() => handleStatusUpdate(st)}
                disabled={statusUpdating || status === st}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  status === st
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-white text-slate-700 border border-slate-200 hover:bg-indigo-50 hover:text-indigo-600"
                } disabled:opacity-50`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Items Purchased Snapshot */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
            Purchased Items ({items.length})
          </h3>
          <div className="space-y-4">
            {items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100/80">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-white border border-slate-200 flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 truncate">{item.name}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Price at purchase: <span className="font-semibold text-slate-800">{formatINR(item.price)}</span> × {item.quantity}
                    </p>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <span className="text-xs text-slate-400 block font-semibold uppercase">Item Total</span>
                  <span className="text-base font-extrabold text-slate-900">{formatINR(item.price * item.quantity)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Two Column Section: Address & Payment Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
          {/* Shipping Address */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <div className="flex items-center gap-2 text-indigo-600 mb-2">
              <MapPin className="w-4 h-4" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Shipping Address</h4>
            </div>
            <p className="text-sm font-bold text-slate-900">{shippingAddress.fullName}</p>
            <p className="text-xs text-slate-600">{shippingAddress.addressLine1}</p>
            <p className="text-xs text-slate-600">
              {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.pincode}
            </p>
            <p className="text-xs text-slate-600 font-semibold pt-1">Phone: {shippingAddress.phone}</p>
          </div>

          {/* Payment Info & Total */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
            <div className="flex items-center gap-2 text-indigo-600 mb-2">
              <CreditCard className="w-4 h-4" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Payment Breakdown</h4>
            </div>

            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Payment ID:</span>
                <span className="font-mono font-bold text-slate-900">{razorpayPaymentId || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Mode:</span>
                <span className="font-bold text-slate-900">Razorpay Test Checkout</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200">
                <span className="text-sm font-bold text-slate-900">Total Paid</span>
                <span className="text-xl font-extrabold text-indigo-600">{formatINR(totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
