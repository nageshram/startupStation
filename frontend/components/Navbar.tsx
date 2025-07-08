import { Menu, Framer, CrossIcon } from 'lucide-react'; // Optional: for icons (install with `npm i lucide-react`)
import { Link, useLocation} from 'react-router-dom'
import { useState, useEffect, useRef } from "react"

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const mobileMenu = useRef(null);

  
  const openMenu = ()=>
  {
    mobileMenu.current.classList.remove('hidden')
    mobileMenu.current.classList.add('block')
    
  }

  const closeMenu = () =>
  {
    mobileMenu.current.classList.remove('block')
    mobileMenu.current.classList.add('hidden')
  }


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

            
            <div className="hidden md:flex items-center space-x-6 "  >
              <button className="text-gary-700 hover:text-gray-400 font-medium transition-colors duration-200 relative after:content-[''] after:absolute after:h-0.5 after:w-0 after:bg-primary-600 after:left-0 after:-bottom-1 hover:after:w-full after:transition-all after:duration-300" > <Link to="/">Home</Link> </button>
              <button className="text-gray-700 hover:text-gray-400 font-medium transition-colors duration-200 relative after:content-[''] after:absolute after:h-0.5 after:w-0 after:bg-primary-600 after:left-0 after:-bottom-1 hover:after:w-full after:transition-all after:duration-300" ><Link to="/about">About</Link></button>
              <button className="text-gray-700 hover:text-gray-400 font-medium transition-colors duration-200" > <Link to="/contact">Contact</Link>    </button>
              <button className=" hover:text-gray-700 text-pink-500 px-2 py-2 rounded-md font-medium transition-all ">
             <Link to="/login">Login</Link>
              </button>
            </div>
  
            <div className="md:hidden">
              <details className="relative">
                <summary className="list-none cursor-pointer p-2">
                  <span  onClick={openMenu} ><Menu className="material-symbols-outlined text-gray-700" /></span>
                </summary>
                <div ref={mobileMenu} className='hidden'>
                <div className="absolute transition-all right-0 top-12 bg-white rounded-lg shadow-xl border border-gray-200 py-4 w-35 z-50">
                  <button onClick={closeMenu} className="block w-full text-center px-4 py-2 text-neutral-700 hover:bg-neutral-100 transition-colors duration-200"><Link to="/">Home</Link></button>
                  <button onClick={closeMenu} className="block w-full text-center px-4 py-2 text-neutral-700 hover:bg-neutral-100 transition-colors duration-200" ><Link to="/about">About</Link></button>
                  <button onClick={closeMenu} className="block w-full text-center px-4 py-2 text-neutral-700 hover:bg-neutral-100 transition-colors duration-200" ><Link to="/contact">Contact</Link></button>
                  <button onClick={closeMenu} className="block w-full text-center px-4 py-2 bg-primary-600 text-blue-500 mx-1 rounded-lg mt-2"><Link to="/login">Login</Link></button> 
                </div>
                </div>
              </details>
            </div>
          </div>
        </div>
      </nav>
  );
};

export default Navbar;
