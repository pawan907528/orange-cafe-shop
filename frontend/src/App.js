import "./App.css";

import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

// ==========================
// PAGES
// ==========================

import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import ForgotPassword from "./components/ForgotPassword";
import PublicRoute from "./components/PublicRoute";

import Menu from "./components/Menu";
import Cart from "./components/Cart";
import Payment from "./components/Payment";
import Orders from "./components/Orders";
import Admin from "./components/Admin";

// ==========================
// NAVBAR
// ==========================

import Navbar from "./components/Navbar";

// ==========================
// PROTECTED ROUTES
// ==========================

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";


function App() {

  return (

    <BrowserRouter>

      {/* ==========================
          NAVBAR
      ========================== */}

      <Navbar />

      <Routes>

        {/* ==========================
            PUBLIC PAGES
        ========================== */}

        <Route
          path="/"
          element={<Home />}
        />

<Route
  path="/login"
  element={
    <PublicRoute>
      <Login />
    </PublicRoute>
  }
/>

<Route
  path="/register"
  element={
    <PublicRoute>
      <Register />
    </PublicRoute>
  }
/>

        {/* ==========================
            FORGOT PASSWORD
        ========================== */}

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        {/* ==========================
            NORMAL USER PAGES
        ========================== */}

        <Route
          path="/menu"
          element={
            <ProtectedRoute>
              <Menu />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />

        <Route
          path="/payment"
          element={
            <ProtectedRoute>
              <Payment />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />

        {/* ==========================
            ADMIN ONLY
        ========================== */}

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          }
        />

      </Routes>

    </BrowserRouter>

  );

}

export default App;