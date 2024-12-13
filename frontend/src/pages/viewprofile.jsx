import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "../components/header";

export default function ViewProfile() {
  const [profile, setProfile] = useState({
    username: "",
    about: "",
    role: "",
    skills: "",
    interests: "",
    bio: "",
    profileImage: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { username } = useParams();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        // Make the request to the backend to fetch the profile data
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/profile/${username}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Add token if needed
          },
        });

        setProfile({
          username: response.data.username || "",
          about: response.data.about || "",
          role: response.data.role || "",
          skills: response.data.skills || "",
          interests: response.data.interests || "",
          bio: response.data.bio || "",
          profileImage: response.data.profile_image || null, // Handle base64 image directly
        });

        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load profile");
        setLoading(false);
      }
    };

    fetchProfile(); // Fetch profile when component mounts

  }, [username]); // This hook runs whenever the username changes

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <Header />
      <div className="max-w-3xl mx-auto space-y-12 p-6">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold text-gray-900">Profile</h2>
          <p className="mt-1 text-sm text-gray-600">
            This is the public profile view.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            {/* Username */}
            <div className="sm:col-span-4">
              <label htmlFor="username" className="block text-sm font-medium text-gray-900">
                Username
              </label>
              <p
                id="username"
                name="username"
                className="mt-2 block w-full rounded-md bg-gray-100 px-3 py-1.5 text-base text-gray-900 sm:text-sm"
              >
                {profile.username || "N/A"}
              </p>
            </div>

            {/* Profile Image */}
            <div className="col-span-full">
              <label htmlFor="profileImage" className="block text-sm font-medium text-gray-900">
                Profile Image
              </label>
              <div className="mt-2 flex items-center gap-x-3">
                {profile.profileImage ? (
                  <img
                    src={profile.profileImage}
                    alt="Profile"
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <h2>Hi</h2>
                )}
              </div>
            </div>

            {/* Other Fields */}
            <div className="sm:col-span-3">
              <label htmlFor="role" className="block text-sm font-medium text-gray-900">
                Role
              </label>
              <p
                id="role"
                name="role"
                className="mt-2 block w-full rounded-md bg-gray-100 px-3 py-1.5 text-base text-gray-900 sm:text-sm"
              >
                {profile.role || "N/A"}
              </p>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="skills"
                className="block text-sm font-medium text-gray-900"
              >
                Skills
              </label>
              <p
                id="skills"
                name="skills"
                className="mt-2 block w-full rounded-md bg-gray-100 px-3 py-1.5 text-base text-gray-900 sm:text-sm"
              >
                {profile.skills || "N/A"}
              </p>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="interests"
                className="block text-sm font-medium text-gray-900"
              >
                Interests
              </label>
              <p
                id="interests"
                name="interests"
                className="mt-2 block w-full rounded-md bg-gray-100 px-3 py-1.5 text-base text-gray-900 sm:text-sm"
              >
                {profile.interests || "N/A"}
              </p>
            </div>

            <div className="sm:col-span-6">
              <label
                htmlFor="bio"
                className="block text-sm font-medium text-gray-900"
              >
                Bio
              </label>
              <p
                id="bio"
                name="bio"
                className="mt-2 block w-full rounded-md bg-gray-100 px-3 py-1.5 text-base text-gray-900 sm:text-sm"
              >
                {profile.bio || "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
