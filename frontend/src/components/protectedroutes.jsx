/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ component: Component }) => {
  const isAuthenticated = !!localStorage.getItem("token");

  return isAuthenticated ? <Component /> : <Navigate to="/signin" replace />;
};

export default ProtectedRoute;
