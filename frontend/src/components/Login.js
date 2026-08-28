import { useState } from "react";
import {
  Link,
  useNavigate,
  Navigate
} from "react-router-dom";

import axios from "axios";
import "./Login.css";

export default function Login() {

  const navigate = useNavigate();

  // ==========================
  // STATES
  // ==========================

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  // ==========================
  // CHECK EXISTING LOGIN
  // ==========================

  const existingUser =
    JSON.parse(
      localStorage.getItem("user")
    );

  // If already logged in,
  // redirect to menu

  if (existingUser) {

    return (
      <Navigate
        to="/menu"
        replace
      />
    );

  }

  // ==========================
  // LOGIN FUNCTION
  // ==========================

  const loginUser = async () => {

    setError("");

    // Check empty fields

    if (
      email.trim() === "" ||
      password.trim() === ""
    ) {

      setError(
        "Please enter Email and Password."
      );

      return;
    }

    setLoading(true);

    try {

      const response = await axios.post(

        "https://orange-cafe-shop.onrender.com/login",

        {
          email: email.trim(),
          password: password
        }

      );

      // ==========================
      // SAVE USER
      // ==========================

      localStorage.setItem(

        "user",

        JSON.stringify(
          response.data
        )

      );

      // ==========================
      // SUCCESS MESSAGE
      // ==========================

      alert(
        `Welcome ${response.data.name}!`
      );

      // ==========================
      // REDIRECT
      // ==========================

      navigate("/menu");

      /*
        Reload so Navbar immediately
        detects the logged-in user.
      */

      window.location.reload();

    }

    catch (error) {

      console.error(
        "Login Error:",
        error
      );

      if (error.response) {

        setError(

          error.response.data.message ||
          "Invalid Email or Password."

        );

      }

      else {

        setError(
          "Server not responding."
        );

      }

    }

    finally {

      setLoading(false);

    }

  };

  // ==========================
  // UI
  // ==========================

  return (

    <div className="login-page">

      {/* ==========================
          LEFT SIDE
      ========================== */}

      <div className="login-left">

        <div className="overlay">

          <h1>
            ☕ Orange Cafe Shop
          </h1>

          <h2>
            Welcome Back!
          </h2>

          <p>
            Fresh Coffee • Delicious Snacks •
            Fast Delivery
          </p>

          <div className="feature-list">

            <div className="feature-item">
              ☕ Premium Coffee
            </div>

            <div className="feature-item">
              🍕 Fresh Snacks
            </div>

            <div className="feature-item">
              🚚 Fast Delivery
            </div>

            <div className="feature-item">
              ⭐ Trusted by 500+ Customers
            </div>

            <div className="feature-item">
              🔒 Secure Login
            </div>

          </div>

        </div>

      </div>

      {/* ==========================
          RIGHT SIDE
      ========================== */}

      <div className="login-right">

        <div className="login-card">

          <h2>
            Login
          </h2>

          <p className="subtitle">
            Sign in to continue
          </p>

          {/* ERROR */}

          {error && (

            <div className="error-box">

              {error}

            </div>

          )}

          {/* EMAIL */}

          <input

            type="email"

            placeholder="📧 Email Address"

            value={email}

            onChange={(e) =>
              setEmail(e.target.value)
            }

          />

          {/* PASSWORD */}

          <div className="password-box">

            <input

              type={
                showPassword
                  ? "text"
                  : "password"
              }

              placeholder="🔒 Password"

              value={password}

              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }

            />

            <button

              type="button"

              className="show-btn"

              onClick={() =>
                setShowPassword(
                  !showPassword
                )
              }

            >

              {showPassword
                ? "🙈"
                : "👁"}

            </button>

          </div>

          {/* FORGOT PASSWORD */}

          <div className="forgot-password">

            <Link to="/forgot-password">

              Forgot Password?

            </Link>

          </div>

          {/* LOGIN BUTTON */}

          <button

            className="login-btn"

            onClick={loginUser}

            disabled={loading}

          >

            {loading
              ? "Signing In..."
              : "🚀 Login"}

          </button>

          {/* DIVIDER */}

          <div className="divider">

            <span>
              OR
            </span>

          </div>

          {/* GOOGLE */}

          <button className="google-btn">

            🔵 Continue with Google

          </button>

          {/* REGISTER */}

          <div className="register-section">

            <p>
              Don't have an account?
            </p>

            <Link to="/register">

              Create Account

            </Link>

          </div>

        </div>

      </div>

    </div>

  );

}
