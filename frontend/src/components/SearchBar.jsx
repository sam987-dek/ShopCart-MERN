import React from "react";
import {
  Search,
  X,
  SlidersHorizontal,
  Sparkles,
  Laptop,
  Shirt,
  Footprints,
  Watch,
  Heart,
  Home,
  ShoppingBag,
  Layers,
  ArrowUpDown,
  CheckCircle2,
} from "lucide-react";

const categoryIcons = {
  All: Layers,
  Electronics: Laptop,
  Fashion: Shirt,
  Footwear: Footprints,
  Accessories: Watch,
  "Beauty & Personal Care": Heart,
  "Home & Living": Home,
  Groceries: ShoppingBag,
};

const priceRanges = [
  { label: "All Prices", min: null, max: null },
  { label: "Under ₹1,000", min: 0, max: 1000 },
  { label: "₹1,000 – ₹5,000", min: 1000, max: 5000 },
  { label: "₹5,000 – ₹20,000", min: 5000, max: 20000 },
  { label: "₹20,000+", min: 20000, max: null },
];

const SearchBar = ({
  search,
  setSearch,
  category,
  setCategory,
  categories,
  sort,
  setSort,
  selectedPriceRange,
  setSelectedPriceRange,
  inStockOnly,
  setInStockOnly,
  totalProductsCount,
}) => {
  return (
    <div className="space-y-6">
      {/* Top Hero Search Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-950/20 text-white border border-slate-800">
        {/* Ambient Gradient Glows */}
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-violet-500/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-6">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 text-xs font-bold tracking-wide uppercase mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>ShopKart Live Catalog</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Discover Premium Products
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Explore handpicked electronics, fashion, lifestyle items & more with instant search
              </p>
            </div>

            {totalProductsCount !== undefined && (
              <div className="self-start sm:self-center bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 text-xs font-bold text-slate-300">
                <span className="text-indigo-400 font-extrabold">{totalProductsCount}</span> Items Available
              </div>
            )}
          </div>

          {/* Search Inputs Row */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
            {/* Search Input */}
            <div className="relative md:col-span-7">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-300/80" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title, brand, or description..."
                className="w-full pl-11 pr-11 py-3.5 bg-white/10 backdrop-blur-md border border-white/15 hover:border-indigo-400/50 rounded-2xl text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/40 focus:border-indigo-400 transition-all shadow-inner"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
                  title="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="relative md:col-span-3">
              <div className="relative">
                <ArrowUpDown className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-300/80 pointer-events-none" />
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="w-full pl-11 pr-8 py-3.5 bg-white/10 backdrop-blur-md border border-white/15 hover:border-indigo-400/50 rounded-2xl text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-indigo-400/40 focus:border-indigo-400 transition-all cursor-pointer [&>option]:bg-slate-900 [&>option]:text-white"
                >
                  <option value="">Sort: Featured</option>
                  <option value="price_asc">Price: Low to High (₹)</option>
                  <option value="price_desc">Price: High to Low (₹)</option>
                </select>
              </div>
            </div>

            {/* In-Stock Only Toggle Button */}
            <div className="md:col-span-2">
              <button
                type="button"
                onClick={() => setInStockOnly(!inStockOnly)}
                className={`w-full py-3.5 px-4 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer border ${
                  inStockOnly
                    ? "bg-emerald-500/20 border-emerald-400/60 text-emerald-300 shadow-sm shadow-emerald-500/20"
                    : "bg-white/10 border-white/15 text-slate-300 hover:bg-white/15 hover:text-white"
                }`}
              >
                <CheckCircle2 className={`w-4 h-4 ${inStockOnly ? "text-emerald-400" : "text-slate-400"}`} />
                <span>In Stock</span>
              </button>
            </div>
          </div>

          {/* Quick Price Range Filters */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/10 text-xs">
            <span className="text-slate-400 font-semibold flex items-center gap-1.5 mr-1">
              <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" />
              <span>Price Filter:</span>
            </span>
            {priceRanges.map((range, index) => {
              const isSelected =
                selectedPriceRange?.min === range.min && selectedPriceRange?.max === range.max;
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSelectedPriceRange(isSelected ? null : range)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer text-xs ${
                    isSelected
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 scale-105"
                      : "bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white border border-white/10"
                  }`}
                >
                  {range.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Interactive Category Pills Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-2.5 shadow-xs overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-2 min-w-max">
          {/* All Categories Button */}
          <button
            type="button"
            onClick={() => setCategory("")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              !category
                ? "bg-slate-900 text-white shadow-md shadow-slate-900/20"
                : "bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900"
            }`}
          >
            <Layers className="w-4 h-4 text-indigo-400" />
            <span>All Products</span>
          </button>

          {/* Individual Category Pills */}
          {categories.map((cat) => {
            const Icon = categoryIcons[cat] || Layers;
            const isSelected = category.toLowerCase() === cat.toLowerCase();

            return (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(isSelected ? "" : cat)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25 scale-[1.02]"
                    : "bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900"
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? "text-white" : "text-indigo-600"}`} />
                <span>{cat}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
