import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
);

export const upload = async (name, file) => {
  try {
    const extension = file.name.split(".").pop();
    const filePath = `${name}/product.${extension}`;

    const { data, error } = await supabase.storage
      .from("Rentzy_photo")
      .upload(filePath, file, { upsert: true });

    if (error) {
      throw error;
    }

    return data.path;
  } catch (error) {
    console.error("Unable to upload the file:", error);
    return null;
  }
};

const getPublicUrl = (imagePath) => {
  try {
    const { data } = supabase.storage.from("Rentzy_photo").getPublicUrl(imagePath);
    return data.publicUrl;
  } catch (error) {
    console.error("Unable to fetch the url:", error);
    return null;
  }
};

export default getPublicUrl;
