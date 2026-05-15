import { Webhook } from "svix";
import { prisma } from "../db/index.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const POST = asyncHandler(async (req, res) => {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SIGNING_SECRET;
    if (!WEBHOOK_SECRET) {
        throw new ApiError(500, "Webhook secret is not defined in the environment variables.");
    }

    const svix_id = req.get("svix-id");
    const svix_timestamp = req.get("svix-timestamp");
    const svix_signature = req.get("svix-signature");

    if (!svix_id || !svix_timestamp || !svix_signature) {
        throw new ApiError(400, "Missing required Svix headers.");
    }

    const payload = req.body.toString("utf-8");
    const wh = new Webhook(WEBHOOK_SECRET);
    
    let evt;
    try {
        evt = wh.verify(payload, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        });
    } catch (err) {
        console.error("Webhook verification failed:", err.message);
        throw new ApiError(400, "Invalid webhook signature");
    }

    const eventType = evt.type;
    const { id, first_name, last_name, email_addresses, created_at } = evt.data;

    // To add new users to database
    if (eventType === "user.created") {
        try {
            const email = email_addresses?.[0]?.email_address;
            
            if (!id || !email) {
                throw new ApiError(400, "Missing required user data (id or email)");
            }

            const user = await prisma.user.upsert({
                where: { id: id },
                update: {
                    name: `${first_name || ""} ${last_name || ""}`.trim() || "Unknown User",
                    email: email,
                },
                create: {
                    id: id,
                    name: `${first_name || ""} ${last_name || ""}`.trim() || "Unknown User",
                    email: email,
                    createdAt: new Date(created_at || Date.now()),
                },
            });

            return res.status(200).json(new ApiResponse(200, user, "User created/synced successfully"));
        } catch (error) {
            console.error("Error occurred while processing user.created event:", error);
            throw new ApiError(500, "Internal error processing user creation");
        }
    }

    // To update the user details in the database
    if (eventType === "user.updated") {
        try {
            const email = email_addresses?.[0]?.email_address;

            if (!id) {
                throw new ApiError(400, "Missing user ID for update");
            }

            const updateUser = await prisma.user.update({
                where: { id: id },
                data: {
                    name: `${first_name || ""} ${last_name || ""}`.trim() || "Unknown User",
                    email: email,
                },
            });

            return res.status(200).json(new ApiResponse(200, updateUser, "User updated successfully"));
        } catch (error) {
            console.error("Error occurred while processing user.updated event:", error);
            throw new ApiError(500, "Internal error processing user update");
        }
    }

    // To delete the user details from the database
    if (eventType === "user.deleted") {
        try {
            if (!id) {
                throw new ApiError(400, "Missing user ID for deletion");
            }

            await prisma.user.delete({
                where: { id: id },
            });

            return res.status(200).json(new ApiResponse(200, null, "User deleted successfully"));
        } catch (error) {
            console.error("Error occurred while processing user.deleted event:", error);
            return res.status(200).json(new ApiResponse(200, null, "User deletion acknowledged"));
        }
    }

    return res.status(200).json(new ApiResponse(200, null, "Webhook event received"));
});

export default POST;
