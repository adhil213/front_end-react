import { createContext, useState } from "react";
import { Toaster } from "react-hot-toast";

import "./App.css";
import { Route, Routes, Navigate } from "react-router-dom"; 
import { Home } from "./pages/Home";      
import { Products } from "./pages/Products"; 
import Navbar from "./component/Nav";  
import AboutUs from "./pages/About"; 
import { AuthPage } from "./pages/AuthPage";
import { Productsdetaail } from "./pages/Productsdetaail";
import Cart from "./pages/Cart";
import PaymentPage from "./pages/Paymentpage";
import Orders from "./pages/Orders";
import ContactPage from "./pages/ContactPage";
import Footer from "./component/Footer";
import { Admin } from "./pages/Admin";
import { AddProduct } from "./pages/admin/AddProduct";
import { ListProducts } from "./pages/admin/ListProducts";
import { AdminOrders } from "./pages/admin/AdminOrders";
import { AdminUsers } from "./pages/admin/AdminUsers";
import { Dashboard } from "./pages/admin/Dashboard";
import { EditProduct } from "./pages/admin/EditProduct";
import ScrollToTop from "./component/ScrollToTop";
import { UserDetails } from "./pages/admin/UserDetails";
import { ProtectedAdminRoute } from "./component/ProtectedAdminRoute";
import NotFound from "./pages/NotFound";

export const SearchContext = createContext();

function App() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          style: {
            background: "#131316",
            color: "#e8e6e1",
            border: "1px solid rgba(201, 168, 76, 0.2)",
            borderRadius: "0.75rem",
            padding: "12px 24px",
            fontSize: "14px",
            fontWeight: "600",
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: "#c9a84c",
              secondary: "#0c0c0f",
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />
      <SearchContext.Provider value={{ searchTerm, setSearchTerm }}>
        <Navbar />
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/products/:id" element={<Productsdetaail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/contact" element={<ContactPage />} />

          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <Admin />
              </ProtectedAdminRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />

            <Route path="dashboard" element={<Dashboard />} />
            <Route path="add-product" element={<AddProduct />} />
            <Route path="list-products" element={<ListProducts />} />
            <Route path="list-products/:id" element={<EditProduct />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="users/:id" element={<UserDetails />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </SearchContext.Provider>
      <Footer />
    </>
  );
}

export default App;
