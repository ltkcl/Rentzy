import { Router } from "express";
import express from "express";
import { createPurchase } from "../controllers/purchase.controller.js";
const rentRouter = Router() ;


rentRouter.route("/product/:productId").post(createPurchase);

export default rentRouter;