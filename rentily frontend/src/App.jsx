import { Routes, Route } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import CategoryPage from "./Pages/CategoryPage";
import ProductDetails from "./Pages/ProductDetails";
import BrowsePage from "./Pages/BrowsePage";
import SellRentPage from "./Pages/SellRentPage";
import CreateProduct from "./Pages/CreateProduct";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/category/:categoryId" element={<CategoryPage />} />
      <Route path="/product/:productId" element={<ProductDetails />} />
      <Route path="/browse" element={<BrowsePage />} />
      <Route path="/sell" element={<SellRentPage />} />
      <Route path="/sell/create-product" element={<CreateProduct />} />
    </Routes>
  );
}

export default App;
