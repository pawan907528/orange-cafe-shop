import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {

  const savedUser = localStorage.getItem("user");

  // Not logged in
  if (!savedUser) {
    return <Navigate to="/login" replace />;
  }

  let user;

  try {
    user = JSON.parse(savedUser);
  } catch (error) {

    localStorage.removeItem("user");

    return <Navigate to="/login" replace />;
  }

  // Logged-in customer trying to access Admin
  if (user.role !== "admin") {
    return <Navigate to="/menu" replace />;
  }

  // Admin is allowed
  return children;
}
