import { API_URL } from "../config";
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ForgotPassword.css";

export default function ForgotPassword() {

  const navigate = useNavigate();

  // ==========================
  // States
  // ==========================

  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");

  const [otp, setOtp] = useState("");

  const [newPassword, setNewPassword] = useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");


  // ==========================
  // Check Login
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
  // Send OTP
  // ==========================

  const sendOTP = async () => {

    setError("");
    setMessage("");

    if (!email.trim()) {

      setError(
        "Please enter your registered email."
      );

      return;

    }

    setLoading(true);

    try {

      const response = await axios.post(

        `${API_URL}/forgot-password`,

        {
          email: email.trim()
        }

      );

      setMessage(
        response.data.message
      );

      setStep(2);

    }

    catch (error) {

      if (error.response) {

        setError(
          error.response.data.message
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
  // Verify OTP
  // ==========================

  const verifyOTP = async () => {

    setError("");
    setMessage("");

    if (!otp.trim()) {

      setError(
        "Please enter the OTP."
      );

      return;

    }

    if (otp.length !== 6) {

      setError(
        "OTP must contain 6 digits."
      );

      return;

    }

    setLoading(true);

    try {

      const response = await axios.post(

        `${API_URL}/verify-otp`,

        {
          email: email.trim(),
          otp: otp.trim()
        }

      );

      setMessage(
        response.data.message
      );

      setStep(3);

    }

    catch (error) {

      if (error.response) {

        setError(
          error.response.data.message
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
  // Reset Password
  // ==========================

  const resetPassword = async () => {

    setError("");
    setMessage("");

    if (!newPassword || !confirmPassword) {

      setError(
        "Please enter both password fields."
      );

      return;

    }

    if (newPassword.length < 6) {

      setError(
        "Password must contain at least 6 characters."
      );

      return;

    }

    if (newPassword !== confirmPassword) {

      setError(
        "Passwords do not match."
      );

      return;

    }

    setLoading(true);

    try {

      const response = await axios.post(

        `${API_URL}/reset-password`,

        {
          email: email.trim(),
          otp: otp.trim(),
          new_password: newPassword
        }

      );

      setMessage(
        response.data.message
      );

      alert(
        "Password reset successfully!"
      );

      navigate("/login");

    }

    catch (error) {

      if (error.response) {

        setError(
          error.response.data.message
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

    <div className="forgot-page">

      {/* ==========================
          LEFT SIDE
      ========================== */}

      <div className="forgot-left">

        <div className="forgot-overlay">

          <h1>
            ☕ Orange Cafe Shop
          </h1>

          <h2>
            Password Recovery
          </h2>

          <p>
            Reset your password securely
            using email verification.
          </p>

          <div className="forgot-features">

            <div>
              🔐 Secure Verification
            </div>

            <div>
              📧 Email OTP
            </div>

            <div>
              ⏱️ OTP valid for 5 minutes
            </div>

            <div>
              ☕ Welcome back to Orange Cafe
            </div>

          </div>

        </div>

      </div>


      {/* ==========================
          RIGHT SIDE
      ========================== */}

      <div className="forgot-right">

        <div className="forgot-card">

          {/* ==========================
              HEADER
          ========================== */}

          <h2>
            🔐 Forgot Password?
          </h2>

          <p className="forgot-subtitle">

            {step === 1 &&
              "Enter your registered email"}

            {step === 2 &&
              "Enter the OTP sent to your email"}

            {step === 3 &&
              "Create your new password"}

          </p>


          {/* ==========================
              PROGRESS
          ========================== */}

          <div className="reset-progress">

            <div
              className={
                step >= 1
                  ? "progress-step active"
                  : "progress-step"
              }
            >
              1
            </div>

            <div className="progress-line"></div>

            <div
              className={
                step >= 2
                  ? "progress-step active"
                  : "progress-step"
              }
            >
              2
            </div>

            <div className="progress-line"></div>

            <div
              className={
                step >= 3
                  ? "progress-step active"
                  : "progress-step"
              }
            >
              3
            </div>

          </div>


          {/* ==========================
              MESSAGE
          ========================== */}

          {error && (

            <div className="error-box">

              ❌ {error}

            </div>

          )}


          {message && (

            <div className="success-box">

              ✅ {message}

            </div>

          )}


          {/* ==========================
              STEP 1
          ========================== */}

          {step === 1 && (

            <div className="reset-form">

              <label>
                📧 Email Address
              </label>

              <input

                type="email"

                placeholder="Enter your registered email"

                value={email}

                onChange={(e) =>
                  setEmail(e.target.value)
                }

              />

              <button

                className="reset-btn"

                onClick={sendOTP}

                disabled={loading}

              >

                {loading
                  ? "Sending OTP..."
                  : "📧 Send OTP"}

              </button>

            </div>

          )}


          {/* ==========================
              STEP 2
          ========================== */}

          {step === 2 && (

            <div className="reset-form">

              <label>
                🔢 Enter OTP
              </label>

              <input

                type="text"

                inputMode="numeric"

                maxLength="6"

                placeholder="Enter 6-digit OTP"

                value={otp}

                onChange={(e) =>
                  setOtp(
                    e.target.value.replace(
                      /\D/g,
                      ""
                    )
                  )
                }

              />

              <p className="otp-info">

                OTP sent to:

                <strong>
                  {" "}{email}
                </strong>

              </p>

              <button

                className="reset-btn"

                onClick={verifyOTP}

                disabled={loading}

              >

                {loading
                  ? "Verifying..."
                  : "✅ Verify OTP"}

              </button>

              <button

                className="back-btn"

                onClick={() => {

                  setStep(1);
                  setOtp("");
                  setError("");
                  setMessage("");

                }}

              >

                ← Change Email

              </button>

            </div>

          )}


          {/* ==========================
              STEP 3
          ========================== */}

          {step === 3 && (

            <div className="reset-form">

              <label>
                🔒 New Password
              </label>

              <input

                type="password"

                placeholder="Enter new password"

                value={newPassword}

                onChange={(e) =>
                  setNewPassword(
                    e.target.value
                  )
                }

              />


              <label>
                🔒 Confirm Password
              </label>

              <input

                type="password"

                placeholder="Confirm new password"

                value={confirmPassword}

                onChange={(e) =>
                  setConfirmPassword(
                    e.target.value
                  )
                }

              />

              <button

                className="reset-btn"

                onClick={resetPassword}

                disabled={loading}

              >

                {loading
                  ? "Resetting Password..."
                  : "🔐 Reset Password"}

              </button>

            </div>

          )}


          {/* ==========================
              LOGIN LINK
          ========================== */}

          <div className="back-login">

            <Link to="/login">

              ← Back to Login

            </Link>

          </div>

        </div>

      </div>

    </div>

  );

}
