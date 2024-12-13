import { useEffect, useState } from "react";
import axios from "axios";
import Header from "./header";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/notifications`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setNotifications(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/notifications/${id}/read`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      // Remove the notification from the local state
      setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <Header />
      <div className="max-w-3xl mx-auto mt-6 p-4">
        <h1 className="text-2xl font-bold mb-4">Notifications</h1>
        <ul>
          {notifications.map((notif) => (
            <li
              key={notif.id}
              className="p-4 mb-4 bg-gray-100 rounded shadow hover:shadow-lg"
            >
              <p>{notif.message}</p>
              <button
                onClick={() => markAsRead(notif.id)}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Mark as Read
              </button>
            </li>
          ))}
        </ul>
        {notifications.length === 0 && <p>No new notifications.</p>}
      </div>
    </>
  );
}
