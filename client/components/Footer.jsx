import { BookOpenText, Framer, Github, IndianRupee, Linkedin, Rocket, Twitter } from "lucide-react";
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-neutral-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Startup Stn Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold"><Framer /></span>
              </div>
              <span className="text-xl font-bold">Startup Stn.</span>
            </div>
            <p className="text-gray-400">
              Empowering entrepreneurs to build the future through innovation, mentorship, and community.
            </p>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="font-semibold mb-4">Platform</h4>
            <ul className="text-gray-400 space-y-2">
              <li>
                <Link to="/startups" className="hover:text-white transition-colors duration-200 flex items-center">
                  <Rocket className="mr-2" /> Startups
                </Link>
              </li>
              <li>
                <Link to="/investors" className="hover:text-white transition-colors duration-200 flex items-center">
                  <IndianRupee className="mr-2" /> Investors
                </Link>
              </li>
              <li>
                <Link to="/resources" className="hover:text-white transition-colors duration-200 flex items-center">
                  <BookOpenText className="mr-2" /> Resources
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors duration-200 flex items-center">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/signup" className="hover:text-white transition-colors duration-200 flex items-center">
                  Signup
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media Links */}
          <div className="md:mt-1 pt-1 md:p-2 md:ml-6">
            <h4 className="font-semibold text-white mb-2">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <button className="w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-colors duration-200">
                  <Twitter />
                </button>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <button className="w-10 h-10 bg-blue-800 hover:bg-blue-900 text-white rounded-full flex items-center justify-center transition-colors duration-200">
                  <Linkedin />
                </button>
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <button className="w-10 h-10 bg-gray-900 hover:bg-black text-white rounded-full flex items-center justify-center transition-colors duration-200">
                  <Github />
                </button>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="text-center mt-8 text-gray-400">
          <p>&copy; {new Date().getFullYear()} Startup Stn. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
