import { useEffect, useState } from 'react';

export const FeaturedStartups = () => {
  const [startups, setStartups] = useState([]);

  useEffect(() => {
    //  fetch request to get startups, adjust it according to your data source
    const fetchStartups = async () => {
      const res = await fetch('http://localhost:5000/api/startup');
      const data = await res.json();
      setStartups(data); // Assume the data is an array of startups
    };

    fetchStartups();
  }, []);

  // Limit to the first 6 startups
  const limitedStartups = startups.slice(0, 6);

  return (
    <>
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-violet-900 mb-4">
              Featured Startups
            </h2>
            <p className="text-xl text-gray-600">
              Discover innovative companies shaping the future
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {limitedStartups.map((startup, idx) => (
              <div
                key={startup._id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-gray-100"
              >
                <img
                  src={
                    startup.photo
                      ? `http://localhost:5000/api/upload/startup_pics/${startup.photo}`
                      : '/default.jpg'
                  }
                  alt={startup.name}
                  className="w-full h-48 object-cover"
                  onError={e => { e.target.onerror = null; e.target.src = 'http://localhost:5000/api/upload/startup_pics/default.jpg'; }}
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {startup.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{startup.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="bg-purple-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                      {startup.category}
                    </span>
                    <button className="text-gray-700 hover:text-blue-700">
                      Learn more
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
