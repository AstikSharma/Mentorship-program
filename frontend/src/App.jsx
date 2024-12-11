import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Signup from "./auth/signup";
import Signin from "./auth/signin";
import Home from "./pages/home";
import Profile from "./pages/profile";
import ViewProfile from "./pages/viewprofile"; 
import Notifications from "./components/notification";

function App() {
  // Initialize isAuthenticated based on localStorage
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem("token"); // Check if a token exists in localStorage
  });

  // Optional: Add a listener to handle token updates dynamically (e.g., logout)
  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem("token"));
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <Router>
      <Routes>
        {/* Default route redirects to /signin or /home */}
        <Route
          path="/"
          element={
            isAuthenticated ? <Home /> : <Navigate to="/signin" replace />
          }
        />

        {/* Signup and Signin routes */}
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/signin"
          element={<Signin setIsAuthenticated={setIsAuthenticated} />}
        />

        {/* Profile routes */}
        <Route
          path="/profile"
          element={
            isAuthenticated ? <Profile /> : <Navigate to="/signin" replace />
          }
        />

        {/* New route for ViewProfile */}
        <Route
          path="/viewprofile/:username"
          element={
            isAuthenticated ? (
              <ViewProfile />
            ) : (
              <Navigate to="/signin" replace />
            )
          }
        />

        {/* Notifications route */}
        <Route
          path="/notifications"
          element={
            isAuthenticated ? <Notifications /> : <Navigate to="/signin" replace />
          }
        />

        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
