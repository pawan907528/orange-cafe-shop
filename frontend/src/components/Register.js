import { API_URL } from "../config";
import { useState } from "react";
import {
  Link,
  useNavigate,
  Navigate
} from "react-router-dom";

import axios from "axios";
import "./Register.css";

export default function Register() {
  const navigate = useNavigate();

  // ==========================
  // STATES
  // ==========================

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ==========================
  // CHECK EXISTING LOGIN
  // ==========================

  const existingUser = JSON.parse(
    localStorage.getItem("user")
  );

  if (existingUser) {
    return (
      <Navigate
        to="/menu"
        replace
      />
    );
  }

  // ==========================
  // REGISTER FUNCTION
  // ==========================

  const registerUser = async () => {
    setError("");

    // ==========================
    // EMPTY FIELD CHECK
    // ==========================

    if (
      name.trim() === "" ||
      email.trim() === "" ||
      password.trim() === "" ||
      confirmPassword.trim() === ""
    ) {
      setError("Please fill all fields.");
      return;
    }

    // ==========================
    // PASSWORD MATCH
    // ==========================

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // ==========================
    // PASSWORD LENGTH
    // ==========================

    if (password.length < 6) {
      setError(
        "Password must contain at least 6 characters."
      );
      return;
    }

    setLoading(true);

    try {
      // ==========================
      // LOCAL FLASK BACKEND
      // ==========================

      const response = await axios.post(
        `${API_URL}/register`,
        {
          name: name.trim(),
          email: email.trim(),
          password: password
        }
      );

      // ==========================
      // SUCCESS
      // ==========================

      alert(
        response.data.message ||
        "Registration Successful"
      );

      // ==========================
      // GO TO LOGIN
      // ==========================

      navigate("/login");

    } catch (error) {
      console.error(
        "Registration Error:",
        error
      );

      if (error.response) {
        setError(
          error.response.data.message ||
          "Registration failed."
        );
      } else {
        setError(
          "Server not responding."
        );
      }

    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // UI
  // ==========================

  return (
    <div className="register-page">

      {/* ==========================
          LEFT SIDE
      ========================== */}

      <div className="register-left">

        <div className="overlay">

          <h1>
            ☕ Orange Cafe Shop
          </h1>

          <h2>
            Join Orange Cafe!
          </h2>

          <p>
            Create your account and enjoy
            delicious food.
          </p>

          <div className="feature-list">

            <div className="feature-item">
              ☕ Premium Coffee
            </div>

            <div className="feature-item">
              🍕 Delicious Food
            </div>

            <div className="feature-item">
              🎁 Reward Points
            </div>

            <div className="feature-item">
              🚚 Fast Delivery
            </div>

            <div className="feature-item">
              ⭐ Exclusive Offers
            </div>

          </div>

        </div>

      </div>

      {/* ==========================
          RIGHT SIDE
      ========================== */}

      <div className="register-right">

        <div className="register-card">

          <h2>
            Create Account
          </h2>

          <p className="subtitle">
            Join Orange Cafe today
          </p>

          {/* ERROR */}

          {error && (
            <div className="error-box">
              {error}
            </div>
          )}

          {/* NAME */}

          <input
            type="text"
            placeholder="👤 Full Name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
          />

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

          {/* CONFIRM PASSWORD */}

          <input
            type="password"
            placeholder="🔒 Confirm Password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(
                e.target.value
              )
            }
          />

          {/* REGISTER BUTTON */}

          <button
            className="register-btn"
            onClick={registerUser}
            disabled={loading}
          >
            {loading
              ? "Creating Account..."
              : "🚀 Create Account"}
          </button>

          {/* LOGIN */}

          <div className="login-section">

            <p>
              Already have an account?
            </p>

            <Link to="/login">
              Login
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}