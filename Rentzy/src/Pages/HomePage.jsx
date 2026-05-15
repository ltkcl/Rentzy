import { useState } from "react";
import { Link } from "react-router-dom";
//  import { products } from "../data/products";
import { useLoaderData } from "react-router-dom";
import { UserButton } from "@clerk/react";
import ProductImage from "./ProductImage";
export default function HomePage() {
  // Category list used by the Explore Categories section.
  const categories = [
    { id: "textbooks", name: "Textbooks", icon: "📘" },
    { id: "furniture", name: "Furniture", icon: "🛋️" },
    { id: "electronics", name: "Electronics", icon: "💻" },
    { id: "clothing", name: "Clothing", icon: "👕" },
    { id: "sports", name: "Sports", icon: "🏋️" },
    { id: "kitchen", name: "Kitchen", icon: "🍴" },
  ];
  const { products, category } = useLoaderData();
  const [showAllItems, setShowAllItems] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Build the live search dropdown from products whose titles match the typed prefix.
  const searchResults =
    searchQuery.trim().length === 0
      ? []
      : products.data
        .filter((item) =>
          item.title
            .toLowerCase()
            .startsWith(searchQuery.trim().toLowerCase()),
        )
        .slice(0, 8);

  const DEFAULT_TRENDING_COUNT = 4;
  const EXPANDED_TRENDING_COUNT = 6;

  // Deduplicate products before showing them in the trending section.
  const uniqueTrendingItems = Array.from(
    new Map(products.data.map((item) => [item.id, item])).values(),
  );

  const trendingItems = showAllItems
    ? uniqueTrendingItems.slice(0, EXPANDED_TRENDING_COUNT)
    : uniqueTrendingItems.slice(0, DEFAULT_TRENDING_COUNT);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2b7cf6] to-white bg-fixed">
      <div className="bg-transparent relative top-3 right-50 left-5"><UserButton appearance={{
        elements: {
          userButtonAvatarBox: {
            width: '30px',
            height: '30px'
          }
        }
      }}></UserButton></div>
      <div className="min-h-screen bg-transparent">
        {/* Start Hero Section */}
        <header className="relative  px-6 py-12 md:py-16 flex flex-col items-center text-center overflow-visible">

          {/* Start Brand Block */}
          <div className="relative z-10 flex flex-col items-center gap-2 mb-8">
            <div
              className="px-6 py-2 rounded-2xl shadow-xl border-b-4 border-yellow-600 transform -rotate-2 hover:rotate-0 transition-transform duration-300 ease-out"
              style={{ backgroundColor: "#ffe51f" }}
            >
              <h1 className="text-4xl md:text-5xl italic font-extrabold text-gray-900">
                RENTILY
              </h1>
            </div>

            <p className="text-blue-50 font-medium text-lg">
              Why buy when you{" "}
              <span className="text-yellow-300 underline">can rent?</span>
            </p>
          </div>
          {/* End Brand Block */}

          {/* Start Search Bar Block */}
          <div className="relative z-20 w-full max-w-2xl">
            <div className="relative flex items-center w-full h-14 rounded-xl border-2 border-blue-400 bg-white shadow-lg overflow-hidden">
              {/* Search Icon */}
              <div className="grid place-items-center h-full w-14 text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {" "}
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />{" "}
                </svg>
              </div>

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for books, electronics, furniture..."
                className="h-full w-full outline-none text-gray-700 bg-transparent text-sm md:text-base"
              />
            </div>

            {/* Start Search Results Dropdown */}
            {searchResults.length > 0 && (
              <div className="absolute left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
                <ul className="max-h-72 overflow-y-auto">
                  {searchResults.map((item) => (
                    <li key={item.id}>
                      {/* Search Result Item */}
                      <Link
                        to={`/product/${item.prodId}`}
                        onClick={() => setSearchQuery("")}
                        className="block px-4 py-3 hover:bg-blue-50 transition"
                      >
                        <p className="text-sm font-semibold text-gray-900">
                          {item.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          in {item.category}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {/* End Search Results Dropdown */}
          </div>
          {/* End Search Bar Block */}
        </header>
        {/* End Hero Section */}

        {/* Start Quick Actions Section */}
        <div className="max-w-5xl mx-auto grid grid-cols-2 gap-3 md:gap-6 mt-4 px-4 md:px-6">
          {/* Start Buy/Rent Card */}
          <div
            className="group relative p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden flex items-center justify-between border border-transparent hover:border-teal-200"
            style={{ backgroundColor: "#D7F2E9" }}
          >
            <div className="absolute -right-4 -top-4 sm:-right-8 sm:-top-8 w-20 h-20 sm:w-32 sm:h-32 bg-white opacity-40 rounded-full group-hover:scale-110 transition-transform duration-500 pointer-events-none"></div>

            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-5 w-full">
              <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-white shadow-sm flex items-center justify-center text-teal-600 group-hover:-translate-y-1 transition-transform duration-300 shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 sm:h-7 sm:w-7"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
              <div className="text-left mt-1 sm:mt-0">
                <h3 className="font-bold text-[15px] sm:text-xl md:text-2xl text-teal-950 tracking-tight mb-0.5 sm:mb-1 leading-tight">
                  Buy / Rent
                </h3>
                <p className="text-teal-800/80 font-medium text-[11px] sm:text-sm md:text-base leading-tight">
                  From Students
                </p>
              </div>
            </div>

            <div className="hidden sm:block relative z-10 text-teal-600 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </div>
          </div>
          {/* End Buy/Rent Card */}

          {/* Start Sell/Rent Card */}
          <div
            className="group relative p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden flex items-center justify-between border border-transparent hover:border-teal-200"
            style={{ backgroundColor: "#D7F2E9" }}
          >
            <div className="absolute -right-4 -top-4 sm:-right-8 sm:-top-8 w-20 h-20 sm:w-32 sm:h-32 bg-white opacity-40 rounded-full group-hover:scale-110 transition-transform duration-500 pointer-events-none"></div>

            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-5 w-full">
              <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-white shadow-sm flex items-center justify-center text-teal-600 group-hover:-translate-y-1 transition-transform duration-300 shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 sm:h-7 sm:w-7"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
              </div>
              <div className="text-left mt-1 sm:mt-0">
                <h3 className="font-bold text-[15px] sm:text-xl md:text-2xl text-teal-950 tracking-tight mb-0.5 sm:mb-1 leading-tight">
                  Sell / Rent
                </h3>
                <p className="text-teal-800/80 font-medium text-[11px] sm:text-sm md:text-base leading-tight">
                  Your Items
                </p>
              </div>
            </div>

            <div className="hidden sm:block relative z-10 text-teal-600 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </div>
          </div>
        </div>
        {/* End Quick Actions Section */}

        {/* Start Categories Section */}
        <section className="max-w-6xl mx-auto mt-10 px-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-semibold text-slate-800 tracking-tight">
              Explore Categories
            </h2>

            <div className="hidden sm:flex gap-2 text-2xl text-slate-300">
              &larr; &rarr;
            </div>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-6 gap-5">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/category/${cat.id.toLowerCase()}`}
                className="block"
              >
                {/* Start Category Card */}
                <div className="group bg-white/40 border-2 border-blue-500/40 relative flex flex-col items-center p-6 rounded-3xl backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(40,116,240,0.12)] hover:-translate-y-2 transition-all duration-300 cursor-pointer overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(#f1f5f9_1.5px,transparent_1.5px)] [background-size:20px_20px] opacity-70 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

                  <div className="relative z-10 w-16 h-16 mb-4 rounded-full bg-gradient-to-br from-blue-50 to-slate-50 border border-blue-100 flex items-center justify-center text-3xl group-hover:scale-110 group-hover:from-blue-500 group-hover:to-blue-600 group-hover:text-white group-hover:border-blue-500 transition-all duration-300 shadow-sm">
                    {cat.icon}
                  </div>

                  <p className="relative z-10 font-bold text-slate-700 group-hover:text-blue-700 transition-colors text-sm text-center tracking-wide">
                    {cat.name}
                  </p>
                </div>
                {/* End Category Card */}
              </Link>
            ))}
          </div>
        </section>
        {/* End Categories Section */}

        {/* Start Trending Section */}
        <section className="max-w-6xl mx-auto mt-16 mb-20 px-6">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold text-slate-800 tracking-tight">
                Trending Now
              </h2>
              <p className="text-slate-500 font-medium mt-1">
                Top picks requested by students like you
              </p>
            </div>

            <button
              onClick={() => setShowAllItems(!showAllItems)}
              className="text-blue-600 font-bold hover:text-blue-800 hover:underline underline-offset-4 transition-all flex items-center gap-1"
            >
              {showAllItems ? "View Less" : "View All"}
              <span
                className={`text-xl leading-none transition-transform duration-300 ${showAllItems ? "rotate-180" : ""}`}
              >
                &rarr;
              </span>
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {trendingItems.map((item) => {
              const CardWrapper = item.isAvailable ? Link : "div";

              return (
                <CardWrapper
                  key={item.prodId}
                  {...(item.isAvailable && { to: `/product/${item.prodId}` })}
                  className="block h-full"
                >
                  {/* Start Trending Item Card */}
                  <div
                    className={`group bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]
            border border-slate-100 overflow-hidden flex flex-col h-full transition-all duration-300 /* FIX: Added h-full */
            ${item.isAvailable
                        ? "cursor-pointer hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
                        : "opacity-60 cursor-not-allowed"
                      }`}
                  >
                    <div className="relative aspect-square bg-slate-100 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent z-10"></div>

                      <ProductImage item={item} ></ProductImage>
                      {/* Condition Badge */}
                      <div className="absolute top-4 left-4 z-20">
                        <span className="bg-white/95 backdrop-blur-sm text-slate-800 text-xs font-black px-3 py-1.5 rounded-full shadow-sm">
                          {(item.condition) ? "Excellent" : "Excellent"}
                        </span>
                      </div>
                      {!item.isAvailable && (
                        <>
                          {/* Unavailable Badge */}
                          <span className="absolute top-4 right-4 z-20 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                            Unavailable
                          </span>
                        </>
                      )}
                    </div>

                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="font-bold text-lg text-slate-800 leading-snug mb-4 line-clamp-2">
                        {item.prodName}
                      </h3>

                      <div className="mt-auto">
                        {item.isAvailable && item.rentPrice ? (
                          <>
                            {/* Rent Pricing Block */}
                            <div className="bg-blue-50/60 rounded-2xl p-3 border border-blue-100 mb-3">
                              <p className="text-[10px] text-blue-600 uppercase tracking-widest font-black mb-1">
                                Rent for
                              </p>
                              <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-extrabold text-blue-700">
                                  ₹{item.rentPrice}
                                </span>
                                <span className="text-sm font-semibold text-blue-600/60">
                                  /mo
                                </span>
                              </div>
                            </div>

                            {/* Buy Alternative Block */}
                            <div className="flex items-center justify-between px-2">
                              <p className="text-xs text-slate-500 font-semibold">
                                Or buy it for
                              </p>
                              <p className="text-sm font-bold text-slate-800">
                                ₹{item.purchasePrice}
                              </p>
                            </div>
                          </>
                        ) : (
                          <>
                            {/* Buy Only Block */}
                            <div className="bg-slate-50/60 rounded-2xl p-3 border border-slate-200 mt-auto">
                              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black mb-1">
                                Buy for
                              </p>
                              <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-extrabold text-slate-800">
                                  ₹{item.purchasePrice}
                                </span>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* End Trending Item Card */}
                </CardWrapper>
              );
            })}
          </div>
        </section>
        {/* End Trending Section */}

        {/* Start How It Works Section */}
        <section className="max-w-5xl mx-auto mt-16 px-6 relative">
          <div
            className="relative backdrop-blur-2xl rounded-3xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden p-6 md:p-10"
            style={{ backgroundColor: "#D7F2E9" }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(#f1f5f9_1.5px,transparent_1.5px)] [background-size:20px_20px] opacity-40 pointer-events-none"></div>

            <div className="relative z-10 text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">
                How{" "}
                <span>
                  <div
                    className="inline-block px-4 py-1.5 rounded-xl shadow-md mb-6 transform -rotate-3 hover:rotate-0 transition-transform duration-300 ease-out"
                    style={{ backgroundColor: "#ffe51f" }}
                  >
                    <h2 className="text-2xl italic font-black text-black tracking-wide">
                      RENTILY
                    </h2>
                  </div>
                </span>{" "}
                Works
              </h2>
              <p className="text-slate-500 text-sm mt-2 max-w-lg mx-auto">
                Your campus marketplace made simple. Get what you need in three
                easy steps.
              </p>
            </div>

            <div className="relative z-10 grid grid-cols-3 md:grid-cols-3 gap-4 md:gap-8">
              {/* Connector Line */}
              <div className=" md:block absolute top-12 left-[18%] right-[18%] h-[2px] bg-gradient-to-r from-blue-200 via-indigo-300 to-purple-200 z-0 opacity-60"></div>

              {/* Start Step 1 Card */}
              <div className="group relative z-10 flex flex-col items-center text-center p-4 rounded-2xl hover:bg-white/50 transition-colors duration-500">
                <div className="w-16 h-16 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center mb-4 relative group-hover:-translate-y-1 transition-transform duration-300">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md shadow-indigo-500/20 text-white flex items-center justify-center text-lg font-black group-hover:scale-110 transition-transform duration-300">
                    1
                  </div>
                </div>
                <h4 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">
                  Browse & Choose
                </h4>
                <p className="text-slate-500 leading-snug text-xs md:text-sm max-w-[220px]">
                  Find items from verified students. Compare prices and conditions
                  easily.
                </p>
              </div>
              {/* End Step 1 Card */}

              {/* Start Step 2 Card */}
              <div className="group relative z-10 flex flex-col items-center text-center p-4 rounded-2xl hover:bg-white/50 transition-colors duration-500">
                <div className="w-16 h-16 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center mb-4 relative group-hover:-translate-y-1 transition-transform duration-300">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 shadow-md shadow-purple-500/20 text-white flex items-center justify-center text-lg font-black group-hover:scale-110 transition-transform duration-300">
                    2
                  </div>
                </div>
                <h4 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-purple-600 transition-colors">
                  Rent or Buy
                </h4>
                <p className="text-slate-500 leading-snug text-xs md:text-sm max-w-[220px]">
                  Need it for a semester? Rent it. Want to keep it forever? Buy
                  it.
                </p>
              </div>
              {/* End Step 2 Card */}

              {/* Start Step 3 Card */}
              <div className="group relative z-10 flex flex-col items-center text-center p-4 rounded-2xl hover:bg-white/50 transition-colors duration-500">
                <div className="w-16 h-16 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center mb-4 relative group-hover:-translate-y-1 transition-transform duration-300">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-fuchsia-500 shadow-md shadow-fuchsia-500/20 text-white flex items-center justify-center text-lg font-black group-hover:scale-110 transition-transform duration-300">
                    3
                  </div>
                </div>
                <h4 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-fuchsia-600 transition-colors">
                  We Handle It All
                </h4>
                <p className="text-slate-500 leading-snug text-xs md:text-sm max-w-[220px]">
                  Sit back and relax. We coordinate the pickup, delivery, and
                  returns.
                </p>
              </div>
              {/* End Step 3 Card */}
            </div>
          </div>
        </section>
        {/* End How It Works Section */}

        {/* Start Footer */}
        <footer className="mt-24 bg-slate-950 text-slate-400 py-12 px-6 border-t border-slate-800 rounded-t-[3rem]">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between gap-12 mb-12">
            {/* Start Brand Summary Block */}
            <div className="max-w-sm">
              <div
                className="inline-block px-4 py-1.5 rounded-xl shadow-md mb-6 transform -rotate-3 hover:rotate-0 transition-transform duration-300 ease-out "
                style={{ backgroundColor: "#ffe51f" }}
              >
                <h2 className="text-2xl italic font-black text-black tracking-wide">
                  RENTILY
                </h2>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                The smartest way for students to share, rent, and buy essentials.
                Why buy when you can rent? Save money and reduce waste on campus
                today.
              </p>
            </div>
            {/* End Brand Summary Block */}

            {/* Start Support Links Block */}
            <div>
              <h3 className="text-slate-50 font-bold mb-6 tracking-wide">
                Support
              </h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="#" className="hover:text-blue-400 transition-colors">
                    Help Center
                  </a>
                </li>
              </ul>
            </div>
            {/* End Support Links Block */}
          </div>

          {/* Footer Bottom Bar */}
          <div className="max-w-5xl mx-auto pt-8 border-t border-slate-800/50 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
            <p>© 2026 RENTILY. All rights reserved.</p>
          </div>
        </footer>
        {/* End Footer */}
      </div>
    </div>
  );
}
