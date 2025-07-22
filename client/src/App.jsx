import { Routes, Route } from 'react-router-dom';
import './App.css'
import { HomeLayout } from "../components/HomeLayout"
import { LoginPage } from "../components/LoginPage"
import { SignupPage } from "../components/Signup"
import { LandingPage } from "../components/LandingPage";
import {Contact } from '../components/Contact.jsx'
import {About } from '../components/About.jsx'
import { ForgotPassword } from '../components/ForgotPassword.jsx'
import HomePage from '../pages/HomePage.jsx'
import ProtectedRoute from '../components/ProtectedRoute.jsx';
import UpdateProfile from '../pages/UpdateProfile.jsx';
import Dashboard from '../pages/Dashboard.jsx'
import Requests from '../components/Requests.jsx';
import { ToastContainer } from 'react-toastify';
import FounderTaskBoard from '../pages/FounderTaskBoard.jsx'
import DevTaskBoard from '../pages/DevTaskBoard.jsx'
import 'react-toastify/dist/ReactToastify.css';
import StartupManager from '../pages/StartupManager.jsx'
import AllUsers from '../pages/AllUsers.jsx'
import AllStartups from '../pages/AllStartups.jsx'
import { UserProvider } from '../pages/UserContext.jsx'
import InvestorAnalytics from '../pages/InvestorAnalytics.jsx';
import FounderAnalytics from '../pages/FounderAnalytics.jsx'
import Documents from '../pages/Documents.jsx'

function App() {

  return (
       <>
          <ToastContainer position="top-right" />
          <Routes>
          <Route path="/" element={<HomeLayout />}>
                      <Route path="" element={<LandingPage />} />
                      <Route path="about" element={<About /> }/>
                      <Route path="contact" element={<Contact />}/>
          </Route>

          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/reset-password" element={<ForgotPassword />}/>
          <Route path="/home" element={ <ProtectedRoute> <HomePage /></ProtectedRoute>} />
          <Route path="/dashboard" element={ <ProtectedRoute>
                <UserProvider>
                <Dashboard />
                </UserProvider>
                </ProtectedRoute> }>
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
export default App;
