import "./App.css";
import React, { useState } from "react";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Cart from "./components/Cart";
import AddProduct from "./components/AddProduct";
import Product from "./components/Product";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AppProvider } from "./Context/Context";
import UpdateProduct from "./components/UpdateProduct";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import { useEffect } from "react";
import ProtectedRoute from './ProtectedRoute.jsx'
import AdminProtectedRoute from './AdminProtectedRoute.jsx'

// 🧠 Wrapper component to handle layout logic
const Layout = ({ children, onSelectCategory }) => {
  const location = useLocation();
  const hideNavbar = ["/login", "/register"].includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar onSelectCategory={onSelectCategory} />}
      {children}
    </>
  );
};

function App() {
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    console.log("Selected category:", category);
  };

  const addToCart = (product) => {
    const existingProduct = cart.find((item) => item.id === product.id);
    if (existingProduct) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  return (
    <AppProvider>
      <BrowserRouter>
        <Layout onSelectCategory={handleCategorySelect}>
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  addToCart={addToCart}
                  selectedCategory={selectedCategory}
                />
              }
            />
            <Route path="/add_product" element={
              <AdminProtectedRoute>
                 <AddProduct />
              </AdminProtectedRoute>
            } />
            <Route path="/product" element={
              <ProtectedRoute>
                <Product />
              </ProtectedRoute>
            } />
            <Route path="/product/:id" element={<ProtectedRoute>
                <Product />
              </ProtectedRoute>} />
            <Route path="/cart" element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            } />
            <Route path="/product/update/:id" element={
              <AdminProtectedRoute>
                <UpdateProduct />
              </AdminProtectedRoute>
            } />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
