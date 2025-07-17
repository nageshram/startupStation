import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkLoginStatus } from '../utils/checkLoginStatus';

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkLoginStatus()
      .then((loggedIn) => {
        if (loggedIn) setIsAuth(true);
        else navigate('/login');
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading) return <div>Loading...</div>;
  return isAuth ? children : null;
};

export default ProtectedRoute;