import { authFetch } from '../utils/authFetch'
import { createContext, useContext, useEffect, useState } from 'react';
//import { toast } from 'react-toastify'

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const fetchUser = async ()=>{
    await authFetch("/api/users", { method: "GET" })
          .then((res) => res.json())
          .then(setUser)
          .catch(() => console.log("Failed to load user"));
  }

  useEffect(()=>{
      fetchUser();
      
  },[]);


  return (
    <UserContext.Provider value={{ user, setUser, refreshUser:fetchUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook for consuming user
export const useUser = () => useContext(UserContext);
