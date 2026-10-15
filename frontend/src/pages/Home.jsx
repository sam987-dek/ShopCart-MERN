import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Phone, Calendar, ShieldCheck, ShoppingBag, ArrowRight, Sparkles } from "lucide-react";
import { getMyProfile } from "../services/api";

const Home = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(user);
  const [loading, setLoading] = useState(!user);
  const [error, setError] = useState("");

  useEffect(() => {
    // Task 3: Protected Route - Verify user via GET /customers/me
    const verifyAuth = async () => {
      try {
        setLoading(true);
        const res = await getMyProfile();
        setProfile(res.data);
        setUser(res.data);
      } catch (err) {
        console.error("Protected Route Error: Not authenticated", err);
        setError("You must be logged in to view your dashboard.");
        // Redirect to /login automatically if not logged in
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, [navigate, setUser]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-sm font-medium text-gray-500">Verifying customer session...</p>
      </div>
    );
  }

  if (error || !profile) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-800 rounded-3xl p-8 sm:p-10 text-white shadow-xl shadow-indigo-200/50 mb-10">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold uppercase tracking-wider text-indigo-100 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            ShopKart Customer Dashboard
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Welcome back, {profile.fullName}!
          </h1>
          <p className="mt-3 text-indigo-100 text-sm sm:text-base leading-relaxed">
            Your account is verified and ready. Explore the newest products in our catalog or manage your personal shopping preferences below.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-indigo-700 font-bold text-sm shadow-md hover:bg-indigo-50 transition-all active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              Browse Catalog
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Decorative background circle */}
        <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
      </div>

      {/* Customer Info Card & Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="md:col-span-2 bg-white rounded-3xl p-7 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Customer Profile</h2>
              <p className="text-xs text-gray-500">Live data fetched securely via /customers/me</p>
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
              <ShieldCheck className="w-3.5 h-3.5" />
              Session Active
            </span>
          </div>

          <div className="space-y-4">
            <div className="flex items-center p-4 rounded-2xl bg-gray-50/80 border border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mr-4">
                <User className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">Full Name</p>
                <p className="text-base font-bold text-gray-900">{profile.fullName}</p>
              </div>
            </div>

            <div className="flex items-center p-4 rounded-2xl bg-gray-50/80 border border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center mr-4">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">Email Address</p>
                <p className="text-base font-bold text-gray-900">{profile.email}</p>
              </div>
            </div>

            <div className="flex items-center p-4 rounded-2xl bg-gray-50/80 border border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mr-4">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">Phone Number</p>
                <p className="text-base font-bold text-gray-900">{profile.phone}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions / Status Card */}
        <div className="bg-white rounded-3xl p-7 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">Account Security</h2>
            <p className="text-xs text-gray-500 mb-6">
              Your authentication session is protected using an <strong>HttpOnly, SameSite cookie</strong>.
            </p>

            <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100/60 mb-4">
              <p className="text-xs font-semibold text-indigo-900 mb-1">JWT Cookie Protection</p>
              <p className="text-xs text-indigo-700/80 leading-relaxed">
                Tokens are not stored in <code className="bg-white px-1 py-0.5 rounded text-[11px]">localStorage</code>, protecting you from XSS attacks.
              </p>
            </div>
          </div>

          <Link
            to="/products"
            className="w-full py-3 px-4 bg-gray-900 hover:bg-black text-white text-center rounded-xl font-semibold text-sm transition-all shadow-sm"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
