import React,{StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { ClerkProvider } from '@clerk/react'
import { UserButton } from "@clerk/react";
const publishableKey =import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!publishableKey) {
  throw new Error("Missing Publishable Key")
}


createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <ClerkProvider publishableKey={publishableKey}>
        <App></App>
      </ClerkProvider>
    
  </React.StrictMode>
);
