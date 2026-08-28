import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Home.css";

import SmartOffers from "./SmartOffers";
import MoodRecommendation from "./MoodRecommendation";
import Loyalty from "./Loyalty";


export default function Home() {

  const navigate = useNavigate();

  // ==========================
  // Search
  // ==========================

  const [search, setSearch] = useState("");


  // ==========================
  // Today's Special
  // ==========================

  const specials = [

    {
      id: 1,
      name: "Caramel Latte",
      price: 199,
      image: "/images/caramel-latte.jpg"
    },

    {
      id: 2,
      name: "Chocolate Brownie",
      price: 149,
      image: "/images/brownie.jpg"
    },

    {
      id: 3,
      name: "Cold Coffee",
      price: 169,
      image: "/images/coldcoffee.jpg"
    }

  ];


  // ==========================
  // Best Sellers
  // ==========================

  const bestSellers = [

    {
      id: 1,
      name: "Espresso",
      price: 120,
      image: "/images/espresso.jpg"
    },

    {
      id: 2,
      name: "Cappuccino",
      price: 180,
      image: "/images/cappuccino.jpg"
    },

    {
      id: 3,
      name: "Farmhouse Pizza",
      price: 320,
      image: "/images/farmhouse.jpg"
    }

  ];


  // ==========================
  // Why Choose Us
  // ==========================

  const features = [

    {
      icon: "☕",
      title: "Fresh Coffee",
      description:
        "Prepared from premium coffee beans."
    },

    {
      icon: "🍕",
      title: "Delicious Food",
      description:
        "Fresh snacks and tasty meals."
    },

    {
      icon: "🚀",
      title: "Fast Delivery",
      description:
        "Quick and safe doorstep delivery."
    },

    {
      icon: "💳",
      title: "Secure Payment",
      description:
        "100% secure online payment."
    }

  ];


  // ==========================
  // Customer Reviews
  // ==========================

  const reviews = [

    {
      name: "Rahul",
      rating: "⭐⭐⭐⭐⭐",
      comment:
        "Best coffee in town!"
    },

    {
      name: "Priya",
      rating: "⭐⭐⭐⭐⭐",
      comment:
        "Amazing food and quick delivery."
    },

    {
      name: "Amit",
      rating: "⭐⭐⭐⭐⭐",
      comment:
        "Beautiful cafe atmosphere."
    }

  ];


  // ==========================
  // HOME UI
  // ==========================

  return (

    <div className="home-page">


      {/* =====================================
          HERO SECTION
      ===================================== */}

      <section className="hero">

        <div className="hero-left">

          <span className="hero-tag">

            ⭐ Premium Coffee Experience

          </span>


          <h1>

            Fresh Coffee
            <br />

            Fresh Moments

          </h1>


          <p>

            Experience handcrafted coffee,
            delicious snacks, pizzas and desserts
            made with premium ingredients.
            Order online or visit Orange Cafe today.

          </p>


          {/* Search */}

          <div className="hero-search">

            <input

              type="text"

              placeholder="Search coffee, pizza, snacks..."

              value={search}

              onChange={(e) =>
                setSearch(e.target.value)
              }

            />


            <button
              onClick={() => navigate("/menu")}
            >

              🔍 Search

            </button>

          </div>


          {/* Hero Buttons */}

          <div className="hero-buttons">

            <button

              className="order-btn"

              onClick={() =>
                navigate("/menu")
              }

            >

              ☕ Order Now

            </button>


            <button

              className="menu-btn"

              onClick={() =>
                navigate("/menu")
              }

            >

              📖 View Menu

            </button>

          </div>

        </div>


        {/* Hero Right */}

        <div className="hero-right">

          <div className="coffee-circle">

            ☕

          </div>


          <div className="floating-card">

            ⭐ 4.9 Rating

          </div>


          <div className="floating-card second">

            🚀 Fast Delivery

          </div>

        </div>

      </section>



      {/* =====================================
          SMART PERSONALIZED OFFERS
      ===================================== */}

      <SmartOffers />



      {/* =====================================
          LOYALTY REWARDS
      ===================================== */}

      <Loyalty />



      {/* =====================================
          AI MOOD RECOMMENDATION
      ===================================== */}

      <MoodRecommendation />



      {/* =====================================
          TODAY'S SPECIAL
      ===================================== */}

      <section className="special-section">

        <div className="section-title">

          <h2>
            🔥 Today's Special
          </h2>

          <p>
            Freshly prepared favorites just for you.
          </p>

        </div>


        <div className="product-grid">

          {specials.map((item) => (

            <div
              key={item.id}
              className="product-card"
            >

              <img
                src={item.image}
                alt={item.name}
              />


              <h3>
                {item.name}
              </h3>


              <p className="rating">

                ⭐⭐⭐⭐⭐

              </p>


              <p className="price">

                ₹{item.price}

              </p>


              <button

                className="card-btn"

                onClick={() =>
                  navigate("/menu")
                }

              >

                Order Now

              </button>

            </div>

          ))}

        </div>

      </section>



      {/* =====================================
          BEST SELLERS
      ===================================== */}

      <section className="best-section">

        <div className="section-title">

          <h2>
            🏆 Best Sellers
          </h2>

          <p>
            Our customers' most loved menu items.
          </p>

        </div>


        <div className="product-grid">

          {bestSellers.map((item) => (

            <div
              key={item.id}
              className="product-card"
            >

              <div className="best-badge">

                BEST SELLER

              </div>


              <img
                src={item.image}
                alt={item.name}
              />


              <h3>
                {item.name}
              </h3>


              <p className="rating">

                ⭐⭐⭐⭐⭐

              </p>


              <p className="price">

                ₹{item.price}

              </p>


              <button

                className="card-btn"

                onClick={() =>
                  navigate("/menu")
                }

              >

                Add to Cart

              </button>

            </div>

          ))}

        </div>

      </section>



      {/* =====================================
          WHY CHOOSE US
      ===================================== */}

      <section className="features-section">

        <div className="section-title">

          <h2>
            ✨ Why Choose Orange Cafe?
          </h2>

          <p>

            We serve quality, freshness and
            happiness in every order.

          </p>

        </div>


        <div className="features-grid">

          {features.map(
            (feature, index) => (

              <div
                key={index}
                className="feature-card"
              >

                <div className="feature-icon">

                  {feature.icon}

                </div>


                <h3>

                  {feature.title}

                </h3>


                <p>

                  {feature.description}

                </p>

              </div>

            )
          )}

        </div>

      </section>



      {/* =====================================
          CUSTOMER REVIEWS
      ===================================== */}

      <section className="reviews-section">

        <div className="section-title">

          <h2>
            💬 Customer Reviews
          </h2>

          <p>

            Thousands of happy coffee lovers.

          </p>

        </div>


        <div className="reviews-grid">

          {reviews.map(
            (review, index) => (

              <div
                key={index}
                className="review-card"
              >

                <div className="review-avatar">

                  👤

                </div>


                <h3>

                  {review.name}

                </h3>


                <p className="review-rating">

                  {review.rating}

                </p>


                <p className="review-text">

                  "{review.comment}"

                </p>

              </div>

            )
          )}

        </div>

      </section>


      {/* =====================================
    CAFE GALLERY
===================================== */}

<section className="gallery-section">

  <div className="section-title">

    <h2>
      📸 Cafe Gallery
    </h2>

    <p>
      Explore our delicious food and drinks.
    </p>

  </div>


  <div className="gallery-grid">

    {/* Coffee */}

    <button
      className="gallery-item"
      onClick={() =>
        navigate("/menu?category=Coffee")
      }
    >

      <span className="gallery-icon">
        ☕
      </span>

      <span>
        Coffee
      </span>

    </button>


    {/* Pizza */}

    <button
      className="gallery-item"
      onClick={() =>
        navigate("/menu?category=Pizza")
      }
    >

      <span className="gallery-icon">
        🍕
      </span>

      <span>
        Pizza
      </span>

    </button>


    {/* Burger */}

    <button
      className="gallery-item"
      onClick={() =>
        navigate("/menu?category=Snacks")
      }
    >

      <span className="gallery-icon">
        🍔
      </span>

      <span>
        Burgers
      </span>

    </button>


    {/* Dessert */}

    <button
      className="gallery-item"
      onClick={() =>
        navigate("/menu?category=Dessert")
      }
    >

      <span className="gallery-icon">
        🍰
      </span>

      <span>
        Dessert
      </span>

    </button>


    {/* Milkshake */}

    <button
      className="gallery-item"
      onClick={() =>
        navigate("/menu?category=Beverage")
      }
    >

      <span className="gallery-icon">
        🥤
      </span>

      <span>
        Milkshake
      </span>

    </button>


    {/* Sandwich */}

    <button
      className="gallery-item"
      onClick={() =>
        navigate("/menu?category=Snacks")
      }
    >

      <span className="gallery-icon">
        🥪
      </span>

      <span>
        Sandwich
      </span>

    </button>

  </div>

</section>

      {/* =====================================
          WEEKEND OFFER
      ===================================== */}

      <section className="offer-section">

        <div className="offer-box">

          <h2>

            🎉 Weekend Special Offer

          </h2>


          <p>

            Get <strong>20% OFF</strong>
            on every coffee order above ₹499.

          </p>


          <button

            className="offer-btn"

            onClick={() =>
              navigate("/menu")
            }

          >

            Grab Offer

          </button>

        </div>

      </section>



      {/* =====================================
          FOOTER
      ===================================== */}

      <footer className="footer">

        <div className="footer-content">


          {/* Footer Left */}

          <div className="footer-left">

            <h2>

              ☕ Orange Cafe

            </h2>


            <p>

              Fresh Coffee • Delicious Food •
              Happy Moments

            </p>

          </div>



          {/* Footer Center */}

          <div className="footer-center">

            <h3>

              Contact

            </h3>


            <p>

              📍 Bhiwandi, Maharashtra

            </p>


            <p>

              📞 +91 9876543210

            </p>


            <p>

              📧 orangecafe@gmail.com

            </p>

          </div>



          {/* Footer Right */}

          <div className="footer-right">

            <h3>

              Follow Us

            </h3>


            <div className="social-icons">

              <span>📘</span>

              <span>📷</span>

              <span>🐦</span>

              <span>▶️</span>

            </div>

          </div>

        </div>


        <hr />


        <p className="copyright">

          © 2026 Orange Cafe Shop |
          All Rights Reserved

        </p>

      </footer>

    </div>

  );

}
