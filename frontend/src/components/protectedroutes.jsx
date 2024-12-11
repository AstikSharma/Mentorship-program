/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ component: Component }) => {
  const isAuthenticated = !!localStorage.getItem("token"); // Check if the token exists in localStorage

  // If authenticated, render the component. Otherwise, redirect to /signin.
  return isAuthenticated ? <Component /> : <Navigate to="/signin" replace />;
};

export default ProtectedRoute;
