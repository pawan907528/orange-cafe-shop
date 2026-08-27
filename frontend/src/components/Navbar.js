import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {

  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  // ==========================
  // Check Login
  // ==========================

  useEffect(() => {

    const checkUser = () => {

      const savedUser =
        JSON.parse(
          localStorage.getItem("user")
        );

      setUser(savedUser);

    };

    checkUser();

    window.addEventListener(
      "storage",
      checkUser
    );

    return () => {

      window.removeEventListener(
        "storage",
        checkUser
      );

    };

  }, []);

  // ==========================
  // Logout
  // ==========================

  const logout = () => {

    localStorage.removeItem("user");

    localStorage.removeItem("cart");

    setUser(null);

    navigate("/login");

    window.location.reload();

  };

  return (

    <nav className="navbar">

      {/* Logo */}

      <div className="logo">

        <Link to="/">
          ☕ Orange Cafe
        </Link>

      </div>

      {/* Links */}

      <div className="nav-links">

        <Link to="/">
          Home
        </Link>

        {user && (

          <>
            <Link to="/menu">
              Menu
            </Link>

            <Link to="/cart">
              Cart
            </Link>

            <Link to="/orders">
              Orders
            </Link>
          </>

        )}

        {/* ADMIN */}

        {user &&
          user.role === "admin" && (

          <Link to="/admin">
            👨‍💼 Admin
          </Link>

        )}

        {/* NOT LOGGED IN */}

        {!user && (

          <>

            <Link to="/login">
              Login
            </Link>

            <Link to="/register">
              Register
            </Link>

          </>

        )}

        {/* LOGGED IN */}

        {user && (

          <>

            <span className="welcome-user">
              👋 {user.name}
            </span>

            <button
              className="logout-btn"
              onClick={logout}
            >
              🚪 Logout
            </button>

          </>

        )}

      </div>

    </nav>

  );

}