import { asyncHandler } from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js"
import { getAuth } from "@clerk/express";
import {prisma} from "../db/index.js";
import ApiResponse from "../utils/ApiResponse.js";

// To get all the available products from the database and send it to the client  
const createProducts = asyncHandler(async (req,res)=>{
    const {userId , prodName , purchasePrice , rentPrice , prodType, stock , isAvailable , condition ,createAt } = req.body;
    if( !userId || !prodName || !purchasePrice || !rentPrice || !prodType || !stock || !isAvailable || !condition || !createAt){
        throw new ApiError(400 ,"Please enter all the fields");
    }
    try {
        const createProduct = await prisma.products.create({
            userId : userId,
            prodName : prodName,
            purchasePrice : purchasePrice,
            rentPrice : rentPrice,
            prodType: prodType,
            stock:stock,
            isAvailable: isAvailable,
            condition:condition,
            createAt: createAt
        })
        if(!createProduct){
            throw new ApiError(500,"Unable to create new products"); 
        }
        return res.status(200).json(new ApiResponse(200,createProduct,"The product is created"));
    } catch (error) {
        throw new ApiError(500,"Unable to create new products");
    }
})
const getAllProducts = asyncHandler(async (req,res)=>{
   try {
    const getProducts = await prisma.products.findMany();
   if(!getProducts){
    throw new ApiError(500,"Unable to retrieve the products");
   } 
   return res.status(200).json(new ApiResponse(200,getProducts,"Products were retrieved"));
   } catch (error) {
    throw new ApiError(500,"Unable to retrieve the products");
   }
}) 
// To get the user products and sent it to the client
const getSelectedProducts = asyncHandler(async (req,res)=>{
    try {
        const {productId} = req.params; 
        if(!productId){
            throw new ApiError(400,"Provide the id parameter");
        }
        console.log(""+productId);
        const getProducts = await prisma.products.findUnique({
            where:{
                prodId: productId
            },
        });
        console.log(getProducts);
        if(!getProducts){
            throw new ApiError(500,"Unable to retrieve the products");
        } 
        
        return res.status(200).json(new ApiResponse(200,getProducts,"Product was retrieved"));
        } catch (error) {
            throw new ApiError(500,"Unable to retrieve the products"+error);
            }
    });
// To get all the products that are in sale and sent it to the client     
const getSoldproduct = asyncHandler(async (req,res)=>{
    try {
        const getProducts = await prisma.purchase.findMany({
            where:{
                IsSold : false,
                stock : {
                    gt : 0
                },
                isAvailable : true
            }
        });
   if(!getProducts){
    throw new ApiError(500,"Unable to retrieve the products");
   } 
   return res.status(200).json(new ApiResponse(200,getProducts,"Products were retrieved"));
    } catch (error) {
        throw new ApiError(500,"Unable to retrieve the products for purchase");
    }
})
// To get all the products of a category and send it to the client
const getProductUnderCategory = asyncHandler(async (req,res)=>{
    try {
        const getProducts = await prisma.products.groupBy({
            by : ["prodType"],
            _count :{
                prodType: true
            }
        })
        if(!getProducts){
            throw new ApiError(500,"Unable to retrieve the products under the category");
        }
        return res.status(200).json(new ApiResponse(200,getProducts,"Products under the category were retrieved"));
    } catch (error) {
        throw new ApiError(500,"Unable to retrive the products under the category");
    }
})
// To get product under specified category and send it to the client
const getProductUnderSpecificCategory = asyncHandler(async (req,res)=>{
    const {category} = req.params; 
    if(!category){
        throw new ApiError(400,"Provide the category parameter");
    }   
    try {
        const getProducts = await prisma.products.findMany({
           where:{
            prodType : category
           }
        })
        if(!getProducts){
            throw new ApiError(500,"Unable to retrieve the products under the category");
        }
        return res.status(200).json(new ApiResponse(200,getProducts,"Products under the category were retrieved"));
    } catch (error) {
        throw new ApiError(500,"Unable to retrive the products under the category");
    }
})  
// To make the status of product availibilty 
const updatingStockAvailability = asyncHandler(async (req,res)=>{
    const {vendorId , availableStock} = req.body;
    if(!vendorId || !availableStock){
        throw new ApiError(400,"Please enter all the fields");
    }
    try {
         const updateStock = await prisma.products.update({
                where:{
                    userId : vendorId
                },
                data:{
                    stock : availableStock,
                    isAvailable: available
                }
            });  
            if(!updateStock){
                throw new ApiError(500,"Unable to update the stock availability");
            }
            return res.status(200).json(new ApiResponse(200,updateStock,"Stock availability was updated successfully"));  
    } catch (error) {
        throw new ApiError(500,"Unable to update the stock availability");
    }
})
export {createProducts,getAllProducts,getSelectedProducts,getSoldproduct,getProductUnderCategory,getProductUnderSpecificCategory}