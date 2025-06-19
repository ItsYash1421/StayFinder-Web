const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About StayFinder</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Your trusted platform for finding the perfect stay, anywhere in the world.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              At StayFinder, we believe everyone deserves to find their perfect home away from home. 
              Our mission is to connect travelers with unique and comfortable accommodations while 
              providing hosts with a reliable platform to share their spaces.
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <span className="material-icons text-4xl text-blue-600 mb-3">hotel</span>
                <h3 className="text-xl font-semibold text-gray-900">10K+</h3>
                <p className="text-gray-600">Listings</p>
              </div>
              <div className="text-center">
                <span className="material-icons text-4xl text-blue-600 mb-3">people</span>
                <h3 className="text-xl font-semibold text-gray-900">50K+</h3>
                <p className="text-gray-600">Happy Users</p>
              </div>
              <div className="text-center">
                <span className="material-icons text-4xl text-blue-600 mb-3">location_on</span>
                <h3 className="text-xl font-semibold text-gray-900">100+</h3>
                <p className="text-gray-600">Cities</p>
              </div>
              <div className="text-center">
                <span className="material-icons text-4xl text-blue-600 mb-3">star</span>
                <h3 className="text-xl font-semibold text-gray-900">4.8</h3>
                <p className="text-gray-600">Average Rating</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
          <div className="prose prose-lg max-w-none text-gray-600">
            <p>
              StayFinder was born from a simple idea: making travel accommodation more accessible 
              and enjoyable for everyone. What started as a small project has grown into a trusted 
              platform connecting hosts and travelers worldwide.
            </p>
            <p>
              Our team of travel enthusiasts and tech innovators work tirelessly to ensure that 
              every stay booked through StayFinder is memorable and comfortable. We believe in 
              the power of community and the joy of discovering new places.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <span className="material-icons text-4xl text-blue-600 mb-4">security</span>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Trust & Safety</h3>
            <p className="text-gray-600">
              We prioritize the safety and security of our users with verified listings and secure payments.
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <span className="material-icons text-4xl text-blue-600 mb-4">support_agent</span>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">24/7 Support</h3>
            <p className="text-gray-600">
              Our dedicated support team is always ready to help you with any questions or concerns.
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <span className="material-icons text-4xl text-blue-600 mb-4">verified_user</span>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Verified Hosts</h3>
            <p className="text-gray-600">
              Every host on our platform is verified to ensure quality and reliability.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About; 