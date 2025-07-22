import { authFetch } from './authFetch';
const BASE_URL = import.meta.env.VITE_API_URL

export async function checkLoginStatus() {

  /*const refreshPromise = await fetch(`${BASE_URL}/api/auth/refresh-token`, {
        method: 'POST',
        credentials: 'include',
      }); */
  let res = await fetch(`${BASE_URL}/api/auth/login-status`, { method: 'GET', credentials:"include"});
  if (res.ok) {
    const data = await res.json(); 
    return data.loggedIn;
  }
  return false;
} 