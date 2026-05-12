import pkg from "dotenv";
const env = pkg; 
env.config({ 
    path: '.env'
})
import connectDB from "./db/index.js";
import ApiError from "./utils/ApiError.js";
import app from "./app.js";
import path from "node:path";
const PORT = process.env.PORT || 4242;



connectDB()
.then(()=>{
    app.listen(PORT,()=>{
        console.log(`Server is listening to http://localhost:${PORT}`);
    })
})
.catch((error)=>{
    console.error("Failed ot start the server!!! : ",error);
    throw new ApiError(500,"Failed to start the server.!!!!")
})
