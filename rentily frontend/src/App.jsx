import {
  createBrowserRouter,
  redirect,
  RouterProvider,
} from "react-router-dom";
import { SignedIn, SignedOut, RedirectToSignIn, useUser } from "@clerk/clerk-react";
import BrowsePage from "./Pages/BrowsePage";
import CategoryPage from "./Pages/CategoryPage";
import CreateProduct from "./Pages/CreateProduct";
import HomePage from "./Pages/HomePage";
import ProductDetails from "./Pages/ProductDetails";
import SellRentPage from "./Pages/SellRentPage";
import RouteErrorBoundary from "./components/RouteErrorBoundary";
import ProtectedRoute from "./components/ProtectedRoute";
import { uploadProductImage } from "./data/supabase";
import {
  api,
  browseLoader,
  categoryLoader,
  homeLoader,
  listingsLoader,
  productLoader,
} from "./services/api";

async function createProductFormLoader() {
  return { product: null };
}

async function saveProductAction({ request, params }, user) {
  const formData = await request.formData();
  const productId = params.productId;

  const userId = formData.get("userId")?.toString().trim();
  const title = formData.get("title")?.toString().trim();
  const category = formData.get("category")?.toString().trim();
  const condition = formData.get("condition")?.toString().trim();
  const type = formData.get("type")?.toString().trim() || "rent";
  const stockValue = formData.get("stock")?.toString().trim();
  const priceValue = formData.get("price")?.toString().trim();
  const rentPriceValue = formData.get("rentPrice")?.toString().trim();
  const description = formData.get("description")?.toString().trim() || "";
  const location = formData.get("location")?.toString().trim() || "";
  const imageFile = formData.get("image");

  const purchasePrice =
    type === "rent" ? 0 : Number.parseInt(priceValue || "0", 10) || 0;
  const rentPrice =
    type === "sell" ? 0 : Number.parseInt(rentPriceValue || "0", 10) || 0;
  const stock = Number.parseInt(stockValue || "1", 10) || 1;

  if (!userId || !title || !category || !condition) {
    return {
      error: "Please fill in the required fields before posting.",
    };
  }

  if (type !== "rent" && purchasePrice <= 0) {
    return {
      error: "Buy price must be greater than 0 for sell or both listings.",
    };
  }

  if (type !== "sell" && rentPrice <= 0) {
    return {
      error: "Rent price must be greater than 0 for rent or both listings.",
    };
  }

  if (!productId && (!(imageFile instanceof File) || imageFile.size === 0)) {
    return {
      error: "Please upload a product image before posting.",
    };
  }

  try {
    const payload = {
      userId,
      userEmail: user?.primaryEmailAddress?.emailAddress,
      userName: user?.fullName,
      prodName: title,
      purchasePrice,
      rentPrice,
      prodType: category,
      stock,
      isAvailable: true,
      condition,
      createdAt: new Date().toISOString(),
      description,
      location,
    };

    if (productId) {
      await api.updateProduct(productId, payload);

      if (imageFile instanceof File && imageFile.size > 0) {
        await uploadProductImage(productId, imageFile);
      }
    } else {
      const createResponse = await api.createProduct(payload);

      const createdProduct = createResponse?.data;
      const createdProductId = createdProduct?.prodId;

      if (!createdProductId) {
        return {
          error: "Product was created but no product id was returned.",
        };
      }

      await uploadProductImage(createdProductId, imageFile);
    }

    return redirect("/sell");
  } catch (error) {
    return {
      error: error.message || "Unable to create the listing right now.",
    };
  }
}

function AppRouter() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) return null;

  const router = createBrowserRouter([
    {
      path: "/",
      Component: HomePage,
      loader: homeLoader,
      errorElement: <RouteErrorBoundary />,
    },
    {
      path: "/category/:categoryId",
      Component: CategoryPage,
      loader: categoryLoader,
      errorElement: <RouteErrorBoundary />,
    },
    {
      path: "/product/:productId",
      Component: ProductDetails,
      loader: productLoader,
      errorElement: <RouteErrorBoundary />,
    },
    {
      path: "/browse",
      Component: BrowsePage,
      loader: browseLoader,
      errorElement: <RouteErrorBoundary />,
    },
    {
      path: "/sell",
      element: (
        <ProtectedRoute>
          <SellRentPage />
        </ProtectedRoute>
      ),
      loader: () => listingsLoader(user?.id),
      errorElement: <RouteErrorBoundary />,
    },
    {
      path: "/sell/create-product",
      element: (
        <ProtectedRoute>
          <CreateProduct />
        </ProtectedRoute>
      ),
      loader: createProductFormLoader,
      action: (args) => saveProductAction(args, user),
      errorElement: <RouteErrorBoundary />,
    },
    {
      path: "/sell/edit-product/:productId",
      element: (
        <ProtectedRoute>
          <CreateProduct />
        </ProtectedRoute>
      ),
      loader: productLoader,
      action: (args) => saveProductAction(args, user),
      errorElement: <RouteErrorBoundary />,
    },
  ]);

  return (
    <>
      <SignedIn>
        <RouterProvider router={router} />
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}

function App() {
  return <AppRouter />;
}

export default App;
