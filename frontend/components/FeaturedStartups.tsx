

export const FeaturedStartups = ()=>
{
    return(
        <>
         <section className="py-20 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-violet-900 mb-4">Featured Startups</h2>
            <p className="text-xl text-gray-600">Discover innovative companies shaping the future</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-gray-100">
              <img src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=200&fit=crop" alt="TechFlow startup workspace"  className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">TechFlow</h3>
                <p className="text-gray-600 mb-4">Revolutionary AI-powered workflow automation platform transforming.</p>
                <div className="flex items-center justify-between">
                  <span className="bg-purple-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">AI/ML</span>
                  <button className="text-gray-700 hover:text-blue-700  ">Learn more</button>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-gray-100">
              <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=200&fit=crop" alt="EcoTech green technology"  className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">EcoTech</h3>
                <p className="text-gray-600 mb-4">Sustainable technology solutions for carbon-neutral manufacturing processes.</p>
                <div className="flex items-center justify-between">
                  <span className="bg-purple-100  px-3 py-1 rounded-full text-sm font-medium">GreenTech</span>
                  <button className="text-gray-700 hover:text-blue-700">Learn more</button>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-gray-100">
              <img src="https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=200&fit=crop" alt="HealthSync medical technology"  className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">HealthSync</h3>
                <p className="text-gray-600 mb-4">Digital health platform connecting patients with healthcare providers seamlessly.</p>
                <div className="flex items-center justify-between">
                  <span className="bg-purple-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">HealthTech</span>
                  <button className="text-gray-700 hover:text-blue-700">Learn more
    
    </button>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-gray-100">
              <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop" alt="FinanceNext financial technology"  className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">FinanceNext</h3>
                <p className="text-gray-600 mb-4">Next-generation blockchain-based financial services for the modern economy.</p>
                <div className="flex items-center justify-between">
                  <span className="bg-purple-100  px-3 py-1 rounded-full text-sm font-medium">FinTech</span>
                  <button className="text-gray-700 hover:text-blue-700">Learn more</button>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-gray-100">
              <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=200&fit=crop" alt="DataViz analytics platform"  className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">DataViz</h3>
                <p className="text-gray-600 mb-4">Advanced data visualization platform making complex analytics accessible to everyone.</p>
                <div className="flex items-center justify-between">
                  <span className="bg-purple-100  px-3 py-1 rounded-md text-sm font-medium">Analytics</span>
                  <button className="text-gray-700 hover:text-blue-700 flex items-center">Learn more</button>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-neutral-100">
              <img src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=200&fit=crop" alt="EduTech learning platform"  className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">EduTech</h3>
                <p className="text-gray-600 mb-4">Personalized learning experiences powered by adaptive AI technology.</p>
                <div className="flex items-center justify-between">
                  <span className="bg-purple-100  px-3 py-1 rounded-md text-sm font-medium">EdTech</span>
                  <button className="text-gray-700 hover:text-blue-700 font-medium">Learn more</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
        </>

    );
}