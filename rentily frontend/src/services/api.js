const API_BASE = "/api/v1";

// Low-level fetch wrapper — throws on non-2xx
async function request(endpoint, options = {}) {
  const config = {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  };

  const res = await fetch(`${API_BASE}${endpoint}`, config);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || `Request failed with status ${res.status}`);
  }

  return data; // { success, statusCode, data, message }
}

/**
 * Maps a backend Products record to the shape the frontend components expect.
 * Backend fields → Frontend fields:
 *   prodId        → id
 *   prodName      → title
 *   prodType      → category
 *   isAvailable   → available
 *   purchasePrice → buyPrice
 *   imageUrl      → image
 */
export function mapProduct(p) {
  const rentable = p.rentPrice > 0;
  const forSale = p.purchasePrice > 0;
  const type = rentable && forSale ? "both" : rentable ? "rent" : "sell";

  return {
    id: p.prodId,
    title: p.prodName,
    category: p.prodType,
    available: p.isAvailable,
    condition: p.condition,
    rentPrice: p.rentPrice > 0 ? p.rentPrice : null,
    buyPrice: p.purchasePrice,
    seller: "Seller",
    rentable,
    forSale,
    type,
    image: p.imageUrl || null,
    description: p.description || "",
    location: p.location || "",
    stock: p.stock,
  };
}

export const api = {
  // Products
  getProducts: () => request("/user/products"),
  getProduct: (id) => request(`/user/products/${id}`),
  getAvailableProducts: () => request("/user/products/sold"),
  getProductsByCategory: (category) => request(`/user/category/${category}`),

  createProduct: (productData) =>
    request("/user/createProduct", {
      method: "POST",
      body: JSON.stringify(productData),
    }),

  // Purchase
  createPurchase: (productId, purchaseData) =>
    request(`/user/purchases/${productId}`, {
      method: "POST",
      body: JSON.stringify(purchaseData),
    }),

  // Rent
  createRent: (rentData) =>
    request("/user/rent", {
      method: "POST",
      body: JSON.stringify(rentData),
    }),
};
