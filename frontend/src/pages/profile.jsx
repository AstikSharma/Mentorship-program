/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import Header from "../components/header";

export default function Profile() {
  const [profile, setProfile] = useState({
    username: "",
    about: "",
    role: "",
    skills: "",
    interests: "",
    bio: "",  // Add bio to the state
    profileImage: null, // Stores the base64 image string or null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Fetch profile when component mounts
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/users/profile",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setProfile({
          username: response.data.username || "",
          about: response.data.about || "",
          role: response.data.role || "",
          skills: response.data.skills || "",
          interests: response.data.interests || "",
          bio: response.data.bio || "", // Add bio to state initialization
          profileImage: response.data.profile_image || null, // Handle base64 image directly
        });

        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load profile");
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setProfile((prev) => ({ ...prev, [name]: files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (
      !profile.role ||
      (profile.role !== "mentor" && profile.role !== "mentee")
    ) {
      setError("Please select a valid role: mentor or mentee.");
      return;
    }

    try {
      const formData = new FormData();

      // Append all fields except profileImage
      for (const key in profile) {
        if (key !== "profileImage" && profile[key] !== null) {
          formData.append(key, profile[key]);
        }
      }

      // Append the profileImage only if a new file is uploaded
      if (profile.profileImage instanceof File) {
        formData.append("profileImage", profile.profileImage);
      }

      // Send PUT request to update the profile
      const response = await axios.put(
        "http://localhost:5000/api/users/profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSuccess(true);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Error in updating profile:", err);
      setError(err.response?.data?.message || "Error in updating profile");
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete your profile and account?"
      )
    ) {
      return;
    }

    try {
      await axios.delete("http://localhost:5000/api/users/profile", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      alert("Profile and account deleted successfully!");
      localStorage.removeItem("token");
      window.location.href = "/signup"; // Redirect to signup after deletion
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to delete profile and account"
      );
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <Header />
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-12 p-6">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold text-gray-900">Profile</h2>
          <p className="mt-1 text-sm text-gray-600">
            This information will be displayed publicly, so be careful what you
            share.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            {/* Username */}
            <div className="sm:col-span-4">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-900"
              >
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
              <label
                htmlFor="profileImage"
                className="block text-sm font-medium text-gray-900"
              >
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
                  <UserCircleIcon className="h-12 w-12 text-gray-300" />
                )}
                <input
                  type="file"
                  name="profileImage"
                  id="profileImage"
                  onChange={handleFileChange}
                  className="block text-sm text-gray-600"
                />
              </div>
            </div>

            {/* Role */}
            <div className="sm:col-span-3">
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-900"
              >
                Role
              </label>
              <select
                id="role"
                name="role"
                value={profile.role}
                onChange={handleInputChange}
                className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 sm:text-sm"
              >
                <option value="">Select Role</option>
                <option value="mentor">Mentor</option>
                <option value="mentee">Mentee</option>
              </select>
            </div>

            {/* Skills */}
            <div className="sm:col-span-3">
              <label
                htmlFor="skills"
                className="block text-sm font-medium text-gray-900"
              >
                Skills
              </label>
              <input
                id="skills"
                name="skills"
                type="text"
                value={profile.skills}
                onChange={handleInputChange}
                className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 sm:text-sm"
                placeholder="e.g., JavaScript, Python"
              />
            </div>

            {/* Interests */}
            <div className="sm:col-span-3">
              <label
                htmlFor="interests"
                className="block text-sm font-medium text-gray-900"
              >
                Interests
              </label>
              <input
                id="interests"
                name="interests"
                type="text"
                value={profile.interests}
                onChange={handleInputChange}
                className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 sm:text-sm"
                placeholder="e.g., AI, Web Development"
              />
            </div>

            {/* Bio (New field added here) */}
            <div className="sm:col-span-6">
              <label
                htmlFor="bio"
                className="block text-sm font-medium text-gray-900"
              >
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                value={profile.bio}
                onChange={handleInputChange}
                rows={4}
                className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 sm:text-sm"
                placeholder="Tell us about yourself..."
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-between">
          <button
            type="button"
            onClick={handleDelete}
            className="rounded-md bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600"
          >
            Delete Profile
          </button>
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
          >
            Save Profile
          </button>
        </div>

        {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
        {success && (
          <p className="mt-4 text-sm text-green-500">
            Profile updated successfully!
          </p>
        )}
      </form>
    </div>
  );
}
