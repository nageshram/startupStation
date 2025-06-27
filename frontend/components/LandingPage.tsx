import { FeaturedStartups } from "./FeaturedStartups";
import { Star } from "lucide-react";

export const LandingPage = () => {
  return (
<div id="landing"> 
            <div className="w-full min-h-screen bg-neutral-50">
    
      <section id="home" className="min-h-screen flex items-center py-12">
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
                <button className="bg-primary-600  border-2 border-gray-300 hover:bg-primary-700 text-gray-700 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                  Get Started
               </button>
                <button className="border-2 border-gray-300 hover:border-primary-600 text-gray-700 hover:text-primary-600 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105">
                  Learn More
    </button>
              </div>
            </div>
            <div className="relative">
              <div className="relative z-10 bg-white rounded-3xl p-8 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <svg viewBox="0 0 400 300" className="w-full h-auto">
                  <defs>
                    <linearGradient id="https://images.unsplash.com/photo-1484589065579-248aad0d8b13?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MzkyNDZ8MHwxfHNlYXJjaHwzfHxhYnN0cmFjdHxlbnwwfHx8fDE3NTAyOTgyNzJ8MA&ixlib=rb-4.1.0&q=80&w=1080" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3B82F6" />
                      <stop offset="100%" stopColor="#1D4ED8" />
                    </linearGradient>
                    <linearGradient id="https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MzkyNDZ8MHwxfHNlYXJjaHw0fHxhYnN0cmFjdHxlbnwwfHx8fDE3NTAyOTgyNzJ8MA&ixlib=rb-4.1.0&q=80&w=1080" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#F59E0B" />
                      <stop offset="100%" stopColor="#D97706" />
                    </linearGradient>
                  </defs>
                  <circle cx="100" cy="80" r="40" fill="url(https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MzkyNDZ8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdHxlbnwwfHx8fDE3NTAyOTgyNzJ8MA&ixlib=rb-4.1.0&q=80&w=1080)" opacity="0.8" />
                  <circle cx="300" cy="120" r="30" fill="url(https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MzkyNDZ8MHwxfHNlYXJjaHwyfHxhYnN0cmFjdHxlbnwwfHx8fDE3NTAyOTgyNzJ8MA&ixlib=rb-4.1.0&q=80&w=1080)" opacity="0.6" />
                  <rect x="50" y="150" width="60" height="80" rx="10" fill="#10B981" opacity="0.7" />
                  <rect x="140" y="130" width="80" height="100" rx="15" fill="#8B5CF6" opacity="0.6" />
                  <rect x="250" y="160" width="70" height="70" rx="12" fill="#EF4444" opacity="0.5" />
                  <path d="M 20 250 Q 100 200 200 250 T 380 240" stroke="#6366F1" strokeWidth="3" fill="none" opacity="0.8" />
                  <circle cx="200" cy="50" r="8" fill="#10B981" />
                  <circle cx="220" cy="60" r="6" fill="#F59E0B" />
                  <circle cx="180" cy="40" r="5" fill="#EF4444" />
                </svg>
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
                <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face" alt="Sarah Chen, Tech Executive"  className="w-16 h-16 rounded-full object-cover mr-4" />
                <div>
                  <h4 className="font-bold text-gray-900">Sarah Chen</h4>
                  <p className="text-gray-600">Former VP, Google</p>
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
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face" alt="Michael Rodriguez, Venture Capitalist"  className="w-16 h-16 rounded-full object-cover mr-4" />
                <div>
                  <h4 className="font-bold text-gray-900">Michael Rodriguez</h4>
                  <p className="text-gray-600">Partner, Sequoia Capital</p>
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
                <img src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MzkyNDZ8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWx8ZW58MHx8fHwxNzUwMzA0MzcwfDA&ixlib=rb-4.1.0&q=80&w=1080" alt="Emily Watson, Serial Entrepreneur"  className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-primary-100" />
                <div>
                  <h4 className="font-bold text-gray-900">Emily Watson</h4>
                  <p className="text-gray-600">Serial Entrepreneur</p>
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
  )
}

