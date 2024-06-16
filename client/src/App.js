import { Routes, BrowserRouter, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Navbar from "./components/navbar/Navbar";

import Product from "./pages/product/Product";
import Cart from "./pages/cart/Cart";
import { Login } from "./pages/login/Login";
import Checkout from "./pages/checkout/Checkout";
import Order from "./pages/order/Order";
import Success from "./pages/payment/Success";
import Cancel from "./pages/payment/Cancel";
import Footer from "./components/footer/Footer";
import NoNavLayout from "./components/layout/NoNavLayout";
import GeneralUserLayout from "./components/layout/GeneralLayout";
import NoFootLayout from "./components/layout/NoFootLayout";
import { ToastContainer, toast } from "react-toastify";
import User from "./pages/user/User";
// import Result from "./pages/result/Result";

function App() {
  // const shouldRenderNavbar = () => {
  //   const navbarRoutes = ["/login"];
  //   const currentPath = window.location.pathname;
  //   return !navbarRoutes.includes(currentPath);
  // };
  return (
    <BrowserRouter>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        draggable
        theme="colored"
      />
      <Routes>
        <Route path="/" element={<NoNavLayout />}>
          <Route path="/login" element={<Login />} />
        </Route>
        <Route path="/" element={<NoFootLayout />}>
          <Route path="/myprofile" element={<User />} />
        </Route>
        <Route path="/" element={<GeneralUserLayout />}>
          <Route index element={<Home />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/cart/:id" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order/:id" element={<Order />} />
          <Route path="/success" element={<Success />} />
          <Route path="/cancel" element={<Cancel />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
