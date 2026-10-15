import React from "react";
import { Search, X, SlidersHorizontal, Sparkles } from "lucide-react";

const SearchBar = ({ search, setSearch, category, setCategory, categories, sort, setSort }) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-indigo-950/20 text-white border border-indigo-900/40">
      {/* Decorative ambient background glows */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-violet-500/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 gap-2">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-200">
              Instant Catalog Search
            </span>
          </div>
          <span className="text-xs text-slate-400">
            Search by brand, model, specs, or keyword
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
          {/* Search text input */}
          <div className="relative md:col-span-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-300/70" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search 'iPhone 15', 'Watch', 'Sneakers'..."
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

          {/* Category filter */}
          <div className="relative md:col-span-3">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3.5 bg-white/10 backdrop-blur-md border border-white/15 hover:border-indigo-400/50 rounded-2xl text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-indigo-400/40 focus:border-indigo-400 transition-all cursor-pointer [&>option]:bg-slate-900 [&>option]:text-white"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Sorting Dropdown */}
          <div className="relative md:col-span-3">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full px-4 py-3.5 bg-white/10 backdrop-blur-md border border-white/15 hover:border-indigo-400/50 rounded-2xl text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-indigo-400/40 focus:border-indigo-400 transition-all cursor-pointer [&>option]:bg-slate-900 [&>option]:text-white"
            >
              <option value="">Sort: Featured</option>
              <option value="price_asc">Price: Low to High (₹)</option>
              <option value="price_desc">Price: High to Low (₹)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
