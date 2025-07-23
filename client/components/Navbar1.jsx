import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bell, LogOut, Search } from 'lucide-react';
import { authFetch } from '../utils/authFetch';
const BASE_URL = import.meta.env.VITE_API_URL

const Navbar = ({ user, notifications = [], setErrors, setNotifications, toggleSidebar }) => {
 // const [search, setSearch] = useState('');
  //const [notifications, setNotifications] = useState(notification || []);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch(`${BASE_URL}/api/auth/logout`, { method: 'POST', credentials: 'include' });
      
      navigate('/login');
      document.location.reload();
    } catch (err) {
      setErrors('Logout failed');
    }
  };
  const markAllAsSeen = async () => {
    try {
      await authFetch('/api/notifications/seen', {
        method: 'PUT',
        credentials: 'include',
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, seen: true })));
    } catch (err) {
      setErrors && setErrors('Failed to mark notifications as seen');
    }
  };

  const clearNotifications = async () => {
    try {   
          const res = await authFetch('/api/notifications/clear', {
        method: 'DELETE'});
      if (res.ok) {
        console.log("Notifications cleared successfully");
        //setNotifications([]);
      }

    }
   catch(arr){
    console.error('Failed to clear notifications', arr);
    setErrors && setErrors('Failed to clear notifications');
   }
  }

  useEffect(() => {
    if (dropdownOpen && notifications.length > 0) {
  
     setTimeout(()=>{ markAllAsSeen(); clearNotifications(); },10000); 
    }
    // eslint-disable-next-line
  }, [dropdownOpen]);

  return (
    <header className="flex justify-between items-center px-4 py-2 bg-white shadow-md z-20 relative top-0 left-0 right-0">
     
     { currentPath.includes('dashboard') && (
       <button
        onClick={toggleSidebar}
        className="sm:hidden text-gray-700 focus:outline-none"
        aria-label="Toggle sidebar"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
     )}
     
      <div
        className="text-pink-700 md:font-extrabold font-bold  text-xl cursor-pointer"
        onClick={() => navigate('/')}
      >
        Startup Stn.
      </div>
      

      <div className="flex items-center gap-4">
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="relative items-center justify-center p-2 rounded-full hover:bg-gray-100 focus:outline-none"
          >
            <Bell className="text-pink-700 hover:text-pink-900" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 text-xs bg-red-600 text-white px-1 rounded-full">
                {notifications.filter(n => !n.seen).length}
              </span>
            )}
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg p-2 z-50">
              <h4 className="font-bold text-gray-700 mb-2">Notifications</h4>
              <div className="max-h-60 overflow-y-auto space-y-2">
                {notifications.length > 0 ? (
                  notifications.filter(n => !n.seen).map((note, i) => (
                    <div
                      key={note._id}
                      className="text-sm text-gray-600 border-b py-1 last:border-none overflow-ellipsis"
                    >
                      {note.message}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 italic text-sm">No new notifications</p>
                )}
              </div>
            </div>
          )}
        </div>

       { currentPath === '/home' ? (  <button 
          onClick={() => { navigate('/dashboard') } }
          className="text-gray-700 hover:text-pink-700 font-semibold flex items-center gap-1"
        >
           
          <img
                    src={  `${BASE_URL}/api/upload/profile_pics/`+ user?.photo || "/default.jpg"} onError={e => { e.target.onerror = null; e.target.src = `${BASE_URL}/api/upload/profile_pics/default.jpg`; }}
                    alt="Founder"
                    className="w-5 h-5 rounded-full object-cover border"
                  /> 
                  <span className="hidden sm:block">Dashboard</span>
        </button> 
       ):( 
        <button 
          onClick={() =>{ navigate('/home');  }}
          className="text-gray-700 hover:text-pink-700 font-semibold flex items-center gap-1"
        >  
          <img
 src={  `${BASE_URL}/api/upload/profile_pics/`+ user?.photo || "/default.jpg"} onError={e => { e.target.onerror = null; e.target.src = `${BASE_URL}/api/upload/profile_pics/default.jpg`; }}
                    alt="Founder"
                    className="w-5 h-5 rounded-full object-cover border"
                  /> 
                  <span className="hidden sm:block">Home</span>
        </button>
       )}


        <button
          onClick={handleLogout}
          className="text-gray-600 hover:text-red-600"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
