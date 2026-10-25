import { API_URL } from "../config";
import { useEffect, useState } from "react";
import axios from "axios";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

import {
  Bar,
  Doughnut,
  Line
} from "react-chartjs-2";

import "./Admin.css";


// ==========================================================
// CHART.JS REGISTRATION
// ==========================================================

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);


// ==========================================================
// ADMIN COMPONENT
// ==========================================================

export default function Admin() {

  // ========================================================
  // ORDERS
  // ========================================================

  const [orders, setOrders] = useState([]);


  // ========================================================
  // MENU ITEMS
  // ========================================================

  const [menuItems, setMenuItems] = useState([]);


  // ========================================================
  // MENU FORM
  // ========================================================

  const [itemName, setItemName] = useState("");

  const [itemPrice, setItemPrice] = useState("");

  const [itemCategory, setItemCategory] =
    useState("Coffee");


  // ========================================================
  // EDIT MENU
  // ========================================================

  const [editId, setEditId] = useState(null);


  // ========================================================
  // SEARCH
  // ========================================================

  const [search, setSearch] = useState("");


  // ========================================================
  // ORDER FILTER
  // ========================================================

  const [orderFilter, setOrderFilter] =
    useState("All");


  // ========================================================
  // MENU FILTER
  // ========================================================

  const [menuFilter, setMenuFilter] =
    useState("All");


  // ========================================================
  // LOADING
  // ========================================================

  const [loading, setLoading] = useState(false);


  // ========================================================
  // MESSAGE
  // ========================================================

  const [message, setMessage] = useState("");


  // ========================================================
  // LOAD DATA
  // ========================================================

  useEffect(() => {

    const loadData = async () => {

      try {

        setLoading(true);


        // ==================================================
        // GET ORDERS
        // ==================================================

        const ordersResponse = await axios.get(
          `${API_URL}/orders`
        );


        // ==================================================
        // GET MENU
        // ==================================================

        const menuResponse = await axios.get(
          `${API_URL}/menu`
        );


        // ==================================================
        // CHECK ORDERS
        // ==================================================

        const backendOrders =
          Array.isArray(ordersResponse.data)
            ? ordersResponse.data
            : [];


        // ==================================================
        // CHECK MENU
        // ==================================================

        const backendMenu =
          Array.isArray(menuResponse.data)
            ? menuResponse.data
            : [];


        // ==================================================
        // SAVE DATA
        // ==================================================

        setOrders(backendOrders);

        setMenuItems(backendMenu);


        // ==================================================
        // DEBUG
        // ==================================================

        console.log(
          "ADMIN ORDERS:",
          backendOrders
        );

        console.log(
          "ADMIN MENU:",
          backendMenu
        );


      } catch (error) {

        console.error(
          "ADMIN DASHBOARD ERROR:",
          error
        );


        setOrders([]);

        setMenuItems([]);


        setMessage(
          "Unable to load dashboard data."
        );


      } finally {

        setLoading(false);

      }

    };


    loadData();

  }, []);


  // ========================================================
  // CLEAR MESSAGE
  // ========================================================

  useEffect(() => {

    if (!message) {
      return;
    }


    const timer = setTimeout(() => {

      setMessage("");

    }, 3000);


    return () => clearTimeout(timer);

  }, [message]);


  // ========================================================
  // DASHBOARD STATISTICS
  // ========================================================

  const totalOrders =
    orders.length;


  const totalCustomers =
    new Set(
      orders.map(
        (order) =>
          order.customer || "Guest"
      )
    ).size;


  const totalRevenue =
    orders.reduce(
      (sum, order) =>
        sum +
        Number(order.total || 0),
      0
    );


  const totalMenuItems =
    menuItems.length;


  const preparingOrders =
    orders.filter(
      (order) =>
        order.status === "Preparing"
    ).length;


  const deliveredOrders =
    orders.filter(
      (order) =>
        order.status === "Delivered"
    ).length;


  const outForDeliveryOrders =
    orders.filter(
      (order) =>
        order.status === "Out for Delivery"
    ).length;


  const confirmedOrders =
    orders.filter(
      (order) =>
        (order.status || "Confirmed") ===
        "Confirmed"
    ).length;


  const averageOrderValue =
    totalOrders > 0
      ? Math.round(
          totalRevenue /
          totalOrders
        )
      : 0;


  // ========================================================
  // FILTER MENU ITEMS
  // ========================================================

  const filteredMenu =
    menuItems.filter((item) => {

      const matchesSearch =
        (item.name || "")
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );


      const matchesCategory =
        menuFilter === "All" ||
        item.category === menuFilter;


      return (
        matchesSearch &&
        matchesCategory
      );

    });


  // ========================================================
  // FILTER ORDERS
  // ========================================================

  const filteredOrders =
    orders.filter((order) => {

      if (orderFilter === "All") {
        return true;
      }


      return (
        (order.status || "Confirmed") ===
        orderFilter
      );

    });


  // ========================================================
  // REFRESH DASHBOARD
  // ========================================================

  const refreshDashboard = async () => {

    try {

      setLoading(true);


      await Promise.all([
        fetchMenu(),
        fetchOrders()
      ]);


      setMessage(
        "✅ Dashboard refreshed successfully!"
      );


    } catch (error) {

      console.error(
        "REFRESH ERROR:",
        error
      );


      setMessage(
        "❌ Unable to refresh dashboard."
      );


    } finally {

      setLoading(false);

    }

  };


  // ========================================================
  // FETCH MENU
  // ========================================================

  const fetchMenu = async () => {

    try {

      const response =
        await axios.get(
          `${API_URL}/menu`
        );


      const data =
        Array.isArray(response.data)
          ? response.data
          : [];


      setMenuItems(data);


      console.log(
        "MENU FETCHED:",
        data
      );


      return data;


    } catch (error) {

      console.error(
        "MENU FETCH ERROR:",
        error
      );


      setMenuItems([]);


      throw error;

    }

  };


  // ========================================================
  // FETCH ORDERS
  // ========================================================

  const fetchOrders = async () => {

    try {

      const response =
        await axios.get(
          `${API_URL}/orders`
        );


      const data =
        Array.isArray(response.data)
          ? response.data
          : [];


      setOrders(data);


      console.log(
        "ORDERS FETCHED:",
        data
      );


      return data;


    } catch (error) {

      console.error(
        "ORDERS FETCH ERROR:",
        error
      );


      setOrders([]);


      throw error;

    }

  };
    // ========================================================
  // ADD MENU ITEM
  // ========================================================

  const addMenuItem = async () => {

    try {

      // ------------------------------
      // Validation
      // ------------------------------

      if (!itemName.trim()) {

        setMessage(
          "⚠️ Please enter menu item name."
        );

        return;

      }


      if (
        itemPrice === "" ||
        Number(itemPrice) <= 0
      ) {

        setMessage(
          "⚠️ Please enter a valid price."
        );

        return;

      }


      // ------------------------------
      // Send to Flask
      // ------------------------------

      await axios.post(
        `${API_URL}/menu`,
        {
          name: itemName.trim(),
          category: itemCategory,
          price: Number(itemPrice)
        }
      );


      // ------------------------------
      // Clear form
      // ------------------------------

      setItemName("");

      setItemPrice("");

      setItemCategory("Coffee");

      setEditId(null);


      // ------------------------------
      // Reload menu
      // ------------------------------

      await fetchMenu();


      setMessage(
        "✅ Menu item added successfully!"
      );


    } catch (error) {

      console.error(
        "ADD MENU ERROR:",
        error
      );


      setMessage(
        "❌ Unable to add menu item."
      );

    }

  };


  // ========================================================
  // EDIT MENU ITEM
  // ========================================================

  const editMenuItem = (item) => {

    setEditId(item.id);

    setItemName(
      item.name || ""
    );

    setItemPrice(
      item.price || ""
    );

    setItemCategory(
      item.category || "Coffee"
    );


    // Scroll to menu form

    setTimeout(() => {

      const form =
        document.getElementById(
          "menu-form"
        );


      if (form) {

        form.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });

      }

    }, 100);

  };


  // ========================================================
  // UPDATE MENU ITEM
  // ========================================================

  const updateMenuItem = async () => {

    try {

      // ------------------------------
      // Validation
      // ------------------------------

      if (!editId) {

        setMessage(
          "⚠️ No menu item selected."
        );

        return;

      }


      if (!itemName.trim()) {

        setMessage(
          "⚠️ Please enter menu item name."
        );

        return;

      }


      if (
        itemPrice === "" ||
        Number(itemPrice) <= 0
      ) {

        setMessage(
          "⚠️ Please enter a valid price."
        );

        return;

      }


      // ------------------------------
      // Update Flask database
      // ------------------------------

      await axios.put(

        `${API_URL}/menu/${editId}`,

        {
          name: itemName.trim(),
          category: itemCategory,
          price: Number(itemPrice)
        }

      );


      // ------------------------------
      // Clear form
      // ------------------------------

      setEditId(null);

      setItemName("");

      setItemPrice("");

      setItemCategory("Coffee");


      // ------------------------------
      // Reload menu
      // ------------------------------

      await fetchMenu();


      setMessage(
        "✅ Menu item updated successfully!"
      );


    } catch (error) {

      console.error(
        "UPDATE MENU ERROR:",
        error
      );


      setMessage(
        "❌ Unable to update menu item."
      );

    }

  };


  // ========================================================
  // CANCEL EDIT
  // ========================================================

  // eslint-disable-next-line no-unused-vars
  const cancelEdit = () => {

    setEditId(null);

    setItemName("");

    setItemPrice("");

    setItemCategory("Coffee");


    setMessage(
      "ℹ️ Edit cancelled."
    );

  };


  // ========================================================
  // DELETE MENU ITEM
  // ========================================================

  const deleteMenuItem = async (itemId) => {

    try {

      // ------------------------------
      // Confirmation
      // ------------------------------

      const confirmed =
        window.confirm(
          "Are you sure you want to delete this menu item?"
        );


      if (!confirmed) {

        return;

      }


      // ------------------------------
      // Delete from Flask
      // ------------------------------

      await axios.delete(

        `${API_URL}/menu/${itemId}`

      );


      // ------------------------------
      // Reload menu
      // ------------------------------

      await fetchMenu();


      setMessage(
        "🗑️ Menu item deleted successfully!"
      );


    } catch (error) {

      console.error(
        "DELETE MENU ERROR:",
        error
      );


      setMessage(
        "❌ Unable to delete menu item."
      );

    }

  };


  // ========================================================
  // UPDATE ORDER STATUS
  // ========================================================

  const updateOrderStatus = async (
    orderId,
    newStatus
  ) => {

    try {

      // ------------------------------
      // Validate
      // ------------------------------

      if (!orderId) {

        setMessage(
          "⚠️ Invalid order ID."
        );

        return;

      }


      if (!newStatus) {

        setMessage(
          "⚠️ Please select an order status."
        );

        return;

      }


      console.log(
        "Updating order:",
        orderId,
        "Status:",
        newStatus
      );


      // ==================================================
      // IMPORTANT
      // ==================================================
      // Flask app.py uses:
      //
      // PUT /orders/<order_id>
      //
      // NOT:
      //
      // PUT /orders/<order_id>/status
      // ==================================================

      const response =
        await axios.put(

          `${API_URL}/orders/${orderId}`,

          {
            status: newStatus
          }

        );


      console.log(
        "STATUS UPDATE RESPONSE:",
        response.data
      );


      // ------------------------------
      // Update UI immediately
      // ------------------------------

      setOrders((previousOrders) =>

        previousOrders.map((order) => {

          if (
            Number(order.id) ===
            Number(orderId)
          ) {

            return {
              ...order,
              status: newStatus
            };

          }

          return order;

        })

      );


      setMessage(
        `✅ Order #${orderId} status changed to ${newStatus}.`
      );


      // ------------------------------
      // Reload from database
      // ------------------------------

      await fetchOrders();


    } catch (error) {

      console.error(
        "ORDER STATUS ERROR:",
        error
      );


      // ------------------------------
      // Show backend error
      // ------------------------------

      if (
        error.response &&
        error.response.data
      ) {

        console.error(
          "BACKEND ERROR:",
          error.response.data
        );

      }


      setMessage(
        "❌ Unable to update order status."
      );

    }

  };


  // ========================================================
  // HANDLE STATUS CHANGE
  // ========================================================

  const handleStatusChange = (
    orderId,
    event
  ) => {

    const newStatus =
      event.target.value;


    if (!newStatus) {

      return;

    }


    updateOrderStatus(
      orderId,
      newStatus
    );

  };


  // ========================================================
  // ORDER STATUS COLOR
  // ========================================================

  const getStatusClass = (status) => {

    switch (status) {

      case "Confirmed":
        return "status-confirmed";

      case "Preparing":
        return "status-preparing";

      case "Out for Delivery":
        return "status-delivery";

      case "Delivered":
        return "status-delivered";

      default:
        return "status-confirmed";

    }

  };


  // ========================================================
  // ORDER STATUS ICON
  // ========================================================

  const getStatusIcon = (status) => {

    switch (status) {

      case "Confirmed":
        return "✅";

      case "Preparing":
        return "🍳";

      case "Out for Delivery":
        return "🚚";

      case "Delivered":
        return "📦";

      default:
        return "📋";

    }

  };


  // ========================================================
  // RESET MENU FORM
  // ========================================================

  const resetMenuForm = () => {

    setEditId(null);

    setItemName("");

    setItemPrice("");

    setItemCategory("Coffee");

  };


  // ========================================================
  // MENU CATEGORIES
  // ========================================================

  const menuCategories = [

    "All",
    "Coffee",
    "Tea",
    "Beverage",
    "Snacks",
    "Pizza",
    "Dessert"

  ];


  // ========================================================
  // ORDER STATUSES
  // ========================================================

  const orderStatuses = [

    "Confirmed",
    "Preparing",
    "Out for Delivery",
    "Delivered"

  ];
    // ========================================================
  // CHART DATA — REVENUE
  // ========================================================

  const revenueChartData = {

    labels: orders
      .slice()
      .reverse()
      .map(
        (order) =>
          `Order #${order.id}`
      ),

    datasets: [

      {
        label: "Revenue (₹)",

        data: orders
          .slice()
          .reverse()
          .map(
            (order) =>
              Number(order.total || 0)
          ),

        backgroundColor: [
          "#ff6b35",
          "#ff8c42",
          "#ffb347",
          "#ff7043",
          "#ff5722",
          "#ff9800",
          "#ffca28",
          "#f4511e"
        ],

        borderColor: "#ffffff",

        borderWidth: 2,

        borderRadius: 10,

        borderSkipped: false,

        hoverBorderWidth: 3,

        hoverBorderColor: "#ffffff"

      }

    ]

  };


  // ========================================================
  // REVENUE CHART OPTIONS
  // ========================================================

  const revenueChartOptions = {

    responsive: true,

    maintainAspectRatio: false,

    animation: {

      duration: 1200,

      easing: "easeOutQuart"

    },

    plugins: {

      legend: {

        display: true,

        position: "top",

        labels: {

          usePointStyle: true,

          pointStyle: "circle",

          padding: 20,

          font: {

            size: 13,

            weight: "600"

          }

        }

      },

      title: {

        display: true,

        text: "💰 Revenue by Order",

        font: {

          size: 18,

          weight: "bold"

        },

        padding: {

          bottom: 20

        }

      },

      tooltip: {

        backgroundColor:
          "rgba(25, 25, 25, 0.95)",

        titleColor: "#ffffff",

        bodyColor: "#ffffff",

        padding: 14,

        cornerRadius: 10,

        displayColors: true,

        callbacks: {

          label: function(context) {

            return ` Revenue: ₹${Number(
              context.raw || 0
            ).toLocaleString("en-IN")}`;

          }

        }

      }

    },

    scales: {

      x: {

        grid: {

          display: false

        },

        ticks: {

          font: {

            size: 11

          }

        }

      },

      y: {

        beginAtZero: true,

        grid: {

          color:
            "rgba(0,0,0,0.07)"

        },

        ticks: {

          callback: function(value) {

            return "₹" +
              Number(value)
                .toLocaleString("en-IN");

          },

          font: {

            size: 11

          }

        }

      }

    }

  };


  // ========================================================
  // ORDER STATUS CHART DATA
  // ========================================================

  const statusChartData = {

    labels: [

      "Confirmed",

      "Preparing",

      "Out for Delivery",

      "Delivered"

    ],

    datasets: [

      {

        label: "Orders",

        data: [

          confirmedOrders,

          preparingOrders,

          outForDeliveryOrders,

          deliveredOrders

        ],

        backgroundColor: [

          "#2196f3",

          "#ff9800",

          "#9c27b0",

          "#4caf50"

        ],

        borderColor: "#ffffff",

        borderWidth: 4,

        hoverOffset: 12

      }

    ]

  };


  // ========================================================
  // ORDER STATUS CHART OPTIONS
  // ========================================================

  const statusChartOptions = {

    responsive: true,

    maintainAspectRatio: false,

    cutout: "62%",

    animation: {

      animateRotate: true,

      animateScale: true,

      duration: 1200

    },

    plugins: {

      legend: {

        position: "bottom",

        labels: {

          usePointStyle: true,

          pointStyle: "circle",

          padding: 18,

          font: {

            size: 12,

            weight: "600"

          }

        }

      },

      title: {

        display: true,

        text: "📦 Order Status",

        font: {

          size: 18,

          weight: "bold"

        },

        padding: {

          bottom: 15

        }

      },

      tooltip: {

        backgroundColor:
          "rgba(25,25,25,0.95)",

        padding: 14,

        cornerRadius: 10,

        callbacks: {

          label: function(context) {

            const value =
              context.raw || 0;

            const total =
              context.dataset.data
                .reduce(
                  (sum, number) =>
                    sum + Number(number),
                  0
                );

            const percentage =
              total > 0
                ? (
                    (value / total) *
                    100
                  ).toFixed(1)
                : 0;

            return ` ${context.label}: ${value} (${percentage}%)`;

          }

        }

      }

    }

  };


  // ========================================================
  // MENU CATEGORY COUNTS
  // ========================================================

  const categoryNames = [

    "Coffee",

    "Tea",

    "Beverage",

    "Snacks",

    "Pizza",

    "Dessert"

  ];


  const categoryCounts =
    categoryNames.map(
      (category) =>

        menuItems.filter(
          (item) =>
            item.category === category
        ).length

    );


  // ========================================================
  // MENU CATEGORY CHART DATA
  // ========================================================

  const categoryChartData = {

    labels: categoryNames,

    datasets: [

      {

        label: "Menu Items",

        data: categoryCounts,

        backgroundColor: [

          "#6f4e37",

          "#43a047",

          "#00acc1",

          "#fb8c00",

          "#e53935",

          "#8e24aa"

        ],

        borderColor: "#ffffff",

        borderWidth: 2,

        borderRadius: 12,

        borderSkipped: false,

        hoverBorderWidth: 3

      }

    ]

  };


  // ========================================================
  // MENU CATEGORY CHART OPTIONS
  // ========================================================

  const categoryChartOptions = {

    responsive: true,

    maintainAspectRatio: false,

    animation: {

      duration: 1200,

      easing: "easeOutBounce"

    },

    plugins: {

      legend: {

        display: false

      },

      title: {

        display: true,

        text: "🍔 Menu Items by Category",

        font: {

          size: 18,

          weight: "bold"

        },

        padding: {

          bottom: 20

        }

      },

      tooltip: {

        backgroundColor:
          "rgba(25,25,25,0.95)",

        padding: 14,

        cornerRadius: 10,

        callbacks: {

          label: function(context) {

            return ` ${context.raw} menu items`;

          }

        }

      }

    },

    scales: {

      x: {

        grid: {

          display: false

        },

        ticks: {

          font: {

            size: 11,

            weight: "600"

          }

        }

      },

      y: {

        beginAtZero: true,

        ticks: {

          stepSize: 1,

          font: {

            size: 11

          }

        },

        grid: {

          color:
            "rgba(0,0,0,0.07)"

        }

      }

    }

  };


  // ========================================================
  // ORDER TREND DATA
  // ========================================================

  const trendOrders =
    orders
      .slice()
      .reverse();


  const trendLabels =
    trendOrders.map(
      (order) =>
        order.date
          ? new Date(
              order.date
            ).toLocaleDateString(
              "en-IN",
              {
                day: "2-digit",
                month: "short"
              }
            )
          : `Order ${order.id}`
    );


  const trendValues =
    trendOrders.map(
      (order) =>
        Number(order.total || 0)
    );


  // ========================================================
  // ORDER TREND CHART DATA
  // ========================================================

  const orderTrendChartData = {

    labels: trendLabels,

    datasets: [

      {

        label: "Order Value (₹)",

        data: trendValues,

        borderColor: "#ff6b00",

        backgroundColor:
          "rgba(255,107,0,0.18)",

        pointBackgroundColor: "#ff4500",

        pointBorderColor: "#ffffff",

        pointBorderWidth: 3,

        pointRadius: 5,

        pointHoverRadius: 8,

        borderWidth: 4,

        tension: 0.4,

        fill: true

      }

    ]

  };


  // ========================================================
  // ORDER TREND CHART OPTIONS
  // ========================================================

  const orderTrendChartOptions = {

    responsive: true,

    maintainAspectRatio: false,

    animation: {

      duration: 1400,

      easing: "easeInOutQuart"

    },

    interaction: {

      intersect: false,

      mode: "index"

    },

    plugins: {

      legend: {

        display: true,

        position: "top",

        labels: {

          usePointStyle: true,

          pointStyle: "circle",

          padding: 20,

          font: {

            size: 13,

            weight: "600"

          }

        }

      },

      title: {

        display: true,

        text: "📈 Order Revenue Trend",

        font: {

          size: 18,

          weight: "bold"

        },

        padding: {

          bottom: 20

        }

      },

      tooltip: {

        backgroundColor:
          "rgba(25,25,25,0.95)",

        titleColor: "#ffffff",

        bodyColor: "#ffffff",

        padding: 14,

        cornerRadius: 10,

        displayColors: false,

        callbacks: {

          label: function(context) {

            return ` Revenue: ₹${Number(
              context.raw || 0
            ).toLocaleString("en-IN")}`;

          }

        }

      }

    },

    scales: {

      x: {

        grid: {

          display: false

        },

        ticks: {

          font: {

            size: 11

          },

          maxRotation: 45,

          minRotation: 0

        }

      },

      y: {

        beginAtZero: true,

        grid: {

          color:
            "rgba(0,0,0,0.07)"

        },

        ticks: {

          callback: function(value) {

            return "₹" +
              Number(value)
                .toLocaleString("en-IN");

          },

          font: {

            size: 11

          }

        }

      }

    }

  };
    // ========================================================
  // DASHBOARD UI
  // ========================================================

  return (

    <div className="admin-container">


      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="admin-header">

        <div>

          <h1>
            👑 Admin Dashboard
          </h1>

          <p>
            Welcome to Orange Cafe Shop
          </p>

        </div>


        <button
          className="refresh-btn"
          onClick={refreshDashboard}
          disabled={loading}
        >

          {loading
            ? "⏳ Refreshing..."
            : "🔄 Refresh Dashboard"}

        </button>

      </div>


      {/* ==================================================
          MESSAGE
      ================================================== */}

      {message && (

        <div className="admin-message">

          {message}

        </div>

      )}


      {/* ==================================================
          STATISTICS CARDS
      ================================================== */}

      <div className="dashboard-stats">


        {/* TOTAL ORDERS */}

        <div className="stat-card orders-card">

          <div className="stat-icon">
            📦
          </div>

          <div className="stat-content">

            <h3>
              Total Orders
            </h3>

            <h2>
              {totalOrders}
            </h2>

            <span>
              All customer orders
            </span>

          </div>

        </div>


        {/* REVENUE */}

        <div className="stat-card revenue-card">

          <div className="stat-icon">
            💰
          </div>

          <div className="stat-content">

            <h3>
              Total Revenue
            </h3>

            <h2>
              ₹{totalRevenue.toLocaleString("en-IN")}
            </h2>

            <span>
              From all orders
            </span>

          </div>

        </div>


        {/* CUSTOMERS */}

        <div className="stat-card customers-card">

          <div className="stat-icon">
            👥
          </div>

          <div className="stat-content">

            <h3>
              Customers
            </h3>

            <h2>
              {totalCustomers}
            </h2>

            <span>
              Unique customers
            </span>

          </div>

        </div>


        {/* MENU */}

        <div className="stat-card menu-card-stat">

          <div className="stat-icon">
            🍔
          </div>

          <div className="stat-content">

            <h3>
              Menu Items
            </h3>

            <h2>
              {totalMenuItems}
            </h2>

            <span>
              Available items
            </span>

          </div>

        </div>


        {/* AVERAGE ORDER */}

        <div className="stat-card average-card">

          <div className="stat-icon">
            📊
          </div>

          <div className="stat-content">

            <h3>
              Average Order
            </h3>

            <h2>
              ₹{averageOrderValue.toLocaleString("en-IN")}
            </h2>

            <span>
              Average order value
            </span>

          </div>

        </div>


        {/* DELIVERED */}

        <div className="stat-card delivered-card">

          <div className="stat-icon">
            🚚
          </div>

          <div className="stat-content">

            <h3>
              Delivered
            </h3>

            <h2>
              {deliveredOrders}
            </h2>

            <span>
              Completed orders
            </span>

          </div>

        </div>

      </div>


      {/* ==================================================
          ORDER STATUS SUMMARY
      ================================================== */}

      <div className="status-summary">


        <div className="status-box confirmed-box">

          <span>
            ✅
          </span>

          <div>

            <strong>
              {confirmedOrders}
            </strong>

            <small>
              Confirmed
            </small>

          </div>

        </div>


        <div className="status-box preparing-box">

          <span>
            🍳
          </span>

          <div>

            <strong>
              {preparingOrders}
            </strong>

            <small>
              Preparing
            </small>

          </div>

        </div>


        <div className="status-box delivery-box">

          <span>
            🚚
          </span>

          <div>

            <strong>
              {outForDeliveryOrders}
            </strong>

            <small>
              Out for Delivery
            </small>

          </div>

        </div>


        <div className="status-box delivered-box">

          <span>
            📦
          </span>

          <div>

            <strong>
              {deliveredOrders}
            </strong>

            <small>
              Delivered
            </small>

          </div>

        </div>

      </div>


      {/* ==================================================
          GRAPHS HEADER
      ================================================== */}

      <div className="section-heading">

        <div>

          <h2>
            📊 Analytics & Reports
          </h2>

          <p>
            Monitor cafe performance and orders
          </p>

        </div>

      </div>


      {/* ==================================================
          GRAPH GRID
      ================================================== */}

      <div className="charts-grid">


        {/* ==================================================
            REVENUE BAR CHART
        ================================================== */}

        <div className="chart-card chart-large">

          <div className="chart-header">

            <div>

              <h3>
                💰 Revenue Analysis
              </h3>

              <p>
                Revenue generated from each order
              </p>

            </div>

            <span className="chart-badge orange">
              Revenue
            </span>

          </div>


          <div className="chart-wrapper">

            {orders.length > 0 ? (

              <Bar
                data={revenueChartData}
                options={revenueChartOptions}
              />

            ) : (

              <div className="no-chart-data">

                <span>
                  📊
                </span>

                <p>
                  No order data available
                </p>

              </div>

            )}

          </div>

        </div>


        {/* ==================================================
            ORDER STATUS DOUGHNUT
        ================================================== */}

        <div className="chart-card">

          <div className="chart-header">

            <div>

              <h3>
                📦 Order Status
              </h3>

              <p>
                Current order distribution
              </p>

            </div>

            <span className="chart-badge purple">
              Status
            </span>

          </div>


          <div className="chart-wrapper">

            {orders.length > 0 ? (

              <Doughnut
                data={statusChartData}
                options={statusChartOptions}
              />

            ) : (

              <div className="no-chart-data">

                <span>
                  📦
                </span>

                <p>
                  No orders available
                </p>

              </div>

            )}

          </div>

        </div>


        {/* ==================================================
            MENU CATEGORY CHART
        ================================================== */}

        <div className="chart-card">

          <div className="chart-header">

            <div>

              <h3>
                🍔 Menu Categories
              </h3>

              <p>
                Items available by category
              </p>

            </div>

            <span className="chart-badge green">
              Menu
            </span>

          </div>


          <div className="chart-wrapper">

            {menuItems.length > 0 ? (

              <Bar
                data={categoryChartData}
                options={categoryChartOptions}
              />

            ) : (

              <div className="no-chart-data">

                <span>
                  🍔
                </span>

                <p>
                  No menu items available
                </p>

              </div>

            )}

          </div>

        </div>


        {/* ==================================================
            ORDER TREND LINE
        ================================================== */}

        <div className="chart-card chart-large">

          <div className="chart-header">

            <div>

              <h3>
                📈 Order Revenue Trend
              </h3>

              <p>
                Track order value over time
              </p>

            </div>

            <span className="chart-badge blue">
              Trend
            </span>

          </div>


          <div className="chart-wrapper">

            {orders.length > 0 ? (

              <Line
                data={orderTrendChartData}
                options={orderTrendChartOptions}
              />

            ) : (

              <div className="no-chart-data">

                <span>
                  📈
                </span>

                <p>
                  No trend data available
                </p>

              </div>

            )}

          </div>

        </div>

      </div>


      {/* ==================================================
          MENU MANAGEMENT
      ================================================== */}

      <div className="section-heading">

        <div>

          <h2>
            🍔 Menu Management
          </h2>

          <p>
            Add, edit and manage cafe menu items
          </p>

        </div>

      </div>


      {/* ==================================================
          MENU FORM
      ================================================== */}

      <div
        className="menu-form-card"
        id="menu-form"
      >

        <div className="form-title">

          <h3>

            {editId
              ? "✏️ Edit Menu Item"
              : "➕ Add New Menu Item"}

          </h3>

        </div>


        <div className="menu-form-grid">


          {/* ITEM NAME */}

          <div className="form-group">

            <label>
              Item Name
            </label>

            <input
              type="text"
              value={itemName}
              onChange={(e) =>
                setItemName(
                  e.target.value
                )
              }
              placeholder="Enter item name"
            />

          </div>


          {/* CATEGORY */}

          <div className="form-group">

            <label>
              Category
            </label>

            <select
              value={itemCategory}
              onChange={(e) =>
                setItemCategory(
                  e.target.value
                )
              }
            >

              <option value="Coffee">
                Coffee
              </option>

              <option value="Tea">
                Tea
              </option>

              <option value="Beverage">
                Beverage
              </option>

              <option value="Snacks">
                Snacks
              </option>

              <option value="Pizza">
                Pizza
              </option>

              <option value="Dessert">
                Dessert
              </option>

            </select>

          </div>


          {/* PRICE */}

          <div className="form-group">

            <label>
              Price
            </label>

            <input
              type="number"
              value={itemPrice}
              onChange={(e) =>
                setItemPrice(
                  e.target.value
                )
              }
              placeholder="₹ Price"
              min="1"
            />

          </div>


          {/* BUTTONS */}

          <div className="form-buttons">

            {editId ? (

              <>

                <button
                  className="update-menu-btn"
                  onClick={updateMenuItem}
                >
                  💾 Update Item
                </button>


                <button
  className="cancel-menu-btn"
  onClick={resetMenuForm}
>
  ✖ Cancel
</button>

              </>

            ) : (

              <button
                className="add-menu-btn"
                onClick={addMenuItem}
              >
                ➕ Add Item
              </button>

            )}

          </div>

        </div>

      </div>


      {/* ==================================================
          MENU FILTER
      ================================================== */}

      <div className="menu-toolbar">

        <div className="menu-search">

          <span>
            🔍
          </span>

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            placeholder="Search menu item..."
          />

        </div>


        <div className="menu-category-buttons">

          {menuCategories.map(
            (category) => (

              <button
                key={category}
                className={
                  menuFilter === category
                    ? "category-filter active"
                    : "category-filter"
                }
                onClick={() =>
                  setMenuFilter(
                    category
                  )
                }
              >

                {category}

              </button>

            )
          )}

        </div>

      </div>


      {/* ==================================================
          MENU TABLE
      ================================================== */}

      <div className="menu-table-card">

        <div className="table-title">

          <h3>
            📋 Menu Items
          </h3>

          <span>
            {filteredMenu.length} Items
          </span>

        </div>


        {filteredMenu.length === 0 ? (

          <div className="empty-state">

            <span>
              🍔
            </span>

            <h3>
              No Menu Items Found
            </h3>

            <p>
              Try changing your search or category.
            </p>

          </div>

        ) : (

          <div className="table-responsive">

            <table>

              <thead>

                <tr>

                  <th>
                    ID
                  </th>

                  <th>
                    Item
                  </th>

                  <th>
                    Category
                  </th>

                  <th>
                    Price
                  </th>

                  <th>
                    Actions
                  </th>

                </tr>

              </thead>


              <tbody>

                {filteredMenu.map(
                  (item) => (

                    <tr key={item.id}>

                      <td>
                        #{item.id}
                      </td>

                      <td>

                        <strong>
                          {item.name}
                        </strong>

                      </td>

                      <td>

                        <span className="category-pill">

                          {item.category}

                        </span>

                      </td>

                      <td>

                        <strong className="price-text">

                          ₹
                          {Number(
                            item.price || 0
                          ).toLocaleString(
                            "en-IN"
                          )}

                        </strong>

                      </td>

                      <td>

                        <div className="action-buttons">

                          <button
                            className="edit-btn"
                            onClick={() =>
                              editMenuItem(
                                item
                              )
                            }
                          >
                            ✏️ Edit
                          </button>


                          <button
                            className="delete-btn"
                            onClick={() =>
                              deleteMenuItem(
                                item.id
                              )
                            }
                          >
                            🗑️ Delete
                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>
            {/* ==================================================
          ORDERS MANAGEMENT
      ================================================== */}

      <div className="section-heading">

        <div>

          <h2>
            📦 Order Management
          </h2>

          <p>
            View and manage all customer orders
          </p>

        </div>

      </div>


      {/* ==================================================
          ORDER FILTERS
      ================================================== */}

      <div className="orders-toolbar">

        <div className="order-filter-buttons">

          <button
            className={
              orderFilter === "All"
                ? "order-filter active"
                : "order-filter"
            }
            onClick={() =>
              setOrderFilter("All")
            }
          >
            📋 All
          </button>


          <button
            className={
              orderFilter === "Confirmed"
                ? "order-filter active"
                : "order-filter"
            }
            onClick={() =>
              setOrderFilter("Confirmed")
            }
          >
            ✅ Confirmed
          </button>


          <button
            className={
              orderFilter === "Preparing"
                ? "order-filter active"
                : "order-filter"
            }
            onClick={() =>
              setOrderFilter("Preparing")
            }
          >
            🍳 Preparing
          </button>


          <button
            className={
              orderFilter === "Out for Delivery"
                ? "order-filter active"
                : "order-filter"
            }
            onClick={() =>
              setOrderFilter(
                "Out for Delivery"
              )
            }
          >
            🚚 Delivery
          </button>


          <button
            className={
              orderFilter === "Delivered"
                ? "order-filter active"
                : "order-filter"
            }
            onClick={() =>
              setOrderFilter("Delivered")
            }
          >
            📦 Delivered
          </button>

        </div>


        <div className="order-count">

          Showing{" "}
          <strong>
            {filteredOrders.length}
          </strong>{" "}
          orders

        </div>

      </div>


      {/* ==================================================
          ORDERS TABLE
      ================================================== */}

      <div className="orders-table-card">

        {filteredOrders.length === 0 ? (

          <div className="empty-state">

            <span>
              📦
            </span>

            <h3>
              No Orders Found
            </h3>

            <p>
              There are no orders for this filter.
            </p>

          </div>

        ) : (

          <div className="table-responsive">

            <table className="orders-table">

              <thead>

                <tr>

                  <th>
                    Order
                  </th>

                  <th>
                    Customer
                  </th>

                  <th>
                    Email
                  </th>

                  <th>
                    Items
                  </th>

                  <th>
                    Payment
                  </th>

                  <th>
                    Total
                  </th>

                  <th>
                    Date
                  </th>

                  <th>
                    Status
                  </th>

                </tr>

              </thead>


              <tbody>

                {filteredOrders.map(
                  (order) => {

                    const currentStatus =
                      order.status ||
                      "Confirmed";


                    let orderItems = [];


                    try {

                      if (
                        typeof order.items ===
                        "string"
                      ) {

                        orderItems =
                          JSON.parse(
                            order.items
                          );

                      } else if (
                        Array.isArray(
                          order.items
                        )
                      ) {

                        orderItems =
                          order.items;

                      }

                    } catch (error) {

                      console.error(
                        "ITEM PARSE ERROR:",
                        error
                      );

                      orderItems = [];

                    }


                    return (

                      <tr
                        key={order.id}
                      >


                        {/* ORDER ID */}

                        <td>

                          <div className="order-id-cell">

                            <span className="order-icon">
                              🧾
                            </span>

                            <strong>
                              #{order.id}
                            </strong>

                          </div>

                        </td>


                        {/* CUSTOMER */}

                        <td>

                          <div className="customer-cell">

                            <div className="customer-avatar">

                              {(order.customer ||
                                "G")
                                .charAt(0)
                                .toUpperCase()}

                            </div>

                            <strong>

                              {order.customer ||
                                "Guest"}

                            </strong>

                          </div>

                        </td>


                        {/* EMAIL */}

                        <td>

                          <span className="email-text">

                            {order.email ||
                              "N/A"}

                          </span>

                        </td>


                        {/* ITEMS */}

                        <td>

                          <div className="order-items-cell">

                            {orderItems.length >
                            0 ? (

                              orderItems
                                .slice(0, 3)
                                .map(
                                  (
                                    item,
                                    index
                                  ) => (

                                    <div
                                      className="order-item-mini"
                                      key={
                                        index
                                      }
                                    >

                                      <span>

                                        {item.name ||
                                          item.item ||
                                          "Item"}

                                      </span>

                                      {item.quantity && (

                                        <small>

                                          ×
                                          {item.quantity}

                                        </small>

                                      )}

                                    </div>

                                  )
                                )

                            ) : (

                              <span>
                                Order Items
                              </span>

                            )}


                            {orderItems.length >
                              3 && (

                              <small className="more-items">

                                +
                                {orderItems.length -
                                  3}{" "}
                                more

                              </small>

                            )}

                          </div>

                        </td>


                        {/* PAYMENT */}

                        <td>

                          <span className="payment-pill">

                            {order.payment ===
                            "COD"
                              ? "💵 COD"
                              : order.payment ===
                                "UPI"
                              ? "📱 UPI"
                              : order.payment ===
                                "Card"
                              ? "💳 Card"
                              : `💰 ${
                                  order.payment ||
                                  "Paid"
                                }`}

                          </span>

                        </td>


                        {/* TOTAL */}

                        <td>

                          <strong className="order-total">

                            ₹
                            {Number(
                              order.total || 0
                            ).toLocaleString(
                              "en-IN"
                            )}

                          </strong>

                        </td>


                        {/* DATE */}

                        <td>

                          <span className="order-date">

                            {order.date
                              ? new Date(
                                  order.date
                                ).toLocaleDateString(
                                  "en-IN"
                                )
                              : "N/A"}

                          </span>

                        </td>


                        {/* STATUS */}

                        <td>

                          <div className="status-control">


                            {/* STATUS BADGE */}

                            <span
                              className={`status-badge ${getStatusClass(
                                currentStatus
                              )}`}
                            >

                              {getStatusIcon(
                                currentStatus
                              )}

                              {currentStatus}

                            </span>


                            {/* STATUS DROPDOWN */}

                            <select
                              value={
                                currentStatus
                              }
                              className="status-select"
                              onChange={(event) =>
                                handleStatusChange(
                                  order.id,
                                  event
                                )
                              }
                            >

                              {orderStatuses.map(
                                (status) => (

                                  <option
                                    value={status}
                                    key={status}
                                  >
                                    {status}
                                  </option>

                                )
                              )}

                            </select>

                          </div>

                        </td>

                      </tr>

                    );

                  }

                )}

              </tbody>

            </table>

          </div>

        )}

      </div>


      {/* ==================================================
          DASHBOARD FOOTER
      ================================================== */}

      <footer className="admin-footer">

        <div>

          <strong>
            ☕ Orange Cafe Shop
          </strong>

          <span>
            Premium Cafe Management System
          </span>

        </div>


        <div>

          <span>
            Total Revenue:
          </span>

          <strong>

            ₹
            {totalRevenue.toLocaleString(
              "en-IN"
            )}

          </strong>

        </div>


        <div>

          <span>
            Total Orders:
          </span>

          <strong>
            {totalOrders}
          </strong>

        </div>

      </footer>


    </div>

  );

}
