import { Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { LandingPage } from "./LandingPage";
import { SignupPage } from "./Signup";
import { LoginPage } from "./LoginPage";
import { HomePage } from "../pages/HomePage";
import {Contact } from '../components/Contact.tsx'
import {About } from '../components/About.tsx'
export const HomeLayout =( )=>{
    return(
            <>
            <Navbar />

            <Routes>
                <Route path="" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/home" element={<HomePage />}  />
                <Route path="/about" element={<About /> }/>
                <Route path="/contact" element={<Contact />}/>
            </Routes>

            <Footer />
            
            </>
    );
}