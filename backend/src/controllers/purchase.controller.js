import { asyncHandler } from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js"
import { getAuth } from "@clerk/express";
import {prisma} from "../db/index.js";
import ApiResponse from "../utils/ApiResponse.js";

// To create a new purchase and send the response to the client
const createPurchase = asyncHandler(async (req,res)=>{
    const {purchaseId , prodId , customerId , vendorId , Usedstock} = req.body;
    try {
        if(!prodId || !customerId || !vendorId || !purchaseId || !Usedstock ){
            throw new ApiError(400,"Please enter all the fields");
        }
        // To make purchase only when the product is available
        const condition = await prisma.products.findUnique({
                where:{
                    prodId : prodId
                },
                select :{
                    stock : true,
                    isAvailable :true
                }
            })
        if(!condition){
            throw new ApiError(500,"Unable to retrieve info for condition for purchase ")
        }    
        if(!condition.isAvailable || condition.stock<=0){
            throw new ApiError(400,"The product is either not available or is out of stock ") 
        }else{
            const getPurchase = await prisma.purchase.create({
            data:{
                purchaseId : purchaseId,
                prodId : prodId,
                customerId : customerId,
                vendorId : vendorId,
                IsSold : true
                }
            })
            if(!getPurchase){
                throw new ApiError(500,"Unable to create a purchase");
                }
            // To update the stock value
            const availableStock = (condition.stock-Usedstock > 0 ) ?  condition.stock-Usedstock : 0;
            const available = (availableStock!=0) ? true : false;
            const updateStock = await prisma.products.update({
                where:{
                    prodId : prodId
                },
                data:{
                    stock : availableStock,
                    isAvailable: available
                }
            });    
            return res.status(200).json(new ApiResponse(200,getPurchase,"New purchase was created"))    
         } 
        
    } catch (error) {
        throw new ApiError(500,"Unable to create the purchase: " + error.message);
    }
})
export {createPurchase}
