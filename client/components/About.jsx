import { Group, DollarSign, School, Users } from "lucide-react";

export const About = () => {
  return (
    <section id="about" className="py-15 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* About Section */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-violet-900 mb-4">
                About Startup Station
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed text-justify">
                Startup Station is the premier platform designed to connect aspiring entrepreneurs with world-class mentors, investors, and resources. Our goal is to foster an ecosystem that allows startups to thrive and grow, no matter where they are in their journey.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed text-justify">
                Since our inception in 2018, we've supported over 500 startups in raising more than $2.3 billion in funding. We have helped these startups scale their operations and achieve success on a global stage, fostering innovation and creating real-world impact.
              </p>
            </div>

            {/* Mission Section 
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-violet-900 mb-2">Our Mission</h2>
              <p className="text-lg text-gray-600 leading-relaxed text-justify">
                Our mission is to democratize entrepreneurship by offering equal access to the tools, knowledge, and network that are needed to build successful companies. By providing this support, we aim to empower startups to solve real-world problems, disrupt industries, and change lives.
              </p>
            </div>

            
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-violet-900 mb-2">Our Vision</h2>
              <p className="text-lg text-gray-600 leading-relaxed text-justify">
                We envision a future where every entrepreneur has the resources they need to turn their vision into reality. By connecting investors, mentors, and startups, we aim to create a world where innovation is accessible to everyone and anyone with a great idea has the opportunity to succeed.
              </p>
            </div> 
            */ }
             
            {/* Stats Section */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-primary-50 rounded-lg p-2">
                <div className="w-12 h-12 bg-pink-600 rounded-lg flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined font-semibold text-white">
                    <Group />
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">100+ Startups</h3>
                <p className="text-gray-600">Supported and scaled</p>
              </div>
              <div className="bg-green-50 rounded-md p-2 hover:shadow-md transition-all duration-300 hover:bg-green-100 border border-green-100">
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined font-semibold text-white">
                    <DollarSign />
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">1Cr+ Raised</h3>
                <p className="text-gray-600">Total funding secured</p>
              </div>
              <div className="bg-blue-50 rounded-md p-2 hover:shadow-md transition-all duration-300 hover:bg-blue-100 border border-blue-100">
                <div className="w-12 h-12 bg-blue-400 rounded-lg flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-white">
                    <School />
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">200+ Mentors</h3>
                <p className="text-gray-600">Industry experts</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-6">
                <div className="w-12 h-12 bg-purple-600 rounded-md flex items-center justify-center mb-4 shadow-sm">
                  <span className="material-symbols-outlined font-semibold text-white">
                    <Users />
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">50+ Countries</h3>
                <p className="text-gray-600">Global reach</p>
              </div>
            </div>
          </div>

          {/* Image Section */}
          <div className="relative sm:items-center">
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop"
              alt="Team collaboration and innovation"
              className="rounded-2xl shadow-2xl"
            />
            <div className="absolute -bottom-10 -left-1 bg-blue-600 text-white p-6 rounded-xl shadow-lg">
              <h4 className="font-bold text-lg mb-1">Join Our Community</h4>
              <p className="text-white-100">Where ideas become reality</p>
            </div>
          </div>


        </div>
      </div>
    </section>
  );
};
