import toast from "react-hot-toast";
import { Navigate } from "react-router-dom";
import { isPrivileged } from "../config/guest";

export const ProtectedAdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  if (!user || !token || !isPrivileged(user)) {
    toast.error("Access Denied: Admins Only");
    return <Navigate to="/login" replace />;
  }

  return children;
};