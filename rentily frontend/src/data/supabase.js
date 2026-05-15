import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const PRODUCT_BUCKET = "Rentzy_photo";

const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
);

export async function uploadProductImage(name, file) {
  if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
    throw new Error("Supabase environment variables are missing in the frontend.");
  }

  if (!name || !file) {
    throw new Error("Missing product id or image file for upload.");
  }

  const safeName = name.replace(/[^a-zA-Z0-9-_]/g, "_");
  const filePath = `${safeName}/product.jpeg`;

  const { data, error } = await supabase.storage
    .from(PRODUCT_BUCKET)
    .upload(filePath, file, {
      upsert: true,
      contentType: file.type || "image/jpeg",
    });

  if (error) {
    console.error("Supabase upload failed:", {
      bucket: PRODUCT_BUCKET,
      filePath,
      message: error.message,
      statusCode: error.statusCode,
      error,
    });
    throw new Error(
      `Supabase upload failed: ${error.message || "unknown storage error"}`
    );
  }

  return data.path;
}

export function getPublicImageUrl(imagePath) {
  try {
    const { data } = supabase.storage.from(PRODUCT_BUCKET).getPublicUrl(imagePath);
    return data.publicUrl;
  } catch (error) {
    console.error("Unable to fetch the public image url:", error);
    return null;
  }
}

export function getProductImageUrl(productId) {
  if (!productId) return null;
  return getPublicImageUrl(`${productId}/product.jpeg`);
}
