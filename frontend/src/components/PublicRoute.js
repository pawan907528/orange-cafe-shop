import { Navigate } from "react-router-dom";

export default function PublicRoute({ children }) {

  const savedUser = localStorage.getItem("user");

  if (savedUser) {

    return <Navigate to="/menu" replace />;

  }

  return children;
}