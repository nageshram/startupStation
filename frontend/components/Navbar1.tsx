import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bell, LogOut, Search } from 'lucide-react';
import { authFetch } from '../utils/authFetch';

const Navbar = ({ user, notification = [], setErrors }) => {
 // const [search, setSearch] = useState('');
  const [notifications, setNotifications] = useState(notification || []);
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
      await fetch('http://localhost:5000/api/auth/logout', { method: 'POST', credentials: 'include' });
      navigate('/login');
    } catch (err) {
      setErrors('Logout failed');
    }
  };
/*
  const handleSearch = (e) => {
    if (e.key === 'Enter' && search.trim()) {
      navigate(`/search?q=${search}`);
    }
  };
  */

  const markAllAsSeen = async () => {
    try {
      await fetch('http://localhost:5000/api/notifications/seen', {
        method: 'PUT',
        credentials: 'include',
      });
      // Optionally, update local state to mark all as seen or clear the badge
      // For example, you can set all notifications' seen property to true if you store it
    } catch (err) {
      setErrors && setErrors('Failed to mark notifications as seen');
    }
  };

  const clearNotifications = async () => {
    try {   
          const res = await authFetch('http://localhost:5000/api/notifications/clear', {
        method: 'DELETE'});
      if (res.ok) {
        console.log("Notifications cleared successfully");
        setNotifications([]);
      }

    }
   catch(arr){
    console.error('Failed to clear notifications', arr);
    setErrors && setErrors('Failed to clear notifications');
   }
  }

  useEffect(() => {
    if (dropdownOpen && notifications.length > 0) {
      markAllAsSeen();
      clearNotifications();
    }
    // eslint-disable-next-line
  }, [dropdownOpen]);

  return (
    <header className="flex justify-between items-center px-4 py-2 bg-white shadow-md z-20 relative top-0 left-0 right-0">
      <div
        className="text-pink-700 font-extrabold text-xl cursor-pointer"
        onClick={() => navigate('/')}
      >
        Startup Stn.
      </div>
      { /*
      <div className="flex-1 mx-4 max-w-md relative">
        <Search className="absolute left-3 top-3 text-gray-500" size={18} />
        <input
          type="text"
          placeholder="Search devs, investors, startups..."
          className="w-full pl-9 pr-4 py-2 border rounded-md focus:outline-pink-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleSearch}
        />
      </div> */ }

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
                      className="text-sm text-gray-600 border-b py-1 last:border-none"
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
                    src={  'http://localhost:5000/api/upload/profile_pics/'+ user?.photo || "/default.jpg"} onError={e => { e.target.onerror = null; e.target.src = 'http://localhost:5000/api/upload/profile_pics/default.jpg'; }}
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
 src={  'http://localhost:5000/api/upload/profile_pics/'+ user?.photo || "/default.jpg"} onError={e => { e.target.onerror = null; e.target.src = 'http://localhost:5000/api/upload/profile_pics/default.jpg'; }}
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
