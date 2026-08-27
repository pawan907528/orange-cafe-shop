import { useEffect, useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import "./Orders.css";

export default function Orders() {

  // ==========================
  // States
  // ==========================

  const [orders, setOrders] = useState([]);

  // ==========================
  // Load Orders
  // ==========================

  useEffect(() => {
    fetchOrders();
  }, []);

  // ==========================
  // Fetch Only Logged-in
  // User's Orders
  // ==========================

  const fetchOrders = async () => {

    try {

      // Get logged-in user
      const storedUser =
        localStorage.getItem("user");

      if (!storedUser) {

        setOrders([]);

        alert(
          "Please login to view your orders."
        );

        return;
      }

      // Convert stored user data
      const user =
        JSON.parse(storedUser);

      if (!user || !user.email) {

        setOrders([]);

        alert(
          "User email not found. Please login again."
        );

        return;
      }

      // Logged-in user's email
      const userEmail =
        String(user.email)
          .trim()
          .toLowerCase();

      // ==========================
      // Get orders from backend
      // ==========================

      const response =
        await axios.get(
          `http://127.0.0.1:5000/orders?email=${encodeURIComponent(
            userEmail
          )}`
        );

      // ==========================
      // Safety Filter
      // ==========================

      const allOrders =
        Array.isArray(response.data)
          ? response.data
          : [];

      const userOrders =
        allOrders.filter((order) => {

          const orderEmail =
            String(order.email || "")
              .trim()
              .toLowerCase();

          return (
            orderEmail === userEmail
          );

        });

      setOrders(userOrders);

    } catch (error) {

      console.error(
        "Orders Error:",
        error
      );

      setOrders([]);

      alert(
        "Unable to load your orders."
      );

    }

  };


  // ==========================
  // Download Invoice
  // ==========================

  const downloadInvoice = (order) => {

    const doc = new jsPDF();

    let y = 20;

    // =========================
    // Header
    // =========================

    doc.setFillColor(
      255,
      102,
      0
    );

    doc.rect(
      0,
      0,
      210,
      30,
      "F"
    );

    doc.setTextColor(255);

    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.setFontSize(24);

    doc.text(
      "Orange Cafe Shop",
      20,
      18
    );

    doc.setFontSize(11);

    doc.text(
      "Premium Cafe & Restaurant",
      20,
      25
    );

    y = 40;


    // =========================
    // Cafe Details
    // =========================

    doc.setTextColor(0);

    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.setFontSize(11);

    doc.text(
      "Near XYZ College, Mumbai",
      20,
      y
    );

    y += 6;

    doc.text(
      "Phone : +91 9876543210",
      20,
      y
    );

    y += 6;

    doc.text(
      "Email : orangecafe@gmail.com",
      20,
      y
    );

    y += 10;

    doc.setDrawColor(
      255,
      102,
      0
    );

    doc.line(
      20,
      y,
      190,
      y
    );

    y += 10;


    // =========================
    // Invoice Details
    // =========================

    doc.roundedRect(
      20,
      y,
      170,
      30,
      3,
      3
    );

    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.text(
      `Invoice No : ${order.id}`,
      25,
      y + 8
    );

    doc.text(
      `Payment : ${order.payment || "-"}`,
      110,
      y + 8
    );

    doc.text(
      `Status : ${
        order.status || "Confirmed"
      }`,
      110,
      y + 18
    );

    doc.text(
      `Date : ${
        order.date ||
        new Date().toLocaleDateString()
      }`,
      25,
      y + 18
    );

    y += 40;


    // =========================
    // Customer
    // =========================

    doc.setFillColor(
      245,
      245,
      245
    );

    doc.rect(
      20,
      y,
      170,
      25,
      "F"
    );

    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.setFontSize(12);

    doc.text(
      "Customer Details",
      25,
      y + 8
    );

    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.text(
      `Name : ${
        order.customer || "Guest"
      }`,
      25,
      y + 18
    );

    doc.text(
      `Email : ${
        order.email || "-"
      }`,
      110,
      y + 18
    );

    y += 35;


    // =========================
    // Total
    // =========================

    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.rect(
      120,
      y,
      70,
      12
    );

    doc.text(
      `Grand Total : ₹${order.total}`,
      125,
      y + 8
    );

    y += 25;


    // =========================
    // Signature
    // =========================

    doc.line(
      130,
      y,
      185,
      y
    );

    y += 8;

    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.setFontSize(10);

    doc.text(
      "Authorized Signature",
      135,
      y
    );

    y += 15;


    // =========================
    // Footer
    // =========================

    doc.setDrawColor(
      255,
      102,
      0
    );

    doc.line(
      20,
      y,
      190,
      y
    );

    y += 10;

    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.setFontSize(12);

    doc.setTextColor(
      0,
      150,
      0
    );

    doc.text(
      "Thank You For Visiting Orange Cafe Shop ❤️",
      20,
      y
    );

    y += 8;

    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.setFontSize(10);

    doc.setTextColor(120);

    doc.text(
      "Visit Again • Orange Cafe Shop",
      20,
      y
    );

    doc.save(
      `Invoice-${order.id}.pdf`
    );

  };


  // ==========================
  // Print Bill
  // ==========================

  const printBill = () => {

    window.print();

  };


  // ==========================
  // UI
  // ==========================

  return (

    <div className="orders-container">

      <h1>
        📦 My Orders
      </h1>

      {orders.length === 0 ? (

        <p>
          No Orders Found
        </p>

      ) : (

        orders.map((order) => (

          <div
            className="order-card"
            key={order.id}
          >

            <h3>
              Order ID : {order.id}
            </h3>


            <p>

              <b>
                Customer :
              </b>{" "}

              {order.customer ||
                "Guest"}

            </p>


            <p>

              <b>
                Email :
              </b>{" "}

              {order.email ||
                "-"}

            </p>


            <p>

              <b>
                Payment :
              </b>{" "}

              {order.payment ||
                "-"}

            </p>


            <p>

              <b>
                Total :
              </b>

              ₹{order.total}

            </p>


            <p>

              <b>
                Date :
              </b>{" "}

              {order.date ||
                new Date().toLocaleDateString()}

            </p>


            <p>

              <b>
                Status :
              </b>{" "}


              <span
                className={
                  order.status ===
                  "Confirmed"

                    ? "status confirmed"

                    : order.status ===
                      "Preparing"

                    ? "status preparing"

                    : order.status ===
                      "Out for Delivery"

                    ? "status delivery"

                    : "status delivered"
                }
              >

                {order.status ||
                  "Confirmed"}

              </span>

            </p>


            {/* ==========================
                Order Timeline
            ========================== */}

            <div className="timeline">


              <div className="step active">

                ✔ Ordered

              </div>


              <div className="line"></div>


              <div
                className={
                  order.status ===
                    "Preparing" ||

                  order.status ===
                    "Out for Delivery" ||

                  order.status ===
                    "Delivered"

                    ? "step active"

                    : "step"
                }
              >

                🍳 Preparing

              </div>


              <div className="line"></div>


              <div
                className={
                  order.status ===
                    "Out for Delivery" ||

                  order.status ===
                    "Delivered"

                    ? "step active"

                    : "step"
                }
              >

                🚚 Out for Delivery

              </div>


              <div className="line"></div>


              <div
                className={
                  order.status ===
                  "Delivered"

                    ? "step active"

                    : "step"
                }
              >

                📦 Delivered

              </div>


            </div>


            {/* ==========================
                Action Buttons
            ========================== */}

            <div className="invoice-buttons">


              <button
                className="invoice-btn"
                onClick={() =>
                  downloadInvoice(order)
                }
              >

                📄 Download Invoice

              </button>


              <button
                className="print-btn"
                onClick={
                  printBill
                }
              >

                🖨 Print Bill

              </button>


            </div>


          </div>

        ))

      )}

    </div>

  );

}