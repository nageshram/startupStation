let isRefreshing = false;
let refreshPromise = null;

export async function authFetch(url, options = {}) {
  let res = await fetch(url, { ...options, credentials: 'include'  });

  // If access token expired, try to refresh
  if (res.status === 401) {
    if (!isRefreshing) {
      isRefreshing = true;
      refreshPromise = await fetch('http://localhost:5000/api/auth/refresh-token', {
        method: 'POST',
        credentials: 'include',
      }).then(r => {
        isRefreshing = false;
        return r.ok;
      });
    }
    const refreshed = await refreshPromise;
    if (refreshed) {
      // Retry original request
      res = await fetch(url, { ...options, credentials: 'include' });
    }
  }
  return res;
}