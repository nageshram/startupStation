import { Routes, Route, Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export const HomeLayout =( )=>{
    return(
            <>
            <Navbar />
            <Outlet />
            <Footer />
            
            </>
    );
}