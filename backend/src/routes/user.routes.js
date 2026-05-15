import { Router } from "express";
import productRouter from "./products.routes.js";
import purchaseRouter from "./purchase.routes.js";
import rentRouter from "./rent.routes.js";

const router = Router();

// Routes for user-related actions (products, purchases, rents)
// Mounted under /api/v1/user in app.js if desired, or /api/v1 directly
router.use("/user", productRouter, purchaseRouter, rentRouter);

export default router;
