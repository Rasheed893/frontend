import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Swal from "sweetalert2";

const AdminRoute = ({ children }) => {
  const token = sessionStorage.getItem("token");
  const tokenExpiry = sessionStorage.getItem("tokenExpiry");

  // Check if token exists and if the current time is less than the expiry time
  if (!token || (tokenExpiry && Date.now() > tokenExpiry)) {
    // Optionally, clear any stale token data
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("tokenExpiry");
    Swal.fire({
      title: "Token has expired!",
      text: "Please login again",
      icon: "question",
    });
    return <Navigate to="/admin" />;
  }
  return children ? children : <Outlet />;
};

export default AdminRoute;
