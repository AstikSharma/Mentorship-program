/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { Disclosure, Menu } from "@headlessui/react";
import { Bars3Icon, BellIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Header() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    username: "",
    profileImage: null,
  });
  const [notificationsCount, setNotificationsCount] = useState(0);

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/profile/image`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setUserInfo({
          username: response.data.username,
          profileImage: response.data.profileImage,
        });
      } catch (err) {
        console.error("Failed to load profile image", err);
      }
    };

    fetchProfileImage();
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/notifications`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        // Count unread notifications
        const unreadCount = response.data.filter((notif) => !notif.read).length;
        setNotificationsCount(unreadCount);
      } catch (error) {
        console.error("Failed to load notifications count", error);
      }
    };

    fetchNotifications();
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("token"); // Remove token from localStorage
    navigate("/signin"); // Redirect to sign-in page
  };

  return (
    <Disclosure as="nav" className="bg-gray-800">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              {/* Logo Section */}
              <div className="flex items-center sm:items-stretch sm:justify-start">
                <div className="flex-shrink-0 text-white text-2xl">
                  <h2>Mentorship Platform</h2>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="hidden sm:flex sm:ml-auto">
                <button
                  onClick={() => navigate("/")}
                  className="ml-4 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
                >
                  Home
                </button>
              </div>

              {/* Profile and Notification Section */}
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                {/* Notifications */}
                <button
                  type="button"
                  className="rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  <span className="sr-only">View notifications</span>
                  {/* Bell Icon for Notifications */}
            <div className="relative">
              <button
                className="text-gray-300 hover:text-white focus:outline-none"
                onClick={() => navigate("/notifications")}
              >
                <BellIcon className="h-6 w-6" />
                {notificationsCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs font-bold rounded-full px-1">
                    {notificationsCount}
                  </span>
                )}
              </button>
            </div>
                </button>

                {/* Profile Dropdown */}
                <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                      <span className="sr-only">Open user menu</span>
                      <div className="flex items-center gap-4 text-white">
                        <span>{userInfo.username}</span>
                        {userInfo.profileImage ? (
                          <img
                            src={userInfo.profileImage}
                            alt="Profile"
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <p>Hi</p>
                        )}
                      </div>
                    </Menu.Button>
                  </div>
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => navigate("/profile")}
                          className={classNames(
                            active ? "bg-gray-100" : "",
                            "block w-full px-4 py-2 text-left text-sm text-gray-700"
                          )}
                        >
                          Your Profile
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={handleSignOut}
                          className={classNames(
                            active ? "bg-gray-100" : "",
                            "block w-full px-4 py-2 text-left text-sm text-gray-700"
                          )}
                        >
                          Sign out
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Menu>
              </div>
            </div>
          </div>
        </>
      )}
    </Disclosure>
  );
}
