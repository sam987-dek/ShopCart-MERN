import React, { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import SearchBar from "../components/SearchBar";
import { fetchProducts, getWishlist } from "../services/api";
import {
  PackageOpen,
  AlertCircle,
  Loader2,
  SlidersHorizontal,
  X,
  LayoutGrid,
  List,
} from "lucide-react";

const availableCategories = [
  "Electronics",
  "Fashion",
  "Footwear",
  "Accessories",
  "Beauty & Personal Care",
  "Home & Living",
  "Groceries",
];

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
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'compact'

  const fetchWishlistData = async () => {
    if (user) {
      try {
        const res = await getWishlist();
        const items = res.data.wishlist || (Array.isArray(res.data) ? res.data : []);
        const ids = items.map((item) => (typeof item === "object" ? item._id : item));
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
    }, 300);

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
        if (selectedPriceRange?.min !== null && selectedPriceRange?.min !== undefined) {
          params.minPrice = selectedPriceRange.min;
        }
        if (selectedPriceRange?.max !== null && selectedPriceRange?.max !== undefined) {
          params.maxPrice = selectedPriceRange.max;
        }
        if (inStockOnly) {
          params.inStock = true;
        }

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
  }, [debouncedSearch, category, sort, selectedPriceRange, inStockOnly]);

  const hasActiveFilters = Boolean(
    search || category || sort || selectedPriceRange || inStockOnly
  );

  const resetAllFilters = () => {
    setSearch("");
    setCategory("");
    setSort("");
    setSelectedPriceRange(null);
    setInStockOnly(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* Search & Hero Filter Bar */}
      <div className="mb-8">
        <SearchBar
          search={search}
          setSearch={setSearch}
          category={category}
          setCategory={setCategory}
          categories={availableCategories}
          sort={sort}
          setSort={setSort}
          selectedPriceRange={selectedPriceRange}
          setSelectedPriceRange={setSelectedPriceRange}
          inStockOnly={inStockOnly}
          setInStockOnly={setInStockOnly}
          totalProductsCount={products.length}
        />
      </div>

      {/* Active Filter Tags & Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-200">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 mr-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
              {category ? `${category}` : "All Products"}
            </h2>
          </div>

          {/* Active Filter Badges */}
          {category && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-xs font-bold text-indigo-700">
              Category: {category}
              <button
                type="button"
                onClick={() => setCategory("")}
                className="hover:text-indigo-900 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedPriceRange && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-xs font-bold text-indigo-700">
              {selectedPriceRange.label}
              <button
                type="button"
                onClick={() => setSelectedPriceRange(null)}
                className="hover:text-indigo-900 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {inStockOnly && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-700">
              In Stock Only
              <button
                type="button"
                onClick={() => setInStockOnly(false)}
                className="hover:text-emerald-900 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {search && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700">
              "{search}"
              <button
                type="button"
                onClick={() => setSearch("")}
                className="hover:text-slate-900 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetAllFilters}
              className="text-xs font-bold text-rose-600 hover:text-rose-700 underline cursor-pointer ml-1"
            >
              Clear all
            </button>
          )}
        </div>

        {/* View Mode & Count */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
            {products.length} {products.length === 1 ? "Product" : "Products"}
          </span>

          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === "grid"
                  ? "bg-white text-indigo-600 shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("compact")}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === "compact"
                  ? "bg-white text-indigo-600 shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
              title="Compact View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 1. Loading State */}
      {loading && (
        <div className="min-h-[380px] flex flex-col items-center justify-center bg-white rounded-3xl border border-slate-200 p-12 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mb-4 shadow-inner">
            <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
          </div>
          <p className="text-base font-bold text-slate-800">Loading products catalog...</p>
          <p className="text-xs text-slate-400 mt-1">Fetching live inventory in INR</p>
        </div>
      )}

      {/* 2. Error State */}
      {!loading && error && (
        <div className="min-h-[320px] flex flex-col items-center justify-center bg-rose-50/50 rounded-3xl border border-rose-200 p-8 text-center">
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
        <div className="min-h-[380px] flex flex-col items-center justify-center bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm">
          <div className="w-16 h-16 rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center mb-4">
            <PackageOpen className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No products match your criteria</h3>
          <p className="text-sm text-slate-500 mt-1.5 max-w-sm">
            Try adjusting your search terms, removing price filters, or clearing the active category.
          </p>
          {hasActiveFilters && (
            <button
              onClick={resetAllFilters}
              className="mt-6 px-5 py-2.5 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer"
            >
              Reset All Filters
            </button>
          )}
        </div>
      )}

      {/* Product Grid / Compact View */}
      {!loading && !error && products.length > 0 && (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-7"
              : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          }
        >
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
