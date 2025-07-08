import { BookOpenText, Framer, Github, IndianRupee, Linkedin, Rocket, Twitter } from "lucide-react";


const Footer = ()=>
{
    return(
              
      <footer className="bg-neutral-900 text-white py-12 items-center justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold"> <Framer /> </span>
                </div>
                <span className="text-xl font-bold">Startup Stn.</span>
              </div>
              <p className="text-gray-400">Empowering entrepreneurs to build the future through innovation, mentorship, and community.</p>
            </div>
            <div >
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="text-gray-400 md:flex justify-around p-2 ">
              
    
    <li ><button className="hover:text-white transition-colors duration-200 p-2 flex items-center"><Rocket />Startups</button></li>
    
  
    
    
    <li ><button className="hover:text-white transition-colors duration-200  p-2 flex items-center"><IndianRupee />Investors</button></li>
    
    
  
    <li ><button className="hover:text-white transition-colors duration-200 p-2 flex items-center"><BookOpenText />Resources</button></li>
    
              </ul>
            </div>
            
                <div className="md:mt-1 pt-1 md:p-2 md:ml-6">
                  <h4 className="font-semibold text-white-900 mb-2">Follow Us</h4>
                  <div className="flex space-x-4">
                    <button className="w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-colors duration-200">
                      <Twitter />
                    </button>
                    <button className="w-10 h-10 bg-blue-800 hover:bg-blue-900 text-white rounded-full flex items-center justify-center transition-colors duration-200">
                      <Linkedin />
                    </button>
                    <button className="w-10 h-10 bg-gray-900 hover:bg-black text-white rounded-full flex items-center justify-center transition-colors duration-200">
                      <Github />
                    </button>
                  </div>
                </div>


              </div>
            </div>
            
    </footer>
              
    );
}
export default Footer;