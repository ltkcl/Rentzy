import { useParams } from "react-router-dom";
// import { products } from "../data/products";
import {useLoaderData} from "react-router-dom"; 
// ProductDetails renders the full details view for a single selected product.
export default function ProductDetails() {
  // Read the product id from the route and find the matching product record.
  // const { productId } = useParams();
  const {products} = useLoaderData();
  // const product = products.data.find((p) => p.id === Number(productId));
  const product = products.data;

  // Fallback UI for invalid or missing product ids.
  if (!product)
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <p className="text-xl font-semibold text-gray-500">Product not found</p>
      </div>
    );

  const isRentAvailable =
    product.isAvailable &&
    product.rentPrice !== null &&
    product.rentPrice !== undefined;

  // Buying is allowed whenever the item is still available.
  const isBuyAvailable = product.isAvailable;

  return (
    <div className="min-h-screen bg-[#82bdfa] md:bg-gradient-to-b md:from-blue-400 md:to-blue-100 p-4 py-8 md:p-12 flex items-center justify-center font-sans">
      {/* Start Product Details Layout */}
      {/* Two-column layout component: image on the left, details on the right */}
      <div className="max-w-5xl w-full mx-auto rounded-[2.5rem] md:p-8 flex flex-col md:grid md:grid-cols-2 gap-3 md:gap-8">
        {/* Start Product Image Panel */}
        <div className="relative w-full h-72 md:h-full md:min-h-[30rem] rounded-[2rem] overflow-hidden shadow-sm border border-gray-200/50 bg-white flex items-center justify-center">
          {/* Main product image element */}
          <img
            src={product.image}
            alt={product.prodName}
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          />

          {/* Availability badge shown only when the item cannot be purchased or rented */}
          {!product.isAvailable && (
            <div className="absolute top-5 left-5 bg-red-500/95 backdrop-blur-sm text-white text-xs font-black tracking-widest uppercase px-4 py-1.5 rounded-full shadow-lg border border-red-400">
              Unavailable
            </div>
          )}
        </div>
        {/* End Product Image Panel */}

        {/* Start Product Info Stack */}
        <div className="flex flex-col gap-4 md:gap-5">
          {/* Start Overview Card */}
          <div className="bg-white border border-gray-100 rounded-[2rem] p-6 md:p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)]">
            <h2 className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
              Product Overview
            </h2>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-5 leading-tight">
              {product.prodName}
            </h1>
            {/* Metadata badges component */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="bg-white border border-gray-200 text-gray-700 text-sm font-semibold px-4 py-2 rounded-xl shadow-sm">
                Condition:{" "}
                <span className="text-blue-600">{product.condition}</span>
              </span>
              {product.isAvailable && (
                <span className="bg-green-50/80 border border-green-200 text-green-700 text-sm font-semibold px-4 py-2 rounded-xl shadow-sm">
                  In Stock
                </span>
              )}
            </div>
          </div>
          {/* End Overview Card */}

          {/* Start Pricing Card */}
          <div className="bg-white border border-gray-100 rounded-[2rem] p-6 md:p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] flex-1 flex flex-col justify-center">
            <h2 className="text-[10px] md:text-xs font-bold text-blue-500 uppercase tracking-widest mb-4">
              Pricing Options
            </h2>

            {/* Pricing grid component */}
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              {/* Rental pricing card */}
              <div
                className={`p-4 md:p-5 rounded-2xl border ${isRentAvailable ? "border-blue-100 bg-blue-50/40" : "border-gray-100 bg-gray-50 opacity-60"}`}
              >
                <p className="text-gray-500 font-medium text-[10px] md:text-xs mb-1">
                  Rental Price
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl md:text-2xl font-black text-blue-600">
                    ₹{product.rentPrice || "--"}
                  </span>
                  <span className="text-xs font-semibold text-gray-400">
                    /mo
                  </span>
                </div>
              </div>

              {/* Purchase pricing card */}
              <div className="p-4 md:p-5 rounded-2xl border border-gray-100 bg-white">
                <p className="text-gray-500 font-medium text-[10px] md:text-xs mb-1">
                  Purchase Price
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl md:text-2xl font-black text-gray-900">
                    ₹{product.purchasePrice}
                  </span>
                </div>
              </div>
            </div>
          </div>
          {/* End Pricing Card */}

          {/* Start Action Buttons Card */}
          <div className="bg-white border border-gray-100 rounded-[2rem] p-5 md:p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)]">
            {/* Primary action button group */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Rent action button */}
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

              {/* Buy action button */}
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
          {/* End Action Buttons Card */}
        </div>
        {/* End Product Info Stack */}
      </div>
      {/* End Product Details Layout */}
    </div>
  );
}
