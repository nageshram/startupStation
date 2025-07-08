import { FeaturedStartups } from "./FeaturedStartups";
import { Star } from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";

export const LandingPage = () => {
  return (
 <>
<div id="landing"> 
    <div className="w-full min-h-screen bg-neutral-50">
    
      <section id="home" className="min-h-screen flex items-center  bg-violet-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-6xl font-bold text-neutral-900 leading-tight">
                  Empowering the
                  <span className="text-primary-600 font-bold"> Next Generation</span>
                  <br />of Startups
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Connect with mentors, access funding opportunities, and join a thriving community of entrepreneurs building the future.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-purple-200  border-2 border-purple-700 hover:bg-gray-100 hover:border-gray-500 text-gray-700 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                  Get Started
               </button>
                <button className="border-2 border-gray-300 hover:border-primary-600 text-gray-700 hover:text-primary-600 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105">
                  Learn More
    </button>
              </div>
            </div>
            <div className="relative">
              <div className="relative z-10 rounded-3xl p-8  transform rotate-3 hover:rotate-0 transition-transform duration-500">
               
                <img src="../src/assets/6304080.jpg" className="flex w-full h-auto bg-amber-50 rounded-2xl items-center" alt="graphics people building startups" />
              
              </div>
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary-100 rounded-full opacity-50 animate-pulse"></div>
              <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-yellow-100 rounded-full opacity-40 animate-pulse delay-1000"></div>
            </div>
          </div>
        </div>
      </section>
    
     <FeaturedStartups />
    
      <section className="py-20 bg-gradient-to-r from-primary-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Mentors Say</h2>
            <p className="text-xl text-gray-600">Insights from industry leaders who guide our startups</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-8 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-neutral-100">
              <div className="flex items-center mb-6">
                <img src="https://imgs.search.brave.com/EjXqqOzuVf1ujOJ91Xk0EuYW8kWc2WFPj0zjWhOXiNg/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4u/ZGVjb2hlcmUuYWkv/Y3VzX1FtZVJSczdD/cnBRTDA2LXN0YWJs/ZXZpZGVvL291dHB1/dHMvMTcyNjc5MTg1/MjY4My90aHVtYm5h/aWwud2VicA" alt="Sarah Chen, Tech Executive"  className="w-16 h-16 rounded-full object-cover mr-4" />
                <div>
                  <h4 className="font-bold text-gray-900">Narendra Modi</h4>
                  <p className="text-gray-600">Prime Minister of india</p>
                </div>
              </div>
              <p className="text-gray-700 italic mb-4">"The startup ecosystem here is incredible. I've seen founders transform their ideas into billion-dollar companies with the right mentorship and community support."</p>
              <div className="flex text-yellow-500">
               
                <Star className="text-amber-400" />
                 <Star />
                  <Star />
                   <Star />
              </div>
            </div>
            <div className="bg-white rounded-lg p-8 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-neutral-100">
              <div className="flex items-center mb-6">
                <img src="https://bmsit.ac.in/public/idcard/2666.JPG" alt="Michael Rodriguez, Venture Capitalist"  className="w-16 h-16 rounded-full object-cover mr-4" />
                <div>
                  <h4 className="font-bold text-gray-900">Reshma C R</h4>
                  <p className="text-gray-600">Professor at BMSIT</p>
                </div>
              </div>
              <p className="text-gray-700 italic mb-4">"What sets this platform apart is the quality of entrepreneurs and the depth of support they receive. Every startup here has the potential to disrupt industries."</p>
              <div className="flex text-yellow-400">
                
                <Star />
                 <Star />
                  <Star />
                   <Star />
                   <Star />
              </div>
            </div>
            <div className="bg-white rounded-lg p-8 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-neutral-100">
              <div className="flex items-center mb-6">
                <img src="https://bmsit.ac.in/public/idcard/990.JPG" alt="Emily Watson, Serial Entrepreneur"  className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-primary-100" />
                <div>
                  <h4 className="font-bold text-gray-900">Sridevi M</h4>
                  <p className="text-gray-600">Professor at BMSIT</p>
                </div>
              </div>
              <p className="text-gray-700 italic mb-4">"Having built three successful exits, I can say that the mentorship and network here accelerates growth like nothing else. It's a game-changer for founders."</p>
              <div className="flex text-yellow-400">
               
                <Star />
                 <Star />
                  <Star />
                   <Star />
              </div>
            </div>
          </div>
        </div>
      </section>
     
            </div> 
        </div>
        
        </>
  )
}

