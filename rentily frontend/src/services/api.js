import { getProductImageUrl } from "../data/supabase";

const API_BASE = "/api/v1";

async function request(endpoint, options = {}) {
  const config = {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  };

  const res = await fetch(`${API_BASE}${endpoint}`, config);
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || `Request failed with status ${res.status}`);
  }

  return data;
}

function unwrapData(response) {
  return response?.data ?? response;
}

function inferType({ rentable, forSale }) {
  if (rentable && forSale) return "both";
  if (rentable) return "rent";
  return "sell";
}

/**
 * Maps a backend Products record to the shape the frontend components expect.
 * This also tolerates already-normalized frontend product objects.
 */
export function mapProduct(product) {
  if (!product) return null;

  const id = product.prodId ?? product.id;
  const title = product.prodName ?? product.title ?? "Untitled product";
  const category = product.prodType ?? product.category ?? "uncategorized";
  const available = product.isAvailable ?? product.available ?? false;
  const condition = product.condition ?? "Good";
  const rentPrice =
    product.rentPrice != null && Number(product.rentPrice) > 0
      ? Number(product.rentPrice)
      : null;
  const buyPrice =
    product.purchasePrice != null
      ? Number(product.purchasePrice)
      : Number(product.buyPrice ?? 0);
  const rentable = product.rentable ?? rentPrice != null;
  const forSale = product.forSale ?? buyPrice > 0;

  return {
    id,
    userId: product.userId ?? "",
    title,
    category,
    available,
    condition,
    rentPrice,
    buyPrice,
    seller: product.seller ?? "Seller",
    rentable,
    forSale,
    type: product.type ?? inferType({ rentable, forSale }),
    image: product.imageUrl ?? product.image ?? getProductImageUrl(id),
    description: product.description ?? "",
    location: product.location ?? "",
    stock: product.stock ?? 0,
  };
}

export function mapProducts(products = []) {
  return products.map(mapProduct).filter(Boolean);
}

function mapCategorySummary(entry) {
  return {
    id: entry.prodType,
    name: entry.prodType,
    count: entry._count?.prodType ?? 0,
  };
}

export const api = {
  getProducts: (userId) => {
    const url = userId ? `/user/products?userId=${userId}` : "/user/products";
    return request(url);
  },
  getProduct: (id) => request(`/user/products/${id}`),
  getAvailableProducts: () => request("/user/products/sold"),
  getCategories: () => request("/user/category"),
  getProductsByCategory: (category) => request(`/user/category/${category}`),

  createProduct: (productData) =>
    request("/user/createProduct", {
      method: "POST",
      body: JSON.stringify(productData),
    }),

  updateProduct: (productId, productData) =>
    request(`/user/products/${productId}`, {
      method: "PUT",
      body: JSON.stringify(productData),
    }),

  deleteProduct: (productId) =>
    request(`/user/products/${productId}`, {
      method: "DELETE",
    }),

  createPurchase: (productId, purchaseData) =>
    request(`/user/purchases/${productId}`, {
      method: "POST",
      body: JSON.stringify(purchaseData),
    }),

  createRent: (rentData) =>
    request("/user/rent", {
      method: "POST",
      body: JSON.stringify(rentData),
    }),
};

export async function homeLoader() {
  const [productsResponse, categoriesResponse] = await Promise.all([
    api.getProducts(),
    api.getCategories(),
  ]);

  return {
    products: mapProducts(unwrapData(productsResponse)),
    categories: unwrapData(categoriesResponse).map(mapCategorySummary),
  };
}

export async function browseLoader() {
  const productsResponse = await api.getProducts();
  return {
    products: mapProducts(unwrapData(productsResponse)),
  };
}

export async function categoryLoader({ params }) {
  const productsResponse = await api.getProductsByCategory(params.categoryId);
  return {
    products: mapProducts(unwrapData(productsResponse)),
    categoryId: params.categoryId,
  };
}

export async function productLoader({ params }) {
  const productResponse = await api.getProduct(params.productId);
  return {
    product: mapProduct(unwrapData(productResponse)),
  };
}

export async function listingsLoader(userId) {
  if (!userId) return { listings: [] };
  const productsResponse = await api.getProducts(userId);
  return {
    listings: mapProducts(unwrapData(productsResponse)),
  };
}
