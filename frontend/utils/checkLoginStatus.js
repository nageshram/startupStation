import { authFetch } from './authFetch';

export async function checkLoginStatus() {

  const refreshPromise = await fetch('http://localhost:5000/api/auth/refresh-token', {
        method: 'POST',
        credentials: 'include',
      });
  let res = await authFetch('http://localhost:5000/api/auth/login-status', { method: 'GET' });
  if (res.ok) {
    const data = await res.json();
    return data.loggedIn;
  }
  return false;
} 