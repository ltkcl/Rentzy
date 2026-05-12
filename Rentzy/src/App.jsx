import { Routes, Route, data, redirect } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import CategoryPage from "./Pages/CategoryPage";
import ProductDetails from "./Pages/ProductDetails";
import Sign_up from "./Pages/SignUp.jsx";
import {createBrowserRouter , RouterProvider } from "react-router-dom";
import axios from "axios";
import { useAuth } from "@clerk/react";
import { useEffect } from "react";



const router = createBrowserRouter([{
  path:"/sign-up",
  Component: Sign_up
},
  {
    path : "/",
    Component : HomePage,    
    loader : async ()=>{
      // Adding all the products in the homepage from the servers at line 301
      try{
        const products = await axios.get("http://localhost:3000/api/v1/user/products");
        if(products.status>=400){
          console.error("Unable to retrieve the product .");
        }
        const productsUnderCategory = await axios.get("http://localhost:3000/api/v1/user/category");
        if(productsUnderCategory.status>=400){
          console.error("Unable to retrieve the product .");
        }
        return {
          products : products.data,
          category : productsUnderCategory.data
        };
      }catch(err){
        console.error("Error while fetching home products : "+err); 
      }        
    }
    
  },
  {
    path : "/category/:categoryId",
    Component : CategoryPage,
    loader : async ({params})=>{
      try {
        const productsUnderCategory = await axios.get(`http://localhost:3000/api/v1/user/category/${params.categoryId}`);
        if(productsUnderCategory.status>=400){
          console.error("Unable to retrieve the product under the category");
        }
        return {
          products : productsUnderCategory.data
        };
      } catch (error) {
          console.error("Error while fetching home products under a category : "+error)
      }
    }
  },
  { 
    path : "/product/:productId" ,
    Component : ProductDetails,
    loader :  async ({params})=>{
      try {
        const productsUsingId = await axios.get(`http://localhost:3000/api/v1/user/products/${params.productId}`);
        if(productsUsingId.status>=400){
          console.error("Unable to retrieve the product using product id");
        }
        return {
          products : productsUsingId.data
        };        
      } catch (error) {
        console.error("Error while fetching home products using product id : "+error)

      }
    }
  }
])

function App() {
  
  return (
    <RouterProvider router={router} />
  );
}

export default App;
