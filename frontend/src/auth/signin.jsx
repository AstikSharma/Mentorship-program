/* eslint-disable react/prop-types */
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Signin({ setIsAuthenticated }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!username || !password) {
      setError("Please provide both username and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/login`, {
        username,
        password,
      });     
      localStorage.setItem("token", response.data.token);
      setIsAuthenticated(true);
      setLoading(false);
      navigate("/");
    } catch (err) {
      setLoading(false);

      const errorMessage = err.response?.data?.message;
      if (errorMessage === "User not found") {
        alert("User does not exist. Redirecting to signup...");
        navigate("/signup");
      } else if (errorMessage === "Invalid credentials") {
        setError("Invalid username or password.");
      } else {
        setError("An error occurred. Please try again.");
      }
    }
  };
  
  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 my-24">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm/6 font-medium text-gray-900">
                Username
              </label>
              <div className="mt-2">
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </div>
          </form>

          {error && (
            <p className="mt-4 text-center text-sm text-red-500">
              {error}
            </p>
          )}

          <p className="mt-10 text-center text-sm/6 text-gray-500">
            Not a member?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="cursor-pointer font-semibold text-indigo-600 hover:text-indigo-500"
            >
              Sign up
            </span>
          </p>
        </div>
      </div>
    </>
  );
}

export default Signin;
