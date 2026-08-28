import {
  useNavigate,
  useSearchParams
} from "react-router-dom";

import { useEffect, useState } from "react";
import axios from "axios";
import "./Menu.css";

import espresso from "../images/espresso.jpg";
import cappuccino from "../images/cappuccino.jpg";
import latte from "../images/latte.jpg";
import mocha from "../images/mocha.jpg";
import coldcoffee from "../images/coldcoffee.jpg";
import greentea from "../images/greentea.jpg";
import masalatea from "../images/masalatea.jpg";
import hotchocolate from "../images/hotchocolate.jpg";
import mangomilkshake from "../images/mangomilkshake.jpg";
import chocolatemilkshake from "../images/chocolatemilkshake.jpg";
import vegburger from "../images/vegburger.jpg";
import cheeseburger from "../images/cheeseburger.jpg";
import fries from "../images/fries.jpg";
import garlicbread from "../images/garlicbread.jpg";
import vegsandwich from "../images/vegsandwich.jpg";
import grilledsandwich from "../images/grilledsandwich.jpg";
import margherita from "../images/margherita.jpg";
import farmhouse from "../images/farmhouse.jpg";
import brownie from "../images/brownie.jpg";
import cheesecake from "../images/cheesecake.jpg";


const imageMap = {

  Espresso: espresso,

  Cappuccino: cappuccino,

  Latte: latte,

  Mocha: mocha,

  "Cold Coffee": coldcoffee,

  "Green Tea": greentea,

  "Masala Tea": masalatea,

  "Hot Chocolate": hotchocolate,

  "Mango Milkshake": mangomilkshake,

  "Chocolate Milkshake": chocolatemilkshake,

  "Veg Burger": vegburger,

  "Cheese Burger": cheeseburger,

  "French Fries": fries,

  "Garlic Bread": garlicbread,

  "Veg Sandwich": vegsandwich,

  "Grilled Sandwich": grilledsandwich,

  "Margherita Pizza": margherita,

  "Farmhouse Pizza": farmhouse,

  "Chocolate Brownie": brownie,

  "Blueberry Cheesecake": cheesecake

};


export default function Menu() {

  const navigate = useNavigate();

  const [searchParams, setSearchParams] =
    useSearchParams();


  // ============================
  // States
  // ============================

  const [items, setItems] = useState([]);

  const [cart, setCart] = useState([]);

  const [favorites, setFavorites] = useState([]);

  const [search, setSearch] = useState("");


  // IMPORTANT:
  // Read category from URL

  const urlCategory =
    searchParams.get("category") || "All";


  const [category, setCategory] =
    useState(urlCategory);


  const [toast, setToast] = useState(false);


  // ============================
  // Load Menu + Cart
  // ============================

  useEffect(() => {

    fetchMenu();


    const savedCart =
      JSON.parse(
        localStorage.getItem("cart")
      ) || [];


    setCart(savedCart);

  }, []);


  // ============================
  // Update Category From URL
  // ============================

  useEffect(() => {

    const selectedCategory =
      searchParams.get("category");


    if (selectedCategory) {

      setCategory(selectedCategory);

    } else {

      setCategory("All");

    }

  }, [searchParams]);


  // ============================
  // Fetch Menu
  // ============================

  const fetchMenu = async () => {

    try {

      const response = await axios.get(
        "https://orange-cafe-shop.onrender.com/menu"
      );


      if (Array.isArray(response.data)) {

        setItems(response.data);

      }

      else if (
        Array.isArray(response.data.items)
      ) {

        setItems(response.data.items);

      }

      else {

        setItems([]);

      }

    }

    catch (error) {

      console.error(
        "Menu Error:",
        error
      );

      alert(
        "Unable to load menu."
      );

      setItems([]);

    }

  };


  // ============================
  // Category Button
  // ============================

  const changeCategory = (newCategory) => {

    setCategory(newCategory);


    if (newCategory === "All") {

      setSearchParams({});

    }

    else {

      setSearchParams({
        category: newCategory
      });

    }

  };


  // ============================
  // Favourite
  // ============================

  const toggleFavorite = (id) => {

    if (favorites.includes(id)) {

      setFavorites(
        favorites.filter(
          (item) => item !== id
        )
      );

    }

    else {

      setFavorites([
        ...favorites,
        id
      ]);

    }

  };


  // ============================
  // Add To Cart
  // ============================

  const addToCart = (item) => {

    let updatedCart = [];


    const existing = cart.find(
      (cartItem) =>
        cartItem.id === item.id
    );


    if (existing) {

      updatedCart = cart.map(
        (cartItem) =>

          cartItem.id === item.id

            ? {
                ...cartItem,
                quantity:
                  cartItem.quantity + 1
              }

            : cartItem
      );

    }

    else {

      updatedCart = [

        ...cart,

        {
          ...item,
          quantity: 1
        }

      ];

    }


    setCart(updatedCart);


    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    );


    setToast(true);


    setTimeout(() => {

      setToast(false);

    }, 2000);

  };


  // ============================
  // Increase Quantity
  // ============================

  const increaseQuantity = (id) => {

    const updatedCart = cart.map(
      (item) =>

        item.id === id

          ? {
              ...item,
              quantity:
                item.quantity + 1
            }

          : item
    );


    setCart(updatedCart);


    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    );

  };


  // ============================
  // Decrease Quantity
  // ============================

  const decreaseQuantity = (id) => {

    const updatedCart = cart

      .map(
        (item) =>

          item.id === id

            ? {
                ...item,
                quantity:
                  item.quantity - 1
              }

            : item
      )

      .filter(
        (item) =>
          item.quantity > 0
      );


    setCart(updatedCart);


    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    );

  };


  // ============================
  // Remove Item
  // ============================

  const removeItem = (id) => {

    const updatedCart =
      cart.filter(
        (item) =>
          item.id !== id
      );


    setCart(updatedCart);


    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    );

  };


  // ============================
  // Filter Menu
  // ============================

  const filtered = items.filter(
    (item) => {

      const itemName =
        String(
          item.name || ""
        ).toLowerCase();


      const itemCategory =
        String(
          item.category || ""
        ).trim().toLowerCase();


      const selectedCategory =
        String(
          category || "All"
        ).trim().toLowerCase();


      const searchText =
        search.toLowerCase();


      const matchSearch =
        itemName.includes(
          searchText
        );


      const matchCategory =
        selectedCategory === "all" ||
        itemCategory ===
          selectedCategory;


      return (
        matchSearch &&
        matchCategory
      );

    }
  );


  // ============================
  // Cart Calculations
  // ============================

  const subtotal = cart.reduce(

    (total, item) =>

      total +
      Number(item.price) *
      Number(item.quantity),

    0

  );


  const deliveryCharge =
    cart.length > 0 ? 50 : 0;


  const gst =
    Math.round(
      subtotal * 0.05
    );


  const grandTotal =
    subtotal +
    deliveryCharge +
    gst;


  // ============================
  // Total Cart Items
  // ============================

  const totalItems =
    cart.reduce(

      (total, item) =>

        total +
        Number(item.quantity),

      0

    );


  // ============================
  // UI
  // ============================

  return (

    <div className="menu-container">


      {/* Toast */}

      {toast && (

        <div className="toast">

          ✅ Item Added Successfully

        </div>

      )}


      {/* ================= HERO ================= */}

      <div className="hero-banner">

        <h1>
          ☕ Orange Cafe Shop
        </h1>


        <p>
          Fresh Coffee • Delicious Snacks •
          Fast Delivery
        </p>


        <div className="hero-buttons">

          <button

            className="hero-btn"

            onClick={() =>
              navigate("/menu")
            }

          >

            ☕ Order Now

          </button>


          <button

            className="hero-btn secondary"

            onClick={() =>
              changeCategory("All")
            }

          >

            📖 View Menu

          </button>

        </div>


        <div className="cart-counter">

          🛒 Cart : {totalItems}

        </div>


        <input

          className="search-box"

          type="text"

          placeholder="🔍 Search your favourite food..."

          value={search}

          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }

        />

      </div>


      {/* ================= Statistics ================= */}

      <div className="stats">

        <div>

          <h2>
            {items.length}
          </h2>

          <p>
            Menu Items
          </p>

        </div>


        <div>

          <h2>
            500+
          </h2>

          <p>
            Happy Customers
          </p>

        </div>


        <div>

          <h2>
            4.8⭐
          </h2>

          <p>
            Ratings
          </p>

        </div>

      </div>


      <h2 className="featured-title">

        ⭐ Featured Items

      </h2>


      {/* ================= Shopping Cart ================= */}

      <div className="cart-summary">

        <h2>
          🛒 Shopping Cart
        </h2>


        {cart.length === 0 ? (

          <p>
            No Items Added
          </p>

        ) : (

          <>

            {cart.map(
              (cartItem) => (

                <div

                  className="cart-row"

                  key={cartItem.id}

                >

                  <div>

                    <h4>
                      {cartItem.name}
                    </h4>


                    <div className="qty-buttons">

                      <button

                        onClick={() =>
                          decreaseQuantity(
                            cartItem.id
                          )
                        }

                      >
                        -
                      </button>


                      <span>
                        {cartItem.quantity}
                      </span>


                      <button

                        onClick={() =>
                          increaseQuantity(
                            cartItem.id
                          )
                        }

                      >
                        +
                      </button>

                    </div>

                  </div>


                  <div>

                    <h4>

                      ₹
                      {
                        Number(
                          cartItem.price
                        ) *
                        Number(
                          cartItem.quantity
                        )
                      }

                    </h4>


                    <button

                      className="remove-btn"

                      onClick={() =>
                        removeItem(
                          cartItem.id
                        )
                      }

                    >

                      🗑

                    </button>

                  </div>

                </div>

              )
            )}


            <hr />


            <p>
              Subtotal : ₹{subtotal}
            </p>


            <p>
              Delivery : ₹{deliveryCharge}
            </p>


            <p>
              GST (5%) : ₹{gst}
            </p>


            <h2>

              Grand Total : ₹
              {grandTotal}

            </h2>


            <button

              className="checkout-btn"

              onClick={() =>
                navigate("/payment")
              }

            >

              💳 Checkout

            </button>

          </>

        )}

      </div>


      {/* ================= Category ================= */}

      <div className="filter-buttons">

        {[
          "All",
          "Coffee",
          "Tea",
          "Beverage",
          "Snacks",
          "Pizza",
          "Dessert"
        ].map(
          (c) => (

            <button

              key={c}

              onClick={() =>
                changeCategory(c)
              }

              className={
                category === c
                  ? "active"
                  : ""
              }

            >

              {c}

            </button>

          )
        )}

      </div>


      {/* ================= Selected Category ================= */}

      <div className="selected-category">

        {category !== "All" && (

          <h2>

            Showing:
            {" "}
            {category}

          </h2>

        )}

      </div>


      {/* ================= Menu Grid ================= */}

      <div className="menu-grid">

        {filtered.length === 0 ? (

          <h2>
            No Menu Items Found
          </h2>

        ) : (

          filtered.map(
            (item) => (

              <div

                className="menu-card"

                key={item.id}

              >

                <span className="badge">

                  🔥 Best Seller

                </span>


                <button

                  className="favorite-btn"

                  onClick={() =>
                    toggleFavorite(
                      item.id
                    )
                  }

                >

                  {
                    favorites.includes(
                      item.id
                    )
                      ? "❤️"
                      : "🤍"
                  }

                </button>


                <img

                  src={
                    imageMap[item.name]
                  }

                  alt={item.name}

                  className="menu-image"

                />


                <div className="menu-info">

                  <h2>
                    {item.name}
                  </h2>


                  <span className="category">

                    {item.category}

                  </span>


                  <p className="veg-icon">

                    🌱 100% Veg

                  </p>


                  <p className="rating">

                    ⭐ 4.8 (120 Reviews)

                  </p>


                  <p className="prep-time">

                    🕒 Ready in 10-15 mins

                  </p>


                  <h3 className="price">

                    ₹{item.price}

                  </h3>


                  <button

                    className="cart-btn"

                    onClick={() =>
                      addToCart(item)
                    }

                  >

                    🛒 Add to Cart

                  </button>

                </div>

              </div>

            )
          )

        )}

      </div>

    </div>

  );

}
