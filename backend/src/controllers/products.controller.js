import { asyncHandler } from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js"
import { getAuth } from "@clerk/express";
import {prisma} from "../db/index.js";
import ApiResponse from "../utils/ApiResponse.js";

// To get all the available products from the database and send it to the client  
const createProducts = asyncHandler(async (req,res)=>{
    const {userId , prodName , purchasePrice , rentPrice , prodType, stock , isAvailable , condition , createdAt, userEmail, userName } = req.body;
    
    if(
        !userId ||
        !prodName ||
        purchasePrice == null ||
        rentPrice == null ||
        !prodType ||
        stock == null ||
        typeof isAvailable !== "boolean" ||
        !condition ||
        !createdAt
    ){
        throw new ApiError(400 ,"Please enter all the fields");
    }

    try {
        // Just-in-Time (JIT) User Creation
        // This ensures that even if the Clerk webhook hasn't arrived yet, 
        // the foreign key constraint is satisfied.
        await prisma.user.upsert({
            where: { id: userId },
            update: {
                name: userName || "New User",
                email: userEmail || `${userId}@clerk.user`
            },
            create: {
                id: userId,
                name: userName || "New User",
                email: userEmail || `${userId}@clerk.user`,
                createdAt: new Date()
            }
        });

        const createProduct = await prisma.products.create({
            data: {
                userId,
                prodName,
                purchasePrice,
                rentPrice,
                prodType,
                stock,
                isAvailable,
                condition,
                createdAt: new Date(createdAt)
            }
        })
        
        if(!createProduct){
            throw new ApiError(500,"Unable to create new products"); 
        }
        return res.status(201).json(new ApiResponse(201,createProduct,"The product is created"));
    } catch (error) {
        console.error("Product creation error:", error);
        throw new ApiError(500,"Unable to create new products: "+error.message);
    }
})

const getAllProducts = asyncHandler(async (req,res)=>{
   try {
    const { userId } = req.query;
    
    const getProducts = await prisma.products.findMany({
        where: userId ? { userId: userId } : {}
    });

    if(!getProducts){
        throw new ApiError(500,"Unable to retrieve the products");
    } 
    return res.status(200).json(new ApiResponse(200,getProducts,"Products were retrieved"));
   } catch (error) {
    throw new ApiError(500,"Unable to retrieve the products: "+error.message);
   }
}) 

// To get the user products and sent it to the client
const getSelectedProducts = asyncHandler(async (req,res)=>{
    try {
        const {productId} = req.params; 
        if(!productId){
            throw new ApiError(400,"Provide the id parameter");
        }
        const getProducts = await prisma.products.findUnique({
            where:{
                prodId: productId
            },
        });
        if(!getProducts){
            throw new ApiError(500,"Unable to retrieve the products");
        } 
        
        return res.status(200).json(new ApiResponse(200,getProducts,"Product was retrieved"));
    } catch (error) {
        throw new ApiError(500,"Unable to retrieve the products: "+error.message);
    }
});

// To get all the products that are NOT sold and are available
const getSoldproduct = asyncHandler(async (req,res)=>{
    try {
        const getProducts = await prisma.products.findMany({
            where:{
                stock : {
                    gt : 0
                },
                isAvailable : true
            }
        });
        if(!getProducts){
            throw new ApiError(500,"Unable to retrieve the available products");
        } 
        return res.status(200).json(new ApiResponse(200,getProducts,"Available products were retrieved"));
    } catch (error) {
        throw new ApiError(500,"Unable to retrieve the products for purchase: "+error.message);
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
        throw new ApiError(500,"Unable to retrieve the products under the category: "+error.message);
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
        throw new ApiError(500,"Unable to retrieve the products under the category: "+error.message);
    }
})  

const updateProduct = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const { userId, prodName, purchasePrice, rentPrice, prodType, stock, isAvailable, condition } = req.body;

    if (!productId) {
        throw new ApiError(400, "Provide the product id parameter");
    }

    if (
        !userId ||
        !prodName ||
        purchasePrice == null ||
        rentPrice == null ||
        !prodType ||
        stock == null ||
        typeof isAvailable !== "boolean" ||
        !condition
    ) {
        throw new ApiError(400, "Please enter all the fields");
    }

    try {
        const updatedProduct = await prisma.products.update({
            where: {
                prodId: productId,
            },
            data: {
                userId,
                prodName,
                purchasePrice,
                rentPrice,
                prodType,
                stock,
                isAvailable,
                condition,
            },
        });

        return res
            .status(200)
            .json(new ApiResponse(200, updatedProduct, "Product was updated successfully"));
    } catch (error) {
        throw new ApiError(500, "Unable to update the product: " + error.message);
    }
});

const deleteProduct = asyncHandler(async (req, res) => {
    const { productId } = req.params;

    if (!productId) {
        throw new ApiError(400, "Provide the product id parameter");
    }

    try {
        const deletedProduct = await prisma.products.delete({
            where: {
                prodId: productId,
            },
        });

        return res
            .status(200)
            .json(new ApiResponse(200, deletedProduct, "Product was deleted successfully"));
    } catch (error) {
        throw new ApiError(500, "Unable to delete the product: " + error.message);
    }
});

// To update the status of product availability 
const updatingStockAvailability = asyncHandler(async (req,res)=>{
    const {prodId , availableStock} = req.body;
    if(!prodId || availableStock == null){
        throw new ApiError(400,"Please enter all the fields");
    }
    try {
         const updateStock = await prisma.products.update({
                where:{
                    prodId : prodId
                },
                data:{
                    stock : availableStock,
                    isAvailable: availableStock > 0
                }
            });  
            if(!updateStock){
                throw new ApiError(500,"Unable to update the stock availability");
            }
            return res.status(200).json(new ApiResponse(200,updateStock,"Stock availability was updated successfully"));  
    } catch (error) {
        throw new ApiError(500,"Unable to update the stock availability: "+error.message);
    }
})

export {
    createProducts,
    getAllProducts,
    getSelectedProducts,
    getSoldproduct,
    getProductUnderCategory,
    getProductUnderSpecificCategory,
    updateProduct,
    deleteProduct,
    updatingStockAvailability
}
