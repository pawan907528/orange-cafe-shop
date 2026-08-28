import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {

  const savedUser = localStorage.getItem("user");

  // User is not logged in
  if (!savedUser) {
    return <Navigate to="/login" replace />;
  }

  // User is logged in
  return children;
}
