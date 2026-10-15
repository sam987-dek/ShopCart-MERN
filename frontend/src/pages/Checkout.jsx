import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Loader2,
  AlertCircle,
  MapPin,
  User,
  Phone,
  Building,
  ArrowLeft,
  Package,
  Sparkles,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { createPaymentOrder, verifyPayment } from "../services/api";
import { formatINR } from "../utils/formatCurrency";

// Helper to load Razorpay checkout.js script dynamically
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, subtotal, totalCount, loading: cartLoading, fetchCart } = useCart();

  // Shipping form state
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    city: "",
    state: "",
    pincode: "",
  });

  // UI states
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [testModalData, setTestModalData] = useState(null); // Dev test modal state

  // Control body overflow and ensure cleanup on unmount
  useEffect(() => {
    if (testModalData) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      document.documentElement.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      document.documentElement.style.overflow = "unset";
    };
  }, [testModalData]);

  // Redirect to /cart if cart is empty (e.g. user navigates directly to /checkout)
  useEffect(() => {
    if (!cartLoading && cartItems.length === 0) {
      navigate("/cart", { replace: true });
    }
  }, [cartItems, cartLoading, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field as user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Client-side form validation before hitting the backend
  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";

    const cleanPhone = formData.phone.trim().replace(/\D/g, "");
    if (!cleanPhone) newErrors.phone = "Phone number is required";
    else if (cleanPhone.length < 10) newErrors.phone = "Phone number must contain at least 10 digits";

    if (!formData.addressLine1.trim()) newErrors.addressLine1 = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State is required";

    const cleanPincode = formData.pincode.trim().replace(/\D/g, "");
    if (!cleanPincode) newErrors.pincode = "Pincode is required";
    else if (cleanPincode.length !== 6) newErrors.pincode = "Pincode must contain exactly 6 digits";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Called after Razorpay returns payment details — sends to backend for HMAC verification
  const handlePaymentSuccess = async (paymentResponse) => {
    try {
      setIsProcessing(true);
      setSubmitError("");
      const res = await verifyPayment(paymentResponse);

      if (res.data.success) {
        // Clear global cart state in context (Navbar badge → 0)
        await fetchCart();
        // Navigate to order confirmation page
        navigate(`/orders/${res.data.order._id}`, { replace: true });
      } else {
        setSubmitError("Payment verification failed. Please contact support.");
        setIsProcessing(false);
      }
    } catch (err) {
      console.error("Payment verification error:", err);
      setSubmitError(
        err.response?.data?.message || "Failed to verify payment. Please contact support."
      );
      setIsProcessing(false);
    } finally {
      setTestModalData(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    // Step 1: Client-side validation
    if (!validateForm()) return;

    setIsProcessing(true);

    try {
      // Step 2: Backend creates ShopKart Order + Razorpay Order
      const res = await createPaymentOrder({
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
        addressLine1: formData.addressLine1.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        pincode: formData.pincode.trim(),
      });

      const data = res.data;

      // If backend detected placeholder/dummy keys, launch Dev Test Harness Modal
      if (data.isSimulated || data.key === "rzp_test_shopkart123" || data.key?.includes("shopkart")) {
        setTestModalData(data);
        setIsProcessing(false);
        return;
      }

      // Step 3: Load official Razorpay script for real test credentials
      const isScriptLoaded = await loadRazorpayScript();

      if (!isScriptLoaded || !window.Razorpay) {
        // Fallback to Dev Test Harness Modal if script fails to load
        setTestModalData(data);
        setIsProcessing(false);
        return;
      }

      // Step 4: Open Razorpay Checkout popup
      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: "ShopKart",
        description: "ShopKart Order Payment",
        order_id: data.razorpayOrderId,
        handler: async function (response) {
          await handlePaymentSuccess({
            shopKartOrderId: data.shopKartOrderId,
            razorpay_order_id: response.razorpay_order_id || data.razorpayOrderId,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });
        },
        prefill: {
          name: formData.fullName || data.customer?.name || "",
          email: data.customer?.email || "",
          contact: formData.phone || data.customer?.phone || "",
        },
        theme: {
          color: "#4F46E5",
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
            setSubmitError("Payment was cancelled. Your cart remains unchanged.");
          },
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", function (response) {
        console.warn("Razorpay payment failed:", response.error);
        setIsProcessing(false);
        setSubmitError(
          `Payment failed: ${response.error?.description || response.error?.reason || "Transaction was declined by bank/gateway"}`
        );
      });

      rzp.open();
    } catch (err) {
      console.error("Create payment order error:", err);
      setSubmitError(
        err.response?.data?.message || "Failed to initiate payment. Please check your cart and try again."
      );
      setIsProcessing(false);
    }
  };

  if (cartLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/cart"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Shopping Cart</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Checkout</h1>
        <p className="text-xs text-slate-500 mt-1">Provide shipping details and complete your order</p>
      </div>

      {/* Global error banner */}
      {submitError && (
        <div className="mb-8 p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl flex items-start gap-3 text-sm animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
          <span>{submitError}</span>
        </div>
      )}

      {/* Main Grid */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Shipping Address Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <MapPin className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900">Shipping Information</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Aarav Sharma"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm font-medium focus:outline-none transition-all ${
                    errors.fullName
                      ? "border-rose-300 focus:ring-2 focus:ring-rose-200 bg-rose-50/20"
                      : "border-slate-200 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600"
                  }`}
                />
              </div>
              {errors.fullName && <p className="text-xs text-rose-500 font-semibold mt-1">{errors.fullName}</p>}
            </div>

            {/* Phone */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Phone Number *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm font-medium focus:outline-none transition-all ${
                    errors.phone
                      ? "border-rose-300 focus:ring-2 focus:ring-rose-200 bg-rose-50/20"
                      : "border-slate-200 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600"
                  }`}
                />
              </div>
              {errors.phone && <p className="text-xs text-rose-500 font-semibold mt-1">{errors.phone}</p>}
            </div>

            {/* Address Line 1 */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Address Line 1 *
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="addressLine1"
                  value={formData.addressLine1}
                  onChange={handleChange}
                  placeholder="Flat / House No. / Street / Area"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm font-medium focus:outline-none transition-all ${
                    errors.addressLine1
                      ? "border-rose-300 focus:ring-2 focus:ring-rose-200 bg-rose-50/20"
                      : "border-slate-200 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600"
                  }`}
                />
              </div>
              {errors.addressLine1 && <p className="text-xs text-rose-500 font-semibold mt-1">{errors.addressLine1}</p>}
            </div>

            {/* City */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">City *</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="e.g. Bengaluru"
                className={`w-full px-4 py-3 rounded-xl border text-sm font-medium focus:outline-none transition-all ${
                  errors.city
                    ? "border-rose-300 focus:ring-2 focus:ring-rose-200 bg-rose-50/20"
                    : "border-slate-200 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600"
                }`}
              />
              {errors.city && <p className="text-xs text-rose-500 font-semibold mt-1">{errors.city}</p>}
            </div>

            {/* State */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">State *</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="e.g. Karnataka"
                className={`w-full px-4 py-3 rounded-xl border text-sm font-medium focus:outline-none transition-all ${
                  errors.state
                    ? "border-rose-300 focus:ring-2 focus:ring-rose-200 bg-rose-50/20"
                    : "border-slate-200 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600"
                }`}
              />
              {errors.state && <p className="text-xs text-rose-500 font-semibold mt-1">{errors.state}</p>}
            </div>

            {/* Pincode */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Pincode *</label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                placeholder="6-digit pincode"
                maxLength={6}
                className={`w-full px-4 py-3 rounded-xl border text-sm font-medium focus:outline-none transition-all ${
                  errors.pincode
                    ? "border-rose-300 focus:ring-2 focus:ring-rose-200 bg-rose-50/20"
                    : "border-slate-200 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600"
                }`}
              />
              {errors.pincode && <p className="text-xs text-rose-500 font-semibold mt-1">{errors.pincode}</p>}
            </div>
          </div>
        </div>

        {/* Right Column: Order Review & Place Order */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm space-y-6 sticky top-24">
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Order Summary</h2>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
              {totalCount} Units
            </span>
          </div>

          {/* Cart Items Snapshot */}
          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {cartItems.map((item) => (
              <div key={item.product?._id} className="flex items-center justify-between gap-3 text-xs py-1.5 border-b border-slate-50">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-100">
                    <img src={item.product?.imageUrl} alt={item.product?.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 truncate">{item.product?.name}</p>
                    <p className="text-[11px] text-slate-400">Qty: {item.quantity}</p>
                  </div>
                </div>
                <span className="font-extrabold text-slate-900 flex-shrink-0">
                  {formatINR((item.product?.price || 0) * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Price Breakdown */}
          <div className="space-y-2 pt-2 text-xs border-t border-slate-100">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-900">{formatINR(subtotal)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Shipping</span>
              <span className="font-bold text-emerald-600 uppercase">FREE Express</span>
            </div>
            <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
              <span className="text-sm font-bold text-slate-900">Total Payable</span>
              <span className="text-2xl font-extrabold text-indigo-600">{formatINR(subtotal)}</span>
            </div>
          </div>

          {/* Pay Button */}
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 active:scale-[0.99] text-white font-bold text-base shadow-xl shadow-indigo-200/80 flex items-center justify-center gap-2.5 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Processing Order...</span>
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5" />
                <span>Pay & Place Order</span>
              </>
            )}
          </button>

          {/* Trust indicators */}
          <div className="pt-2 space-y-2 text-[11px] text-slate-400 border-t border-slate-100">
            <p className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
              <span>Razorpay Test Mode — Secure Payment Gateway</span>
            </p>
            <p className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-indigo-600" />
              <span>Cart cleared only after verified payment</span>
            </p>
            <p className="flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5 text-indigo-600" />
              <span>HMAC SHA256 signature verified server-side</span>
            </p>
          </div>
        </div>
      </form>

      {/* Dev Test Modal Fallback for Sandbox / Test Credentials */}
      {testModalData && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 border border-slate-100">
            <div className="flex items-center gap-3.5 text-indigo-600">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">Razorpay Test Gateway</h3>
                <p className="text-xs text-slate-500 font-medium">Dev Test Mode Harness</p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl text-xs space-y-2.5 border border-slate-100 font-medium">
              <div className="flex justify-between">
                <span className="text-slate-500">ShopKart Order ID:</span>
                <span className="font-mono font-bold text-slate-900">#{testModalData.shopKartOrderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Razorpay Order ID:</span>
                <span className="font-mono font-bold text-slate-900">{testModalData.razorpayOrderId}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200/60">
                <span className="text-slate-500">Amount Payable:</span>
                <span className="font-extrabold text-base text-indigo-600">{formatINR(testModalData.amount / 100)}</span>
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Click below to simulate a successful Razorpay Test Mode payment. The server will perform cryptographic HMAC SHA256 signature verification, deduct stock, and clear your cart.
            </p>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setTestModalData(null)}
                className="flex-1 py-3 px-4 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isProcessing}
                onClick={() =>
                  handlePaymentSuccess(
                    testModalData.simulatedPayload || {
                      shopKartOrderId: testModalData.shopKartOrderId,
                      razorpay_order_id: testModalData.razorpayOrderId,
                      razorpay_payment_id: "pay_test_" + Date.now(),
                      razorpay_signature: "test_verified_signature",
                    }
                  )
                }
                className="flex-1 py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    <span>Simulate Payment</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
