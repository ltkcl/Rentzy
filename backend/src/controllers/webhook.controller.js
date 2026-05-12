import { Webhook } from "svix";
import e, { json } from "express";
import { prisma } from "../db/index.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js"
import { use } from "react";
import {asyncHandler} from "../utils/asyncHandler.js";
// To make a webhook and connect database and send it to the clientexport async function POST(req, res) {
const POST = asyncHandler(async (req,res)=>{
     const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SIGNING_SECRET;
    if (!WEBHOOK_SECRET) {
        throw new Error("Webhook secret is not defined in the environment variables.");
    }
    const svix_id = req.get("svix-id");
    const svix_timestamp = req.get("svix-timestamp");
    const svix_signature = req.get("svix-signature");

    if (!svix_id || !svix_timestamp || !svix_signature) {
        throw new Error("Missing required Svix headers.");
    }

    const payload = req.body.toString("utf-8");
    const wh = new Webhook(WEBHOOK_SECRET);
    const evt = wh.verify(payload, {
        "svix-id": req.get("svix-id"),
        "svix-timestamp": req.get("svix-timestamp"),
        "svix-signature": req.get("svix-signature"),
    })   
    const eventType = evt.type;
    // To add new users to data base and send the response to the client
    if (eventType === "user.created") {       
        try {
            const {primary_email_address_id,email_addresses} = evt.data;
            const email = email_addresses;       
            
            const { id,first_name,last_name,created_at } = evt.data;
            if(!id || !first_name || !last_name || !email ){
                throw new ApiError(400,"Please enter the field ")
            }
           const user = await prisma.user.create({
            data:{
                id : id,
                name: first_name+" "+last_name,               
                email: email[0].email_address,
                createdAt: new Date(created_at)
                },
           });         
           if(!user){
            throw new ApiError(400,"Unable add user to the database");
           }   
           return res.status(200).json(new ApiResponse(200,user,"New user was added to the database"));
        } catch (error) {
            console.error("Error occurred while processing user created event", error);
            throw new ApiError(400, "Error occurred while processing user created event");
        }
    }
    // To delete the user details from the database and send to the client
    if (eventType === "user.deleted"){
        try {
            const {id} = evt.data;
            if(!id){
                throw new ApiError(400,"Error occurred while deleting the user ");
            }
            const deleteUser = await prisma.user.delete({
                where: {
                    id: id,
                },
            });
            if(!deleteUser){
                throw new ApiError(400,"Error while deleting the user"+error);
            }
            return res.status(200).json(new ApiResponse(200,null,"The user was deleted successfully"));
        } catch (error) {
            throw new ApiError(400,"Error while deleting the user"+error);
        }
    }
    // To update the user details in the database and send to the client
    if( eventType == "user.updated"){
        try {
            const { id,first_name,last_name,created_at,email} = evt.data;            
            if(!id){
                throw new ApiError(400,"Error occurred while updating the user ");
            } 
            const updateUser = await prisma.user.update({
                where:{ id: id},
                data:{
                id : id,
                name: first_name+" "+last_name,
                email: email[0].email_address,
                createdAt: new Date(created_at)
                }
            });
            if(!updateUser){
                throw new ApiError(400,"Unable to update the user");
            }
            return res.status(200).json(new ApiResponse(200,updateUser,"User was updated successfully"));
        } catch (error) {
            throw new ApiError(400,"Error while updating the user");
        }
    }

}) 
export default POST;