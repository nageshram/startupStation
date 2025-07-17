import { useEffect, useState } from "react";
import notificationSocket from "../utils/socket";
import { authFetch } from "../utils/authFetch.js";
import Navbar1 from "../components/Navbar1.tsx";
import Sidebar from "../components/Sidebar.tsx";
import { Outlet, useLocation } from "react-router-dom";
import { useUser } from '../pages/UserContext.tsx'

const Dashboard = () => {
  const [notifications, setNotifications] = useState([]);
  const [errors, setErrors] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useUser();
  const location = useLocation();
  

   
  useEffect(() => {
   if(!user) return;
    authFetch("/api/notifications", { method: "GET" })
      .then((res) => res.json())
      .then(setNotifications)
      .catch(() => setErrors("Failed to fetch notifications"));
  }, []);
  
  
  useEffect(() => {
    
    if (user?._id) {
      notificationSocket.emit("join-user", user._id);

      notificationSocket.on("new-notification", (notification) => {
        setNotifications((prev) => [notification, ...prev]);
      });

      return () => {
        notificationSocket.off("new-notification");
      };
    }
  }, [user?._id]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") setSidebarOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  return (
    <section className="min-h-screen bg-gray-100 flex flex-col">
      {/* Navbar */}
      <Navbar1
        user={user}
        setErrors={setErrors}
        notifications={notifications}
        setNotifications={setNotifications}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="main-box flex flex-row">
        {/* Sidebar */}
        <div
          className={`
            fixed top left h-screen w-64 shadow-md z-50 max-sm:top-0 
            transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            sm:translate-x-0 sm:relative sm:h-screen sm:w-64 max-sm:bg-gray-800
          `}
        >
          {/* Close Button (mobile only) */}
          <div className="sm:hidden flex justify-between items-center p-5 border-b-2 border-gray-500">
            <span className="font-semibold text-xl text-gray-50">Startup Stn.</span>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-100 hover:text-pink-500 text-xl"
              aria-label="Close sidebar"
            >
              &times;
            </button>
          </div>

          <Sidebar user={user} />
        </div>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-gray-200 bg-opacity-100 z-40 sm:hidden"
          />
        )}

        {/* Main Content */}
        <div className="main-content w-full h-full flex ml-0 sm:ml-5 overflow-y-auto md:h-screen p-4">
          <Outlet />
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
