import { useParams, Link } from "react-router-dom";
import { products } from "../data/products";

export default function CategoryPage() {
  const { categoryId } = useParams();

  const filteredItems = products.filter(
    (item) => item.category?.toLowerCase() === categoryId?.toLowerCase(),
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to-blue-100 px-6 py-10 md:px-12 md:py-16 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center border border-white">
                <div className="w-4 h-4 bg-black rounded-full animate-pulse"></div>
              </div>
              <p className="text-black font-semibold tracking-widest uppercase text-sm">
                Category
              </p>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 capitalize tracking-tighter">
              {categoryId} 
            </h1>
          </div>

          {filteredItems.length > 0 && (
            <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-md px-5 py-3 rounded-2xl shadow-sm border border-white">
              <span className="text-sm font-semibold text-gray-700">
                {filteredItems.length} Items Available
              </span>
            </div>
          )}
        </div>

        {filteredItems.length === 0 ? (
          <div className="bg-white/50 backdrop-blur-lg rounded-[2.5rem] p-16 text-center shadow-sm border border-white">
            <div className="w-20 h-20 mx-auto bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
              <span className="text-3xl">📭</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Nothing here yet
            </h3>
            <p className="text-gray-500 font-medium max-w-sm mx-auto">
              We couldn't find any items in this category. Check back later for
              new arrivals.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {filteredItems.map((item) => {
              const CardWrapper = item.available ? Link : "div";

              return (
                <CardWrapper
                  key={item.id}
                  {...(item.available && {
                    to: `/product/${item.id}`,
                  })}
                  className="block group outline-none h-full"
                >
                  <div
                    className={`bg-white rounded-[2rem] p-3 h-full flex flex-col border border-white transition-all duration-500
                    ${
                      item.available
                        ? "shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.12)] hover:-translate-y-2 cursor-pointer"
                        : "opacity-80 cursor-not-allowed shadow-sm"
                    }`}
                  >
                    <div className="relative rounded-[1.5rem] overflow-hidden bg-[#F4F7FB] mb-5 aspect-[4/3]">
                      <img
                        src={item.image}
                        className={`w-full h-full object-cover transition-transform duration-700 
                          ${item.available ? "group-hover:scale-110" : "grayscale"}`}
                        alt={item.title}
                      />
                      {item.available && (
                        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      )}
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-sm border border-white/50">
                        <p className="text-[10px] tracking-widest text-blue-600 uppercase">
                          {item.condition}
                        </p>
                      </div>
                      {!item.available && (
                        <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] flex items-center justify-center">
                          <span className="bg-red-500 text-white text-sm px-4 py-2 rounded-full shadow-lg">
                            Unavailable
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col flex-grow px-2 pb-2">
                      <h3 className="font-semibold text-lg text-gray-900 leading-snug mb-5 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                        {item.title}
                      </h3>

                      <div className="mt-auto grid grid-cols-2 gap-3">
                        <div className="bg-blue-50/50 rounded-2xl p-3 border border-blue-100/50 flex flex-col justify-center transition-colors group-hover:bg-blue-50">
                          <span className="text-[9px] text-blue-400 font-bold uppercase tracking-widest mb-0.5">
                            Rent
                          </span>
                          {item.rentPrice && item.available ? (
                            <p className="text-blue-600 font-black text-sm md:text-base">
                              ₹{item.rentPrice}
                              <span className="text-[10px] font-semibold text-blue-400">
                                /mo
                              </span>
                            </p>
                          ) : (
                            <p className="text-blue-300 text-xs font-bold">
                              N/A
                            </p>
                          )}
                        </div>

                        <div className="bg-gray-50 rounded-2xl p-3 border border-gray-100 flex flex-col justify-center transition-colors group-hover:bg-gray-100">
                          <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">
                            Buy
                          </span>
                          <p className="text-gray-800 font-black text-sm md:text-base">
                            ₹{item.buyPrice}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardWrapper>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
