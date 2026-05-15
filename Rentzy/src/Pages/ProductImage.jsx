import React from "react";
import { useState, useEffect } from "react";
import getPublicUrl from "../data/superbase";

function ProductImage({ item }) {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    const url = getPublicUrl(`${item.prodId}/product.jpeg`);
    setImageUrl(url);
  }, [item.prodId]);

  if (!imageUrl) {
    return null;
  }

  return <img src={imageUrl} alt={item.prodName} />;
}

export default ProductImage;
