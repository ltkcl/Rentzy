import { Router } from "express";
import express from "express";
import { createProducts, deleteProduct, getAllProducts, getProductUnderCategory, getProductUnderSpecificCategory, getSelectedProducts, getSoldproduct, updateProduct } from "../controllers/products.controller.js";
const productRouter = Router() ;

productRouter.route("/createProduct").post(createProducts);
productRouter.route("/products").get(getAllProducts);
productRouter.route("/products/:productId").get(getSelectedProducts).put(updateProduct).delete(deleteProduct);
productRouter.route("/products/sold").get(getSoldproduct);
productRouter.route("/category").get(getProductUnderCategory);
productRouter.route("/category/:category").get(getProductUnderSpecificCategory);

export default productRouter;
