import { useState, useEffect, useMemo, useContext } from "react";
import { SearchContext } from "../App";
import { Link, useSearchParams } from "react-router-dom";
import { RiArrowUpDownLine, RiFilter3Line, RiCloseLine } from "react-icons/ri";
import useDocumentMeta from "../hooks/useDocumentMeta";
import { CATEGORIES, truncate } from "../config/seo";

const formatPrice = (p) => `\u20B9${Number(p || 0).toLocaleString('en-IN')}`;

export const Products = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  const { searchTerm } = useContext(SearchContext);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (debouncedSearch) {
      params.set("search", debouncedSearch);
    } else {
      params.delete("search");
    }
    setSearchParams(params);
  }, [debouncedSearch]);

  const selectedCat = searchParams.get("category") || "All";
  const selectedBrand = searchParams.get("brand") || "All";
  const sortOrder = searchParams.get("sort") || "default";
  const searchQuery = searchParams.get("search") || "";

  useDocumentMeta({
    title:
      selectedCat !== "All"
        ? `${selectedCat} — Curated & Tested`
        : "Shop All Tech — Laptops, Phones & Audio",
    description:
      selectedCat !== "All"
        ? truncate(
            `Shop Ezbuy's curated ${selectedCat.toLowerCase()} — hand-picked gear with honest pricing, free express shipping, 30-day returns and a 2-year warranty.`
          )
        : truncate(
            "Browse curated laptops, smartphones, headphones, tablets, wearables and accessories. Free express shipping, 30-day returns and a 2-year warranty on everything."
          ),
    // A category is a distinct landing page that the sitemap lists, so it is
    // self-canonical. Brand, sort and search are filter views over the same
    // inventory, so they deliberately canonicalise back to the category.
    path:
      selectedCat !== "All"
        ? `/products?category=${encodeURIComponent(selectedCat)}`
        : "/products",
  });

  const categories = ["All", ...CATEGORIES];
  const brands = ["All", "Apple", "Samsung", "Sony", "Razer", "Logitech", "Dell"];

  const updateFilters = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value === "All" || value === "default") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    setSearchParams(params);
  };

  const clearFilters = () => setSearchParams({});

  const hasActiveFilter =
    selectedCat !== "All" ||
    selectedBrand !== "All" ||
    sortOrder !== "default" ||
    searchQuery;

  // Fetch the full collection once — filters run below
  useEffect(() => {
    fetch("https://backend-sk0h.onrender.com/products")
      .then((res) => res.json())
      .then((data) => {
        const productData = data.data || data;
        setAllProducts(Array.isArray(productData) ? productData : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setAllProducts([]);
        setLoading(false);
      });
  }, []);

  // Client-side filter + sort
  const products = useMemo(() => {
    let list = [...allProducts];

    if (selectedCat !== "All") list = list.filter((p) => p.category === selectedCat);
    if (selectedBrand !== "All") list = list.filter((p) => p.brand === selectedBrand);

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter((p) =>
        `${p.name || ""} ${p.brand || ""} ${p.category || ""} ${p.tag || ""}`.toLowerCase().includes(q)
      );
    }

    if (sortOrder === "priceLowHigh") list.sort((a, b) => a.price - b.price);
    if (sortOrder === "priceHighLow") list.sort((a, b) => b.price - a.price);

    return list;
  }, [allProducts, selectedCat, selectedBrand, sortOrder, searchQuery]);

  if (loading)
    return (
      <div className="bg-surface min-h-screen flex items-center justify-center">
        <span className="text-gold font-bold animate-pulse text-sm uppercase tracking-[0.3em]">
          Loading collection...
        </span>
      </div>
    );

  return (
    <div className="bg-surface text-warm-100 min-h-screen px-4 lg:px-10 py-8 lg:py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <p className="text-gold text-xs font-semibold uppercase tracking-[0.22em] mb-2">
              Collection
            </p>
            <h1 className="text-3xl lg:text-4xl font-black tracking-tight">
              Browse products
            </h1>
          </div>
          <p className="text-warm-500 text-xs font-bold uppercase tracking-widest">
            {products.length} {products.length === 1 ? "item" : "items"} found
          </p>
        </div>

        {/* Filters */}
        <div className="mb-10 space-y-4">
          {/* Category chips */}
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => updateFilters("category", cat)}
                className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                  selectedCat === cat
                    ? "bg-gold text-surface"
                    : "border border-surface-border bg-surface-raised text-warm-500 hover:text-warm-100 hover:border-gold/40"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Brand + sort + clear */}
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={selectedBrand}
              onChange={(e) => updateFilters("brand", e.target.value)}
              className="bg-surface-raised border border-surface-border rounded-full px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-warm-300 outline-none cursor-pointer hover:border-gold/40 transition-colors [color-scheme:dark]"
            >
              {brands.map((brand) => (
                <option
                  key={brand}
                  value={brand}
                  className="bg-elevated text-warm-300"
                >
                  {brand === "All" ? "All brands" : brand}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-2 bg-surface-raised border border-surface-border rounded-full px-4 py-2.5">
              <RiArrowUpDownLine className="text-gold text-sm" />
              <select
                value={sortOrder}
                onChange={(e) => updateFilters("sort", e.target.value)}
                className="bg-transparent text-xs font-bold uppercase tracking-wider outline-none cursor-pointer text-warm-300 [color-scheme:dark]"
              >
                <option value="default" className="bg-elevated text-warm-300">Sort by</option>
                <option value="priceLowHigh" className="bg-elevated text-warm-300">Price: Low to High</option>
                <option value="priceHighLow" className="bg-elevated text-warm-300">Price: High to Low</option>
              </select>
            </div>

            {hasActiveFilter && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-warm-500 hover:text-gold transition-colors"
              >
                <RiCloseLine className="text-base" />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Empty state */}
        {products.length === 0 && (
          <div className="text-center py-24">
            <h2 className="text-2xl font-bold text-warm-300">
              Nothing matches those filters
            </h2>
            <p className="text-warm-500 text-sm mt-2">
              Try removing a filter or browsing the rest of the collection.
            </p>
            <button
              onClick={clearFilters}
              className="mt-6 inline-flex items-center gap-2 bg-gold text-surface font-bold px-6 py-3 rounded-full hover:bg-gold-light transition-colors text-sm"
            >
              <RiFilter3Line className="text-lg" />
              Show everything
            </button>
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-5">
          {products.map((item) => (
            <Link
              key={item._id || item.id}
              to={`/products/${item._id}`}
              className="group flex flex-col h-full rounded-xl lg:rounded-2xl border border-surface-border bg-surface-raised p-3 lg:p-4 hover:border-gold/40 transition-all"
            >
              <div className="relative aspect-square bg-elevated rounded-lg overflow-hidden flex items-center justify-center mb-3 p-4">
                {item.stock === 0 ? (
                  <span className="absolute top-2.5 left-2.5 bg-red-500/90 text-white text-[9px] lg:text-[11px] font-bold px-2.5 py-1 rounded-md z-10">
                    Out of stock
                  </span>
                ) : (
                  item.tag && (
                    <span className="absolute top-2.5 left-2.5 bg-gold text-surface text-[9px] lg:text-[11px] font-bold px-2.5 py-1 rounded-md z-10">
                      {item.tag}
                    </span>
                  )
                )}
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-lg"
                />
              </div>

              <div className="flex-grow">
                <p className="text-[10px] lg:text-xs text-gold font-bold uppercase tracking-[0.18em] mb-1">
                  {item.brand}
                </p>
                <h3 className="text-sm lg:text-base font-bold text-warm-100 leading-tight group-hover:text-gold line-clamp-1">
                  {item.name}
                </h3>
              </div>

              <div className="mt-3 pt-3 border-t border-surface-border flex items-center justify-between">
                <span className="text-gold font-black text-base lg:text-lg">
                  {formatPrice(item.price)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};