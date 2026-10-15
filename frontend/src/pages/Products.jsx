import React, { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import SearchBar from "../components/SearchBar";
import { fetchProducts, getWishlist } from "../services/api";
import { PackageOpen, AlertCircle, Loader2, Sparkles } from "lucide-react";

const Products = ({ user, onWishlistChange }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [wishlistedIds, setWishlistedIds] = useState([]);

  // Filter and search states
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");

  // Categories list
  const categories = [
    "Electronics",
    "Wearables",
    "Footwear",
    "Fashion",
    "Home & Kitchen",
    "Audio",
  ];

  const fetchWishlistData = async () => {
    if (user) {
      try {
        const res = await getWishlist();
        const items = res.data.wishlist || (Array.isArray(res.data) ? res.data : []);
        // extract IDs
        const ids = items.map(item => typeof item === 'object' ? item._id : item);
        setWishlistedIds(ids);
      } catch (err) {
        console.error("Failed to fetch wishlist IDs", err);
      }
    } else {
      setWishlistedIds([]);
    }
  };

  useEffect(() => {
    fetchWishlistData();
  }, [user]);

  const handleWishlistChange = () => {
    fetchWishlistData();
    if (onWishlistChange) {
      onWishlistChange();
    }
  };

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 350);

    return () => clearTimeout(timer);
  }, [search]);

  // Fetch products from backend dynamically
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError("");

      try {
        const params = {};
        if (debouncedSearch.trim()) params.search = debouncedSearch.trim();
        if (category) params.category = category;
        if (sort) params.sort = sort;

        const res = await fetchProducts(params);
        setProducts(res.data.products || []);
      } catch (err) {
        console.error("fetchProducts error:", err);
        setError("Something went wrong while loading products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [debouncedSearch, category, sort]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Search & Hero Filter Bar */}
      <div className="mb-10">
        <SearchBar
          search={search}
          setSearch={setSearch}
          category={category}
          setCategory={setCategory}
          categories={categories}
          sort={sort}
          setSort={setSort}
        />
      </div>

      {/* Subheader / Quick stats */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200/60">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            {category ? `${category} Collection` : "All Handpicked Products"}
          </h2>
        </div>
        <div className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
          {products.length} {products.length === 1 ? "Product Found" : "Products Found"}
        </div>
      </div>

      {/* 1. Loading State */}
      {loading && (
        <div className="min-h-[380px] flex flex-col items-center justify-center bg-white rounded-3xl border border-slate-100 p-12 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center mb-4">
            <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
          </div>
          <p className="text-base font-bold text-slate-800">Loading products catalog...</p>
          <p className="text-xs text-slate-400 mt-1">Fetching live inventory in INR</p>
        </div>
      )}

      {/* 2. Error State */}
      {!loading && error && (
        <div className="min-h-[320px] flex flex-col items-center justify-center bg-rose-50/50 rounded-3xl border border-rose-100 p-8 text-center">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Unable to Fetch Products</h3>
          <p className="text-sm text-rose-600 mt-1 max-w-md">{error}</p>
          <button
            onClick={() => {
              setLoading(true);
              fetchProducts().then((res) => {
                setProducts(res.data.products || []);
                setError("");
                setLoading(false);
              }).catch(() => {
                setError("Something went wrong while loading products.");
                setLoading(false);
              });
            }}
            className="mt-5 px-5 py-2.5 bg-indigo-600 text-white text-xs font-bold rounded-xl shadow-md hover:bg-indigo-700 transition-colors cursor-pointer"
          >
            Retry Fetching
          </button>
        </div>
      )}

      {/* 3. Empty State */}
      {!loading && !error && products.length === 0 && (
        <div className="min-h-[380px] flex flex-col items-center justify-center bg-white rounded-3xl border border-slate-100 p-12 text-center shadow-sm">
          <div className="w-16 h-16 rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center mb-4">
            <PackageOpen className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No products found</h3>
          <p className="text-sm text-slate-500 mt-1.5 max-w-sm">
            We couldn't find any products matching "{search}". Try searching for another item or clearing your category filters.
          </p>
          {(search || category || sort) && (
            <button
              onClick={() => {
                setSearch("");
                setCategory("");
                setSort("");
              }}
              className="mt-6 px-5 py-2.5 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer"
            >
              Reset All Filters
            </button>
          )}
        </div>
      )}

      {/* Product Grid */}
      {!loading && !error && products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-7">
          {products.map((product) => (
            <ProductCard 
              key={product._id} 
              product={product} 
              user={user}
              wishlistedIds={wishlistedIds}
              onWishlistChange={handleWishlistChange}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
