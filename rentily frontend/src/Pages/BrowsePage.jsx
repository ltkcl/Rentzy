import { useState, useMemo } from "react";
import { useLoaderData } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import CategoryFilter from "../components/CategoryFilter";
import ProductCard from "../components/ProductCard";
import Navbar from "../components/Navbar";

const TYPE_OPTIONS = [
  { value: "all",  label: "All" },
  { value: "rent", label: "🔑 Rent" },
  { value: "sell", label: "🛒 Buy" },
  { value: "both", label: "✨ Both" },
];

const SORT_OPTIONS = [
  { value: "default",    label: "Recommended" },
  { value: "price_asc",  label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating",     label: "Top Rated" },
];

const BrowsePage = () => {
  const { products } = useLoaderData();
  const [search,     setSearch]     = useState("");
  const [category,   setCategory]   = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy,     setSortBy]     = useState("default");
  const loading = false;

  // Derive the listing type from whichever fields a product has (supports both API and dummy data)
  const productType = (p) =>
    p.type || (p.rentable && p.forSale ? "both" : p.rentable ? "rent" : "sell");

  const filtered = useMemo(() => {
    let results = [...products];

    if (search.trim()) {
      const q = search.toLowerCase();
      results = results.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          (p.description || "").toLowerCase().includes(q) ||
          (p.location || "").toLowerCase().includes(q)
      );
    }

    if (category !== "all") {
      results = results.filter((p) => p.category === category);
    }

    if (typeFilter !== "all") {
      results = results.filter((p) => {
        const t = productType(p);
        return t === typeFilter || t === "both";
      });
    }

    if (sortBy === "price_asc")
      results.sort((a, b) => (a.buyPrice || a.rentPrice || 0) - (b.buyPrice || b.rentPrice || 0));
    else if (sortBy === "price_desc")
      results.sort((a, b) => (b.buyPrice || b.rentPrice || 0) - (a.buyPrice || a.rentPrice || 0));
    else if (sortBy === "rating")
      results.sort((a, b) => (b.rating || 0) - (a.rating || 0));

    return results;
  }, [products, search, category, typeFilter, sortBy]);

  return (
    <div className="page-wrapper">
      <Navbar />

      {/* Hero Section */}
      <div className="browse-hero">
        <div className="browse-hero-inner">
          <span className="browse-hero-badge">✨ 500+ campus listings</span>
          <h1 className="page-title browse-hero-title">
            Find What You <span>Need</span>
          </h1>
          <p className="page-subtitle browse-hero-sub">
            Browse products from students near you — rent for a semester or buy outright.
          </p>
          <div className="browse-search-wrap">
            <SearchBar onSearch={setSearch} />
          </div>
          <div className="browse-hero-pills">
            <span>📚 Textbooks</span>
            <span>💻 Electronics</span>
            <span>🛋️ Furniture</span>
            <span>👕 Clothing</span>
            <span>🎮 Gaming</span>
          </div>
        </div>
        <div className="hero-blob hero-blob-1" />
        <div className="hero-blob hero-blob-2" />
        <div className="hero-float f1">📚</div>
        <div className="hero-float f2">💻</div>
        <div className="hero-float f3">🛋️</div>
        <div className="hero-float f4">🎮</div>
      </div>

      {/* Filters Bar */}
      <div className="container">
        <CategoryFilter selected={category} onSelect={setCategory} />

        <div className="browse-toolbar">
          <div className="type-filters">
            {TYPE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                className={`type-chip ${typeFilter === opt.value ? "active" : ""}`}
                onClick={() => setTypeFilter(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="sort-wrap">
            <label className="sort-label">Sort:</label>
            <select
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="results-header">
          <p className="results-count">
            {loading ? (
              "Loading listings..."
            ) : (
              <>
                <span>{filtered.length}</span> listings found
                {category !== "all" && ` in ${category}`}
                {search && ` for "${search}"`}
              </>
            )}
          </p>
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="product-grid">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="product-card" style={{ opacity: 0.4, minHeight: 280 }} />
            ))}
          </div>
        )}

        {/* Product Grid */}
        {!loading && filtered.length > 0 && (
          <div className="product-grid">
            {filtered.map((product, i) => (
              <div
                key={product.id}
                style={{
                  animationDelay: `${i * 0.07}s`,
                  opacity: 0,
                  animation: `fadeInUp 0.4s ease ${i * 0.07}s forwards`,
                }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <h3>No listings found</h3>
            <p>Try adjusting your search or filters</p>
            <button
              className="btn-primary"
              onClick={() => { setSearch(""); setCategory("all"); setTypeFilter("all"); }}
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowsePage;
