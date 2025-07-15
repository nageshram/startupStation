import { Routes, Route } from 'react-router-dom';
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
import Requests from '../components/Requests.tsx';
import { ToastContainer } from 'react-toastify';
import FounderTaskBoard from '../pages/FounderTaskBoard.tsx'
import DevTaskBoard from '../pages/DevTaskBoard.tsx'
import 'react-toastify/dist/ReactToastify.css';
import StartupManager from '../pages/StartupManager.tsx'
import AllUsers from '../pages/AllUsers.tsx'
import AllStartups from '../pages/AllStartups.tsx'
import { UserProvider } from '../pages/UserContext.tsx'
import InvestorAnalytics from '../pages/InvestorAnalytics.tsx';
import FounderAnalytics from '../pages/FounderAnalytics.tsx'
import Documents from '../pages/Documents.tsx'

function App() {

  
  return (
       <>
                    <ToastContainer
                        position="top-right" />
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
              <UserProvider>
              <Dashboard />
              </UserProvider>
            </ProtectedRoute>
          }
        >

          <Route path='' element={ <UpdateProfile/> } />
          <Route path='requests' element ={<Requests /> } />
          <Route path='founder-tasks' element={<FounderTaskBoard  />} />
          <Route path='dev-tasks' element={<DevTaskBoard /> } />
          <Route path='manage-startup' element={ <StartupManager /> } />
          <Route path='all-startups' element={ <AllStartups /> } />
          <Route path='all-users' element={ <AllUsers /> } />
          <Route path='investor-analytics' element={ <InvestorAnalytics /> } />
          <Route path='founder-analytics' element={ <FounderAnalytics /> } />
          <Route path='documents' element={ <Documents /> } />

          </Route>
          
          </Routes>
            </>
  )
}

export default App
