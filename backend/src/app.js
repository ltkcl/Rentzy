import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
const app = express();

const corsOptions = {
    origin :process.env.CORS_ORIGIN,
    Credential : true
}    
app.use(cors(corsOptions));
app.use(express.urlencoded({extended : true}));
app.use(express.static("public"));
app.use(clerkMiddleware());

import router from "./routes/user.routes.js";
app.use("/api/v1",router);
export default app;

// /api/v1/user/products