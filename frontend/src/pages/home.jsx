import { useState, useEffect } from "react";
import Header from "../components/header";
import axios from "axios";
import MultiActionAreaCard from "../components/cards";
import { useNavigate } from "react-router-dom"; // Use useNavigate for programmatic navigation

export default function Home() {
  const [profiles, setProfiles] = useState([]);
  const [filters, setFilters] = useState({
    role: "",
    skills: "",
    interests: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sentRequests, setSentRequests] = useState({});
  const [showPopup, setShowPopup] = useState(false); // State for popup visibility

  const navigate = useNavigate(); // Initialize useNavigate hook

  // Fetch profiles on component mount or when filters change
  useEffect(() => {
    const fetchProfiles = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/discover`,
          {
            params: filters,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`, // Include token for backend to identify the user
            },
          }
        );
        setProfiles(response.data);

        // Fetch sent requests
        const requestsResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/connections/sent`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const sentRequestsData = {};
        requestsResponse.data.forEach((req) => {
          sentRequestsData[req.receiver_id] = true; // Mark sent requests
        });
        setSentRequests(sentRequestsData);
        setLoading(false);
      } catch (err) {
        if (err.response?.status === 403) {
          setShowPopup(true); // Show the popup for 403 errors
        } else {
          setError(err.response?.data?.message || "Failed to load profiles");
        }
        setLoading(false);
      }
    };

    fetchProfiles();
  }, [filters]);

  // Handle filter changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleRedirect = (username) => {
    navigate(`/viewprofile/${username}`);
  };

  const handlePopupClose = () => {
    setShowPopup(false);
    navigate("/signin"); // Redirect to signin page
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">User Discovery</h1>
          <p className="mt-4 text-lg text-gray-600">
            Browse through user profiles and find a match for your interests.
          </p>

          {/* Filter Section */}
          <div className="mt-6 bg-white p-6 shadow rounded-md">
            <h2 className="text-xl font-semibold text-gray-800">Filters</h2>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-700"
                >
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  value={filters.role}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="">All</option>
                  <option value="mentor">Mentor</option>
                  <option value="mentee">Mentee</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="skills"
                  className="block text-sm font-medium text-gray-700"
                >
                  Skills
                </label>
                <input
                  id="skills"
                  name="skills"
                  type="text"
                  value={filters.skills}
                  onChange={handleInputChange}
                  placeholder="e.g., JavaScript, Python"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="interests"
                  className="block text-sm font-medium text-gray-700"
                >
                  Interests
                </label>
                <input
                  id="interests"
                  name="interests"
                  type="text"
                  value={filters.interests}
                  onChange={handleInputChange}
                  placeholder="e.g., AI, Web Development"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          </div>

          {/* Profiles Section */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-800">Profiles</h2>
            {loading ? (
              <p className="mt-4 text-gray-500">Loading profiles...</p>
            ) : error ? (
              <p className="mt-4 text-red-500">{error}</p>
            ) : profiles.length > 0 ? (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {profiles.map((profile) => (
                  <MultiActionAreaCard
                    key={profile.user_id}
                    profile={profile}
                    initialRequestSent={sentRequests[profile.user_id] || false}
                    handleRedirect={handleRedirect} // Pass handleRedirect to the card
                  />
                ))}
              </div>
            ) : (
              <p className="mt-4 text-gray-500">No profiles found.</p>
            )}
          </div>
        </div>
      </main>

      {/* Popup for Unauthorized Access */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg text-center">
            <h2 className="text-lg font-bold mb-4">You are not authorized</h2>
            <p className="text-gray-700 mb-4">Please sign in to continue.</p>
            <button
              onClick={handlePopupClose}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Ok
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
