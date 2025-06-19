const CookiePolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Cookie Policy</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Learn how we use cookies to improve your experience on StayFinder.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What Are Cookies</h2>
            <div className="prose prose-lg max-w-none text-gray-600">
              <p>
                Cookies are small text files that are placed on your device when you visit our website.
                They help us provide you with a better experience by enabling certain features and
                functionality.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Types of Cookies We Use</h2>
            <div className="prose prose-lg max-w-none text-gray-600">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Essential Cookies</h3>
                  <p>
                    Required for the website to function properly. They enable basic features like
                    page navigation and access to secure areas.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Functional Cookies</h3>
                  <p>
                    Remember your preferences and settings to provide a more personalized experience.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Analytics Cookies</h3>
                  <p>
                    Help us understand how visitors interact with our website by collecting and
                    reporting information anonymously.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Marketing Cookies</h3>
                  <p>
                    Used to track visitors across websites to display relevant advertisements.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Use Cookies</h2>
            <div className="prose prose-lg max-w-none text-gray-600">
              <p>
                We use cookies to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Remember your preferences and settings</li>
                <li>Keep you signed in</li>
                <li>Understand how you use our website</li>
                <li>Improve our services</li>
                <li>Show you relevant content and advertisements</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Managing Cookies</h2>
            <div className="prose prose-lg max-w-none text-gray-600">
              <p>
                You can control and manage cookies in your browser settings. However, please note that
                disabling certain cookies may affect the functionality of our website.
              </p>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">How to Manage Cookies</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Chrome: Settings → Privacy and Security → Cookies and other site data</li>
                  <li>Firefox: Options → Privacy & Security → Cookies and Site Data</li>
                  <li>Safari: Preferences → Privacy → Cookies and website data</li>
                  <li>Edge: Settings → Cookies and site permissions → Cookies</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Third-Party Cookies</h2>
            <div className="prose prose-lg max-w-none text-gray-600">
              <p>
                Some cookies are placed by third-party services that appear on our pages. We use
                these services to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Analyze website traffic</li>
                <li>Provide social media features</li>
                <li>Process payments</li>
                <li>Show relevant advertisements</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Updates to This Policy</h2>
            <div className="prose prose-lg max-w-none text-gray-600">
              <p>
                We may update this Cookie Policy from time to time. Any changes will be posted on this
                page with an updated revision date.
              </p>
              <p className="mt-4 text-sm text-gray-500">
                Last Updated: {new Date().toLocaleDateString()}
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <div className="prose prose-lg max-w-none text-gray-600">
              <p>
                If you have any questions about our Cookie Policy, please contact us at:
              </p>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="font-semibold">StayFinder Privacy Team</p>
                <p>Email: privacy@stayfinder.com</p>
                <p>Phone: +1 (555) 123-4567</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy; 