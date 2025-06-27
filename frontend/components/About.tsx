import { Group, DollarSign, School, Users } from "lucide-react";


 export const About = ()=>
{
    return( 
          <section id="about" className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">About Init Startup Staion</h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  We are the premier platform connecting ambitious entrepreneurs with world-class mentors, investors, and resources. Since 2018, we've helped over 500 startups raise $2.3B in funding and scale their operations globally.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Our mission is to democratize entrepreneurship by providing equal access to the tools, knowledge, and network needed to build successful companies that solve real-world problems.
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-primary-50 rounded-lg p-6">
                  <div className="w-12 h-12 bg-pink-600 rounded-lg flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined font-semibold text-white"> <Group /> </span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">100+ Startups</h3>
                  <p className="text-gray-600">Supported and scaled</p>
                </div>
                <div className="bg-green-50 rounded-md p-6 hover:shadow-md transition-all duration-300 hover:bg-green-100 border border-green-100">
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined font-semibold text-white"><DollarSign /> </span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">1Cr+ Raised</h3>
                  <p className="text-gray-600">Total funding secured</p>
                </div>
                <div className="bg-blue-50 rounded-md p-6 hover:shadow-md transition-all duration-300 hover:bg-blue-100 border border-blue-100">
                  <div className="w-12 h-12 bg-blue-400 rounded-lg flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-white"><School /></span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">200+ Mentors</h3>
                  <p className="text-gray-600">Industry experts</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-6">
                  <div className="w-12 h-12 bg-purple-600 rounded-md flex items-center justify-center mb-4 shadow-sm">
                    <span className="material-symbols-outlined font-semibold text-white"><Users /></span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">50+ Countries</h3>
                  <p className="text-gray-600">Global reach</p>
                </div>
              </div>
            </div>
            <div className="relative sm:items-center">
              <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop" alt="Team collaboration and innovation"  className="rounded-2xl shadow-2xl" />
              <div className="absolute -bottom-10 -left-1 bg-blue-600 text-white p-6 rounded-xl shadow-lg">
                <h4 className="font-bold text-lg mb-1">Join Our Community</h4>
                <p className="text-white-100">Where ideas become reality</p>
              </div>
            </div>
          </div>
        </div>
      </section>
        
    );
}