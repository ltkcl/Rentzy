import { Router } from "express";
import express from "express";
import { createProducts, getAllProducts, getProductUnderCategory, getProductUnderSpecificCategory, getSelectedProducts, getSoldproduct } from "../controllers/products.controller.js";
const productRouter = Router() ;

productRouter.route("/createProduct").get(createProducts);
productRouter.route("/products").get(getAllProducts);
productRouter.route("/products/:productId").get(getSelectedProducts);
productRouter.route("/products/sold").get(getSoldproduct);
productRouter.route("/category").get(getProductUnderCategory);
productRouter.route("/category/:category").get(getProductUnderSpecificCategory);

export default productRouter;