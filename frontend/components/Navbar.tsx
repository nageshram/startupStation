import { Menu, Framer, X } from 'lucide-react'; // Optional: for icons (install with `npm i lucide-react`)
import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);
  const location = useLocation();

  const openMenu = () => {
    setMenuOpen(true);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleClickOutside = (e) => {
    if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
      closeMenu();
    }
  };

  // Add event listener for clicks outside when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <nav className="w-full bg-white/90 backdrop-blur-md border-b border-neutral-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br text-gray-800 from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
              <Framer />
            </div>
            <span className="text-2xl font-bold text-gray-800">Startup Stn</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-gray-400 font-medium transition-colors duration-200">Home</Link>
            <Link to="/about" className="text-gray-700 hover:text-gray-400 font-medium transition-colors duration-200">About</Link>
            <Link to="/contact" className="text-gray-700 hover:text-gray-400 font-medium transition-colors duration-200">Contact</Link>
            <Link to="/login" className="text-pink-500 px-2 py-2 rounded-md font-medium transition-all">Login</Link>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <button
              onClick={openMenu}
              className="text-gray-700 p-2"
              aria-label="Open Menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            {menuOpen && (
              <div ref={mobileMenuRef} className="absolute top-16 right-0 w-48 bg-white rounded-lg shadow-xl z-50">
                <div className="flex justify-end p-2 absolute right-0">
                  <button onClick={closeMenu} className="text-gray-700">
                    <X />
                  </button>
                </div>
                <div className="flex flex-col space-y-2 p-4">
                  <Link to="/" onClick={closeMenu} className="text-gray-700 hover:text-pink-700">Home</Link>
                  <Link to="/about" onClick={closeMenu} className="text-gray-700 hover:text-pink-700">About</Link>
                  <Link to="/contact" onClick={closeMenu} className="text-gray-700 hover:text-pink-700">Contact</Link>
                  <Link to="/login" onClick={closeMenu} className="text-pink-500">Login</Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
