import { Router } from "express";
import express from "express";
import { createPurchase } from "../controllers/purchase.controller.js";
const purchaseRouter = Router() ;


purchaseRouter.route("/purchases/:productId").post(createPurchase);

export default purchaseRouter;