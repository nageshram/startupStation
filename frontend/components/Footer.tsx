import { BookOpenText, IndianRupee, Rocket } from "lucide-react";


const Footer = ()=>
{
    return(
                <>
                 <footer className="bg-neutral-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">logo</span>
                </div>
                <span className="text-xl font-bold">Startup staion</span>
              </div>
              <p className="text-gray-400">Empowering entrepreneurs to build the future through innovation, mentorship, and community.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
              
    
    <li ><button className="hover:text-white transition-colors duration-200 flex items-center"><span className="material-symbols-outlined mr-2 text-sm"><Rocket /></span>For Startups</button></li>
    
  
    
    
    <li ><button className="hover:text-white transition-colors duration-200 flex items-center"><span className="material-symbols-outlined mr-2 text-sm"><IndianRupee /></span><span>For Investors</span></button></li>
    
    
  
    <li ><button className="hover:text-white transition-colors duration-200 flex items-center"><span className="material-symbols-outlined mr-2 text-sm"><BookOpenText /></span> For Resources</button></li>
    
              </ul>
            </div>
            </div>
            </div>
            
    </footer>
                </>
    );
}
export default Footer;