import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import toast styles
import SignUp from "./Login _signup_pages/SignUp";
import VerifyOTP from "./Login _signup_pages/VerifyOTP";
import LandingPage from "./Login _signup_pages/LandingPage";
import Login from "./Login _signup_pages/Login";
import Customer from "./Login _signup_pages/Customer";
import ForgotPassword from "./Login _signup_pages/ForgotPassword";
import ResetPassword from "./Login _signup_pages/PasswordReset";
import Admin from "./Login _signup_pages/Admin";
import { UserProvider } from "./Login _signup_pages/UserContext";
import DashBoard from "./AdminPages/DashBoard";
import Product from "./AdminPages/Product";
import Order from "./AdminPages/Order";
import Stock from "./AdminPages/Stock";
import Sales from "./AdminPages/Sales";
import ProductPage from "./CustomerPages/ProductPage";
import HomePage from "./CustomerPages/HomePage";
import Cart from "./CustomerPages/Cart";
import OrderForm from "./CustomerPages/OrderForm";
import Orders from "./CustomerPages/Orders";
import AddProduct from "./AdminPages/AddProduct";
import { CustomerProvider } from "./ContextApi/CustomerContext";
import UpdateProduct from "./AdminPages/UpdateProduct";
import SinglePageProduct from "./CustomerPages/SinglePageProduct";
import { CartProvider } from "./ContextApi/CartContext";
import SingleProductCart from "./CustomerPages/SingleProudctCart";
import { OrdersProvider } from "./ContextApi/OrderContext";
import ProtectedRoute from "./ProtectedRoute"; // Import the ProtectedRoute component
import Account from "./CustomerPages/Account";
import { CountsProvider } from "./ContextApi/CountsContext";

const App = () => {
  return (
    <CustomerProvider>
      <ToastContainer /> {/* Toast container for notifications */}
      <OrdersProvider>
        <CartProvider>
          <UserProvider>
            <CountsProvider>
              <Router>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/verify-otp" element={<VerifyOTP />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route
                    path="/reset-password/:token"
                    element={<ResetPassword />}
                  />

                  {/* Admin Routes - Protected */}
                  <Route
                    path="/admin/:userId/*"
                    element={
                      <ProtectedRoute>
                        <Admin />
                      </ProtectedRoute>
                    }
                  >
                    <Route path="dashboard" element={<DashBoard />} />
                    <Route path="product" element={<Product />} />
                    <Route path="order" element={<Order />} />
                    <Route path="stock" element={<Stock />} />
                    <Route path="sales" element={<Sales />} />
                    <Route path="addproduct" element={<AddProduct />} />
                    <Route
                      path="updateproduct/:productId"
                      element={<UpdateProduct />}
                    />
                  </Route>

                  {/* Customer Routes - Protected */}
                  <Route
                    path="/customer/:userId/*"
                    element={
                      <ProtectedRoute>
                        <Customer />
                      </ProtectedRoute>
                    }
                  >
                    <Route path="home" element={<HomePage />} />
                    <Route path="product" element={<ProductPage />} />
                    <Route path="orders" element={<Orders />} />
                    <Route path="account" element={<Account />} />
                    <Route path="cart" element={<Cart />} />
                    <Route
                      path="singleproductcart"
                      element={<SingleProductCart />}
                    />
                    <Route
                      path="singleproduct/:productId"
                      element={<SinglePageProduct />}
                    />
                    <Route path="orderform" element={<OrderForm />} />
                  </Route>
                </Routes>
              </Router>
            </CountsProvider>
          </UserProvider>
        </CartProvider>
      </OrdersProvider>
    </CustomerProvider>
  );
};

export default App;
