import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import { HomeLayout } from "../components/HomeLayout"
import { LoginPage } from "../components/LoginPage"
import { SignupPage } from "../components/Signup"
import { LandingPage } from "../components/LandingPage";
import {Contact } from '../components/Contact.tsx'
import {About } from '../components/About.tsx'
import { ForgotPassword } from '../components/ForgotPassword.tsx'
import HomePage from '../pages/HomePage.tsx'
import ProtectedRoute from '../components/ProtectedRoute.tsx';
import UpdateProfile from '../pages/UpdateProfile.tsx';
import Dashboard from '../pages/Dashboard.tsx'

function App() {
  
  return (
    
                  <Routes>
                     <Route path="/" element={<HomeLayout />}>
                                      <Route path="" element={<LandingPage />} />
                                      <Route path="about" element={<About /> }/>
                                      <Route path="contact" element={<Contact />}/>
                          </Route>

                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/signup" element={<SignupPage />} />
                      <Route path="/reset-password" element={<ForgotPassword />}/>
                      <Route
                  path="/home"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>

          }
        />
        <Route path="/dashboard"
               element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >

          <Route path='updateprofile' element={ <UpdateProfile/> } />

          </Route>
          
          </Routes>

    
  )
}

export default App
