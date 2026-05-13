import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { api, mapProduct } from "../services/api";
import { products as localProducts } from "../data/products";

export default function ProductDetails() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error,   setError]     = useState(null);

  useEffect(() => {
    // Try fetching from the backend first
    api
      .getProduct(productId)
      .then((res) => {
        setProduct(mapProduct(res.data));
        setError(null);
      })
      .catch(() => {
        // Fall back to local dummy data (IDs are numbers as strings in URLs)
        const local = localProducts.find(
          (p) => String(p.id) === String(productId)
        );
        if (local) {
          setProduct(local);
        } else {
          setError("Product not found");
        }
      })
      .finally(() => setLoading(false));
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <p className="text-xl font-semibold text-gray-500">Loading product…</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50 gap-4">
        <p className="text-xl font-semibold text-gray-500">Product not found</p>
        <button
          className="px-6 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700"
          onClick={() => navigate("/browse")}
        >
          Back to Browse
        </button>
      </div>
    );
  }

  const isRentAvailable =
    product.available &&
    product.rentPrice !== null &&
    product.rentPrice !== undefined &&
    product.rentPrice > 0;

  const isBuyAvailable = product.available && product.buyPrice > 0;

  return (
    <div className="min-h-screen bg-[#82bdfa] md:bg-gradient-to-b md:from-blue-400 md:to-blue-100 p-4 py-8 md:p-12 flex items-center justify-center font-sans">
      <div className="max-w-5xl w-full mx-auto rounded-[2.5rem] md:p-8 flex flex-col md:grid md:grid-cols-2 gap-3 md:gap-8">

        {/* Image */}
        <div className="relative w-full h-72 md:h-full md:min-h-[30rem] rounded-[2rem] overflow-hidden shadow-sm border border-gray-200/50 bg-white flex items-center justify-center">
          {product.image ? (
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              onError={(e) => { e.target.style.display = "none"; }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 gap-2">
              <span className="text-6xl">📦</span>
              <span className="text-gray-500 font-medium text-sm">No image available</span>
            </div>
          )}

          {!product.available && (
            <div className="absolute top-5 left-5 bg-red-500/95 backdrop-blur-sm text-white text-xs font-black tracking-widest uppercase px-4 py-1.5 rounded-full shadow-lg border border-red-400">
              Unavailable
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col gap-4 md:gap-5">
          <div className="bg-white border border-gray-100 rounded-[2rem] p-6 md:p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)]">
            <h2 className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
              Product Overview
            </h2>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-5 leading-tight">
              {product.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3">
              <span className="bg-white border border-gray-200 text-gray-700 text-sm font-semibold px-4 py-2 rounded-xl shadow-sm">
                Condition: <span className="text-blue-600">{product.condition}</span>
              </span>
              {product.available && (
                <span className="bg-green-50/80 border border-green-200 text-green-700 text-sm font-semibold px-4 py-2 rounded-xl shadow-sm">
                  In Stock
                </span>
              )}
              {product.location && (
                <span className="bg-gray-50 border border-gray-200 text-gray-600 text-sm font-semibold px-4 py-2 rounded-xl shadow-sm">
                  📍 {product.location}
                </span>
              )}
            </div>
            {product.description && (
              <p className="mt-4 text-gray-600 text-sm leading-relaxed">
                {product.description}
              </p>
            )}
          </div>

          <div className="bg-white border border-gray-100 rounded-[2rem] p-6 md:p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] flex-1 flex flex-col justify-center">
            <h2 className="text-[10px] md:text-xs font-bold text-blue-500 uppercase tracking-widest mb-4">
              Pricing Options
            </h2>

            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <div
                className={`p-4 md:p-5 rounded-2xl border ${
                  isRentAvailable
                    ? "border-blue-100 bg-blue-50/40"
                    : "border-gray-100 bg-gray-50 opacity-60"
                }`}
              >
                <p className="text-gray-500 font-medium text-[10px] md:text-xs mb-1">
                  Rental Price
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl md:text-2xl font-black text-blue-600">
                    ₹{product.rentPrice || "--"}
                  </span>
                  <span className="text-xs font-semibold text-gray-400">/mo</span>
                </div>
              </div>

              <div className="p-4 md:p-5 rounded-2xl border border-gray-100 bg-white">
                <p className="text-gray-500 font-medium text-[10px] md:text-xs mb-1">
                  Purchase Price
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl md:text-2xl font-black text-gray-900">
                    ₹{product.buyPrice || "--"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-[2rem] p-5 md:p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)]">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                disabled={!isRentAvailable}
                className={`flex-1 py-4 px-4 rounded-[1.25rem] font-bold text-base md:text-lg transition-all duration-200 flex items-center justify-center gap-2
                  ${
                    isRentAvailable
                      ? "bg-[#1D4ED8] text-white shadow-lg shadow-blue-500/25 hover:bg-blue-800 hover:-translate-y-0.5 active:translate-y-0"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
              >
                {isRentAvailable ? "Rent Item" : "Cannot Rent"}
              </button>

              <button
                disabled={!isBuyAvailable}
                className={`flex-1 py-4 px-4 rounded-[1.25rem] font-bold text-base md:text-lg transition-all duration-200 flex items-center justify-center gap-2
                  ${
                    isBuyAvailable
                      ? "bg-[#FDE047] text-gray-900 shadow-lg shadow-yellow-400/20 hover:bg-[#FACC15] hover:-translate-y-0.5 active:translate-y-0"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
              >
                {isBuyAvailable ? "Buy Item" : "Unavailable"}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
