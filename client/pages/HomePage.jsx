import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar1.jsx';
import ProfileDetails from '../components/ProfileDetails.jsx';
import StartupFeed from '../components/StartupFeed.jsx';
import MessagingPanel from '../components/MessagingPanel.jsx';
import { Menu } from 'lucide-react';
import { authFetch } from '../utils/authFetch.js';
import notificationSocket from '../utils/socket.js';

const HomePage = () => {
  const [user, setUser] = useState(null);
  const [errors, setErrors] = useState('');
  const [activeChatUser, setActiveChatUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [drawer, setDrawer] = useState(null);

  useEffect(() => {
    authFetch('/api/users', { method:"GET" })
      .then((res) => res.json())
      .then(setUser)
      .catch(() => setErrors('Failed to load user'));

    authFetch('/api/notifications', { method:"GET" })
      .then((res) => res.json())
      .then(setNotifications)
      .catch(() => setErrors('Failed to fetch notifications'));
  }, []);

  useEffect(() => {
    if (user?._id) {
      notificationSocket.emit('join-user', user._id);
      console.log("hello")

      notificationSocket.on('new-notification', (notification) => {
        setNotifications((prev) => [notification, ...prev]);
      });

      // Cleanup on unmount
      return () => {
        notificationSocket.off('new-notification');
      };
    }
  }, [user?._id]);

  return (
    <div className="min-h-screen md:mx-4 bg-gray-100 font-sans">
      <Navbar notifications={notifications} user={user} setErrors={setErrors} setNotifications={setNotifications} />

      {errors && (
        <div className="text-red-500 text-center mt-2 text-sm font-semibold">
          {errors}
        </div>
      )}

      {/* Mobile Drawer Menu */}
      <div className="md:hidden flex justify-around py-2 bg-white shadow">
        <button
          onClick={() => setDrawer(drawer === 'profile' ? null : 'profile')}
          className={`px-4 py-2 rounded ${drawer === 'profile' ? 'bg-pink-100' : ''}`}
        >
          Profile
        </button>
        <button
          onClick={() => setDrawer(drawer === 'messages' ? null : 'messages')}
          className={`px-4 py-2 rounded ${drawer === 'messages' ? 'bg-pink-100' : ''}`}
        >
          Messages
        </button>
        <button
          onClick={() => setDrawer(drawer === 'feed' ? null : 'feed')}
          className={`px-4 py-2 rounded ${drawer === 'feed' ? 'bg-pink-100' : ''}`}
        >
          Startup
        </button>
      </div>

      {/* Main Content */}
      <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Left Column: Profile (hidden on small) */}
        <div className="hidden md:block sticky top-4 self-start h-fit">
          {user && <ProfileDetails user={user} setErrors={setErrors} setActiveChatUser={setActiveChatUser} />}
        </div>

        {/* Middle Column: Feed */}
        <div className="col-span-1 md:col-span-1">
          {/* On mobile, show feed only if drawer is null or 'feed' */}
          {(drawer === null || drawer === 'feed') && user && (
            <StartupFeed
              user={user}
              setErrors={setErrors}
              setActiveChatUser={setActiveChatUser}
            />
          )}
        </div>

        {/* Right Column: Messaging (hidden on small) */}
        <div className="hidden md:block sticky top-4 self-start h-fit">
          {user && (
            <MessagingPanel
              user={user}
              activeChatUser={activeChatUser}
              setActiveChatUser={setActiveChatUser}
              setErrors={setErrors}
            />
          )}
        </div>
      </div>

      {/* Mobile Conditional Rendering */}
      <div className="md:hidden px-4 pb-8">
        {drawer === 'profile' && user && (
          <ProfileDetails user={user} setErrors={setErrors} setActiveChatUser={setActiveChatUser} />
        )}
        {drawer === 'messages' && user && (
          <MessagingPanel
            user={user}
            activeChatUser={activeChatUser}
            setActiveChatUser={setActiveChatUser}
            setErrors={setErrors}
          />
        )}
      </div>
    </div>
  );
};

export default HomePage;
