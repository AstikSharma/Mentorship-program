/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
  
    if (!username || !email || !password || password.length < 6) {
      setError("Please provide a valid username, email, and a password with at least 6 characters.");
      return;
    }
  
    setLoading(true);
  
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/register`, {
        username,
        email,
        password,
      });
  
      const { token } = response.data;
  
      localStorage.setItem("token", token);
      setLoading(false);
      navigate("/profile");
    } catch (err) {
      setLoading(false);
      const errorMessage = err.response?.data?.message;
  
      if (errorMessage === "User already exists") {
        alert("User already exists. Redirecting to signin...");
        navigate("/signin");
      } else {
        setError(errorMessage || "An error occurred");
      }
    }
  };  

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 my-16">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Sign up for an account
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
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                Email
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
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
                {loading ? "Signing Up..." : "Sign Up"}
              </button>
            </div>
          </form>

          {error && (
            <p className="mt-4 text-center text-sm text-red-500">
              {error}
            </p>
          )}

          {success && (
            <p className="mt-4 text-center text-sm text-green-500">
              User registered successfully! Redirecting...
            </p>
          )}

          <p className="mt-10 text-center text-sm/6 text-gray-500">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/signin")}
              className="cursor-pointer font-semibold text-indigo-600 hover:text-indigo-500"
            >
              Sign in
            </span>
          </p>
        </div>
      </div>
    </>
  );
}

export default Signup;
