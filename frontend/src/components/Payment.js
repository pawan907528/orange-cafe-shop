import { API_URL } from "../config";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import "./Payment.css";
import upiQR from "../images/upi-qr.png";


export default function Payment() {

    const navigate = useNavigate();


    // ==========================
    // Logged In User
    // ==========================

    const [user, setUser] = useState(null);


    // ==========================
    // Cart
    // ==========================

    const [cart, setCart] = useState([]);


    // ==========================
    // Payment Method
    // ==========================

    const [paymentMethod, setPaymentMethod] =
        useState("UPI");


    // ==========================
    // Card Details
    // ==========================

    const [cardNumber, setCardNumber] =
        useState("");

    const [cardName, setCardName] =
        useState("");

    const [expiry, setExpiry] =
        useState("");

    const [cvv, setCvv] =
        useState("");


    // ==========================
    // UI States
    // ==========================

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [showConfirmation, setShowConfirmation] =
        useState(false);

    const [orderConfirmed, setOrderConfirmed] =
        useState(false);

    const [orderId, setOrderId] =
        useState(null);

    const [earnedPoints, setEarnedPoints] =
        useState(0);


    // ==========================
    // Load User & Cart
    // ==========================

    useEffect(() => {

        try {

            const storedUser =
                JSON.parse(
                    localStorage.getItem("user")
                );

            if (!storedUser) {

                navigate("/login");

                return;
            }

            setUser(storedUser);


            const storedCart =
                JSON.parse(
                    localStorage.getItem("cart")
                ) || [];


            setCart(storedCart);

        } catch (err) {

            console.error(
                "USER/CART LOAD ERROR:",
                err
            );

            navigate("/login");

        }

    }, [navigate]);


    // ==========================
    // Order Calculations
    // ==========================

    const subtotal = cart.reduce(
        (total, item) =>
            total +
            (
                Number(item.price) *
                Number(item.quantity)
            ),
        0
    );


    const delivery =
        subtotal > 0 ? 50 : 0;


    const gst =
        Math.round(
            subtotal * 0.05
        );


    const grandTotal =
        subtotal +
        delivery +
        gst;


    // ==================================================
    // STEP 1
    // Validate Payment Details
    // ==================================================

    const handlePayment = () => {

        setError("");


        // ==========================
        // User Validation
        // ==========================

        if (!user) {

            setError(
                "Please login first."
            );

            return;
        }


        // ==========================
        // Email Validation
        // ==========================

        if (
            !user.email ||
            user.email.trim() === ""
        ) {

            setError(
                "Customer email is missing. Please login again."
            );

            return;
        }


        // ==========================
        // Cart Validation
        // ==========================

        if (cart.length === 0) {

            setError(
                "Your cart is empty."
            );

            return;
        }


        // ==========================
        // Card Validation
        // ==========================

        if (
            paymentMethod ===
            "Credit / Debit Card"
        ) {

            if (
                cardNumber.trim() === "" ||
                cardName.trim() === "" ||
                expiry.trim() === "" ||
                cvv.trim() === ""
            ) {

                setError(
                    "Please fill all card details."
                );

                return;
            }


            if (
                cardNumber.replace(
                    /\s/g,
                    ""
                ).length < 16
            ) {

                setError(
                    "Invalid Card Number."
                );

                return;
            }


            if (
                cvv.length < 3
            ) {

                setError(
                    "Invalid CVV."
                );

                return;
            }

        }


        // ==========================
        // Show Confirmation Popup
        // ==========================

        setShowConfirmation(true);

    };


    // ==================================================
    // STEP 2
    // Confirm Payment & Place Order
    // ==================================================

    const confirmPayment = async () => {

        setError("");

        setLoading(true);


        try {

            // ==========================
            // Double Check User
            // ==========================

            const storedUser =
                JSON.parse(
                    localStorage.getItem("user")
                );


            if (!storedUser) {

                setShowConfirmation(false);

                setError(
                    "Your login session has expired. Please login again."
                );

                navigate("/login");

                return;
            }


            // ==========================
            // Create Order Data
            // ==========================

            const orderData = {

                // IMPORTANT:
                // These values identify
                // which customer owns
                // this order.

                customer:
                    storedUser.name,

                email:
                    storedUser.email,

                items:
                    cart,

                payment:
                    paymentMethod,

                subtotal:
                    subtotal,

                delivery:
                    delivery,

                gst:
                    gst,

                total:
                    grandTotal

            };


            console.log(
                "ORDER DATA:",
                orderData
            );


            // ==========================
            // Send Order To Flask
            // ==========================

            const response =
                await axios.post(
                    `${API_URL}/place-order`,
                    orderData
                );


            console.log(
                "ORDER RESPONSE:",
                response.data
            );


            // ==========================
            // Reward Points
            // ==========================

            const points =
                response.data.earned_points || 0;


            setEarnedPoints(
                points
            );


            // ==========================
            // Generate Display Order ID
            // ==========================

            const generatedOrderId =
                "OC" +
                Date.now()
                    .toString()
                    .slice(-8);


            setOrderId(
                generatedOrderId
            );


            // ==========================
            // Close Confirmation Popup
            // ==========================

            setShowConfirmation(
                false
            );


            // ==========================
            // Show Success Screen
            // ==========================

            setOrderConfirmed(
                true
            );


            // ==========================
            // Clear Cart
            // ==========================

            localStorage.removeItem(
                "cart"
            );


            setCart([]);


        } catch (err) {

            console.error(
                "ORDER ERROR:",
                err
            );


            setShowConfirmation(
                false
            );


            if (err.response) {

                setError(
                    err.response.data.message ||
                    "Failed to place order."
                );

            } else {

                setError(
                    "Cannot connect to server."
                );

            }

        } finally {

            setLoading(false);

        }

    };


    // ==================================================
    // ORDER CONFIRMATION SCREEN
    // ==================================================

    if (orderConfirmed) {

        return (

            <div className="payment-page">

                <div className="payment-right confirmation-page">

                    <div className="payment-card order-success-card">


                        <div className="success-icon">
                            🎉
                        </div>


                        <h1>
                            Payment Successful!
                        </h1>


                        <p className="success-message">

                            Your order has been
                            placed successfully.

                        </p>


                        {/* ==========================
                            Confirmation Information
                        ========================== */}

                        <div className="confirmation-info">


                            <div className="confirmation-row">

                                <span>
                                    🧾 Order ID
                                </span>

                                <strong>
                                    {orderId}
                                </strong>

                            </div>


                            <div className="confirmation-row">

                                <span>
                                    👤 Customer
                                </span>

                                <strong>
                                    {user?.name}
                                </strong>

                            </div>


                            <div className="confirmation-row">

                                <span>
                                    📧 Email
                                </span>

                                <strong>
                                    {user?.email}
                                </strong>

                            </div>


                            <div className="confirmation-row">

                                <span>
                                    💳 Payment
                                </span>

                                <strong>
                                    {paymentMethod}
                                </strong>

                            </div>


                            <div className="confirmation-row">

                                <span>
                                    💰 Amount Paid
                                </span>

                                <strong>
                                    ₹{grandTotal}
                                </strong>

                            </div>


                            <div className="confirmation-row">

                                <span>
                                    ⭐ Reward Points
                                </span>

                                <strong>
                                    +{earnedPoints}
                                </strong>

                            </div>


                            <div className="confirmation-row">

                                <span>
                                    📦 Order Status
                                </span>

                                <strong>
                                    Confirmed
                                </strong>

                            </div>


                        </div>


                        {/* ==========================
                            Confirmation Buttons
                        ========================== */}

                        <div className="confirmation-buttons">


                            <button
                                className="orders-btn"
                                onClick={() =>
                                    navigate(
                                        "/orders"
                                    )
                                }
                            >

                                📋 View My Orders

                            </button>


                            <button
                                className="home-btn"
                                onClick={() =>
                                    navigate("/")
                                }
                            >

                                🏠 Back to Home

                            </button>


                        </div>


                    </div>

                </div>

            </div>

        );

    }


    // ==================================================
    // MAIN PAYMENT UI
    // ==================================================

    return (

        <div className="payment-page">


            {/* ==========================
                LEFT SIDE
            ========================== */}

            <div className="payment-left">


                <h1>
                    ☕ Orange Cafe
                </h1>


                <h2>
                    Secure Checkout
                </h2>


                <p>

                    Complete your payment securely
                    and enjoy freshly prepared coffee,
                    snacks, pizzas and desserts.

                </p>


                <div className="payment-features">


                    <div className="feature">
                        🚀 Fast Delivery
                    </div>


                    <div className="feature">
                        🔒 Secure Payment
                    </div>


                    <div className="feature">
                        ⭐ Premium Quality
                    </div>


                    <div className="feature">
                        ❤️ Made With Love
                    </div>


                </div>


            </div>


            {/* ==========================
                RIGHT SIDE
            ========================== */}

            <div className="payment-right">


                <div className="payment-card">


                    <h2>
                        Payment Details
                    </h2>


                    <p>
                        Confirm your order
                    </p>


                    {/* ==========================
                        Error
                    ========================== */}

                    {error && (

                        <div className="error-box">

                            {error}

                        </div>

                    )}


                    {/* ==========================
                        Customer Details
                    ========================== */}

                    <div className="customer-box">


                        <h3>
                            Customer Details
                        </h3>


                        <p>
                            👤 {user?.name}
                        </p>


                        <p>
                            📧 {user?.email}
                        </p>


                    </div>


                    {/* ==========================
                        Order Summary
                    ========================== */}

                    <div className="summary-box">


                        <h3>
                            Order Summary
                        </h3>


                        {cart.map(
                            (item) => (

                                <div
                                    key={item.id}
                                    className="summary-item"
                                >

                                    <span>

                                        {item.name}

                                        {" × "}

                                        {item.quantity}

                                    </span>


                                    <span>

                                        ₹
                                        {
                                            Number(
                                                item.price
                                            ) *
                                            Number(
                                                item.quantity
                                            )
                                        }

                                    </span>

                                </div>

                            )
                        )}


                        <hr />


                        <div className="summary-item">

                            <span>
                                Subtotal
                            </span>

                            <span>
                                ₹{subtotal}
                            </span>

                        </div>


                        <div className="summary-item">

                            <span>
                                Delivery
                            </span>

                            <span>
                                ₹{delivery}
                            </span>

                        </div>


                        <div className="summary-item">

                            <span>
                                GST (5%)
                            </span>

                            <span>
                                ₹{gst}
                            </span>

                        </div>


                        <hr />


                        <div className="grand-total">

                            <span>
                                Total
                            </span>

                            <span>
                                ₹{grandTotal}
                            </span>

                        </div>


                    </div>


                    {/* ==========================
                        Payment Method
                    ========================== */}

                    <div className="payment-method">


                        <h3>
                            Select Payment Method
                        </h3>


                        {/* UPI */}

                        <label className="payment-option">

                            <input
                                type="radio"
                                name="payment"
                                value="UPI"
                                checked={
                                    paymentMethod ===
                                    "UPI"
                                }
                                onChange={(e) =>
                                    setPaymentMethod(
                                        e.target.value
                                    )
                                }
                            />

                            📱 UPI Payment

                        </label>


                        {/* Card */}

                        <label className="payment-option">

                            <input
                                type="radio"
                                name="payment"
                                value="Credit / Debit Card"
                                checked={
                                    paymentMethod ===
                                    "Credit / Debit Card"
                                }
                                onChange={(e) =>
                                    setPaymentMethod(
                                        e.target.value
                                    )
                                }
                            />

                            💳 Credit / Debit Card

                        </label>


                        {/* Cash */}

                        <label className="payment-option">

                            <input
                                type="radio"
                                name="payment"
                                value="Cash On Delivery"
                                checked={
                                    paymentMethod ===
                                    "Cash On Delivery"
                                }
                                onChange={(e) =>
                                    setPaymentMethod(
                                        e.target.value
                                    )
                                }
                            />

                            💵 Cash On Delivery

                        </label>


                    </div>


                    {/* ==========================
                        UPI QR
                    ========================== */}

                    {paymentMethod === "UPI" && (

                        <div className="upi-box">


                            <h3>
                                Scan & Pay
                            </h3>


                            <img
                                src={upiQR}
                                alt="UPI QR Code"
                                className="upi-qr"
                            />


                            <p>

                                Scan this QR code using
                                Google Pay, PhonePe,
                                Paytm or any UPI App.

                            </p>


                        </div>

                    )}


                    {/* ==========================
                        Card Details
                    ========================== */}

                    {paymentMethod ===
                        "Credit / Debit Card" && (

                        <div className="card-box">


                            <input
                                type="text"
                                placeholder="Card Holder Name"
                                value={cardName}
                                onChange={(e) =>
                                    setCardName(
                                        e.target.value
                                    )
                                }
                            />


                            <input
                                type="text"
                                placeholder="Card Number"
                                maxLength="16"
                                value={cardNumber}
                                onChange={(e) =>
                                    setCardNumber(
                                        e.target.value.replace(
                                            /\D/g,
                                            ""
                                        )
                                    )
                                }
                            />


                            <div className="card-row">


                                <input
                                    type="text"
                                    placeholder="MM/YY"
                                    maxLength="5"
                                    value={expiry}
                                    onChange={(e) =>
                                        setExpiry(
                                            e.target.value
                                        )
                                    }
                                />


                                <input
                                    type="password"
                                    placeholder="CVV"
                                    maxLength="3"
                                    value={cvv}
                                    onChange={(e) =>
                                        setCvv(
                                            e.target.value.replace(
                                                /\D/g,
                                                ""
                                            )
                                        )
                                    }
                                />


                            </div>


                        </div>

                    )}


                    {/* ==========================
                        Cash On Delivery
                    ========================== */}

                    {paymentMethod ===
                        "Cash On Delivery" && (

                        <div className="cod-box">


                            <h3>
                                Cash On Delivery
                            </h3>


                            <p>

                                💵 Pay when your order
                                is delivered.

                            </p>


                        </div>

                    )}


                    {/* ==========================
                        Payment Icons
                    ========================== */}

                    <div className="payment-icons">

                        <span>
                            💳
                        </span>

                        <span>
                            📱
                        </span>

                        <span>
                            🏦
                        </span>

                        <span>
                            💰
                        </span>

                    </div>


                    {/* ==========================
                        Pay Button
                    ========================== */}

                    <button
                        className="pay-btn"
                        onClick={handlePayment}
                        disabled={
                            loading ||
                            cart.length === 0
                        }
                    >

                        {loading
                            ? "Processing Payment..."
                            : `Pay ₹${grandTotal}`}

                    </button>


                </div>


            </div>


            {/* ==================================================
                PAYMENT CONFIRMATION MODAL
            ================================================== */}

            {showConfirmation && (

                <div className="payment-modal-overlay">


                    <div className="payment-confirm-modal">


                        <div className="modal-icon">
                            🔒
                        </div>


                        <h2>
                            Confirm Payment
                        </h2>


                        <p>

                            Please confirm your
                            payment details before
                            placing the order.

                        </p>


                        <div className="modal-details">


                            <div>

                                <span>
                                    Payment Method
                                </span>

                                <strong>
                                    {paymentMethod}
                                </strong>

                            </div>


                            <div>

                                <span>
                                    Customer
                                </span>

                                <strong>
                                    {user?.name}
                                </strong>

                            </div>


                            <div>

                                <span>
                                    Email
                                </span>

                                <strong>
                                    {user?.email}
                                </strong>

                            </div>


                            <div>

                                <span>
                                    Total Amount
                                </span>

                                <strong>
                                    ₹{grandTotal}
                                </strong>

                            </div>


                        </div>


                        <p className="confirm-question">

                            Are you sure you want
                            to confirm this payment?

                        </p>


                        <div className="modal-buttons">


                            <button
                                className="cancel-payment-btn"
                                onClick={() =>
                                    setShowConfirmation(
                                        false
                                    )
                                }
                                disabled={loading}
                            >

                                ❌ Cancel

                            </button>


                            <button
                                className="confirm-payment-btn"
                                onClick={
                                    confirmPayment
                                }
                                disabled={loading}
                            >

                                {loading
                                    ? "Processing..."
                                    : "✅ Confirm & Pay"}

                            </button>


                        </div>


                    </div>


                </div>

            )}


        </div>

    );

}
