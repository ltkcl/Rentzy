import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import webhookHandler from "./controllers/webhook.controller.js";
import router from "./routes/user.routes.js";

const app = express();

const corsOptions = {
    origin: process.env.CORS_ORIGIN,
    credentials: true
};

app.use(cors(corsOptions));

// Webhook route MUST be before express.json() to get raw body
app.post("/api/v1/webhook", express.raw({ type: "application/json" }), webhookHandler);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(clerkMiddleware());

app.use("/api/v1", router);

app.use((err, req, res, next) => {
    console.error("Request failed:", err);
    const statusCode = err?.statusCode || 500;
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message: err?.message || "Internal Server Error",
        error: err?.error || [],
    });
});

export default app;
