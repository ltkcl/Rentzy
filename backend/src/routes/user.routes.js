import { Router } from "express";
// import registerUser from "../controllers/user.controller.js";
import POST from "../controllers/webhook.controller.js";
import express from "express";
import productRouter from "./products.routes.js";
import purchaseRouter from "./rent.routes.js";
import app from "../app.js"; 
import rentRouter from "./rent.routes.js";
const router = Router() ;

// to sign-up a user
router.use("/webhook",express.raw({ type: "application/json" }),POST);
router.use("/user", express.json(), productRouter,purchaseRouter,rentRouter);

export default router;