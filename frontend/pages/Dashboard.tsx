import { useEffect, useState } from "react";
import  notificationSocket   from "../utils/socket";
import { authFetch } from '../utils/authFetch.js'
import Navbar1  from '../components/Navbar1.tsx'
import Sidebar from '../components/Sidebar.tsx'
import { Outlet  } from "react-router-dom"

const Dashboard = ()=>{

    const [user, setUser] = useState({});
    const [notifications, setNotifications] = useState([]);
    const [errors, setErrors] = useState("")

    useEffect(() => {
        authFetch('http://localhost:5000/api/users', { method:"GET" })
          .then((res) => res.json())
          .then(setUser)
          .catch(() => setErrors('Failed to load user'));
    
        authFetch('http://localhost:5000/api/notifications', { method:"GET" })
          .then((res) => res.json())
          .then(setNotifications)
          .catch(() => setErrors('Failed to fetch notifications'));
      }, []);
    
      useEffect(() => {
        if (user?._id) {
          notificationSocket.emit('join-user', user._id);
          console.log("hello");
    
          notificationSocket.on('new-notification', (notification) => {
            setNotifications((prev) => [notification, ...prev]);
          });
    
          // Cleanup on unmount
          return () => {
            notificationSocket.off('new-notification');
          };
        }
      }, [user?._id]);
    
    return(

            <>
            
            <section className="min-h-screen my-1 rounded bg-gray-100">
            <Navbar1 user={user} setErrors={setErrors} notifications={notifications} setNotifications={setNotifications} />

            <div className=" flex flex-row gap-2 mx-2">
            <Sidebar  user={user} />

            <div className="outlet w-full bg-gray-100 m-1 ">
            <Outlet classname="w-full" />
            </div>

            </div>

            </section>
            
            </>


    );
};


export default Dashboard;