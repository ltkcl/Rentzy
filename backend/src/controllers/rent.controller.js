import { asyncHandler } from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js"
import { getAuth } from "@clerk/express";
import {prisma} from "../db/index.js";
import ApiResponse from "../utils/ApiResponse.js";

// To create a new rent and send the response to the client
const createRent = asyncHandler(async (req,res)=>{
    const {prodId , customerId , dateFrom , dateTo} = req.body;
    if(!prodId || !customerId || !dateFrom || !dateTo){
        throw new ApiError(400,"Please enter all the fields");
    }
    try {
        const createRent = await prisma.rent.create({
        data:{
            prodId : prodId,
            customerId : customerId,
            dateFrom : new Date(dateFrom),
            dateTo : new Date(dateTo)            
        }
    })
    if(!createRent){
        throw new ApiError(500,"Unable to create the rent");
    }
    return new ApiResponse(200,createRent,"Rent was created successfully");
    } catch (error) {
        throw new ApiError(500,"Unable to create the rent");
    }
})  
// TO get all the products that are in rent and sent it to the client
const getAllRentedProducts = asyncHandler(async (req,res)=>{
   try {
         const getProducts = await prisma.rent.findMany({
        where : {
            IsRented : true,
            IsReturned:false
        }
    })
    if(!getProducts){
        throw new ApiError(500,"Unable to retrieve all the rented products");
    }
    return new ApiResponse(200,getProducts,"Rented products retrieved");
   } catch (error) {
        throw new ApiError(500,"Unable to retrieve the rented products");
   }
})  
// To settle doesn the rent and sent the response to the client  
const  getSettledRent = asyncHandler(async (req,res)=>{
    try {
        const {id} = req.params;
        if(!id){
            throw new ApiError(400,"Provide the id parameter");
        }
        const settleProduct = await prisma.rent.update({
            where :{
                rentid : id
            },
            data :{
                IsRented : false,
                IsReturned :true
            }
        })
        if(!settleProduct){
            throw new ApiError(500,"Unable to settle the rented products");
        }
        return new ApiResponse(200,settleProduct,"Rent was settled successfully");
    } catch (error) {
        throw new ApiError(500,"Unable to settle the rented products");
    }
})
export {createRent,getAllRentedProducts,getSettledRent}


