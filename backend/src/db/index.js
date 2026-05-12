import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import pkg from "@prisma/client" 
import ApiError from "../utils/ApiError.js";
const connectionString = `${process.env.DATABASE_URL}`;
const {PrismaClient} = pkg;
const adapter = new PrismaPg({ connectionString });
export const prisma = new PrismaClient({ adapter });

const connectDB = async ()=>{
    try {
        const connection =await prisma.$connect();
        console.log("Database connected successfully !!");
    } catch (error) {
        console.error("Database connection failed",error);
        throw new ApiError(500, "Failed to connect to the database.");
    }
}

export default connectDB;