let isRefreshing = false;
let refreshPromise = null;
const BASE_URL = import.meta.env.VITE_API_URL

export async function authFetch(url, options = {}) {
  const link = `${BASE_URL}${url.startsWith('/') ? url :'/'+ url}`

  let res = await fetch(link, { ...options, credentials: 'include'  });

  // If access token expired, try to refresh
  if (res.status === 401) {
    if (!isRefreshing) {
      isRefreshing = true;
      refreshPromise = await fetch(`${BASE_URL}/api/auth/refresh-token`, {
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
      res = await fetch(link, { ...options, credentials: 'include' });
    }
  }
  return res;
}