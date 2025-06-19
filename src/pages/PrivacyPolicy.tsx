const sectionData = [
  {
    icon: 'shield',
    title: 'Information We Collect',
    content: (
      <>
        <p>
          We collect information that you provide directly to us, including:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Name and contact information</li>
          <li>Account credentials</li>
          <li>Payment information</li>
          <li>Communication preferences</li>
          <li>Booking history and preferences</li>
        </ul>
      </>
    ),
  },
  {
    icon: 'insights',
    title: 'How We Use Your Information',
    content: (
      <>
        <p>
          We use the information we collect to:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Provide and maintain our services</li>
          <li>Process your bookings and payments</li>
          <li>Send you important updates and notifications</li>
          <li>Improve our services and user experience</li>
          <li>Communicate with you about your account</li>
        </ul>
      </>
    ),
  },
  {
    icon: 'groups',
    title: 'Information Sharing',
    content: (
      <>
        <p>
          We may share your information with:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Hosts for booking purposes</li>
          <li>Payment processors for transactions</li>
          <li>Service providers who assist our operations</li>
          <li>Legal authorities when required by law</li>
        </ul>
      </>
    ),
  },
  {
    icon: 'lock',
    title: 'Data Security',
    content: (
      <>
        <p>
          We implement appropriate security measures to protect your personal information,
          including encryption, secure servers, and regular security assessments.
        </p>
      </>
    ),
  },
  {
    icon: 'verified_user',
    title: 'Your Rights',
    content: (
      <>
        <p>
          You have the right to:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Access your personal information</li>
          <li>Correct inaccurate data</li>
          <li>Request deletion of your data</li>
          <li>Opt-out of marketing communications</li>
          <li>Export your data</li>
        </ul>
      </>
    ),
  },
];

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 opacity-90 z-0" />
        <svg className="absolute top-0 left-0 w-full h-full opacity-20 z-0" viewBox="0 0 1440 320"><path fill="#fff" fillOpacity="0.2" d="M0,160L48,170.7C96,181,192,203,288,197.3C384,192,480,160,576,165.3C672,171,768,213,864,229.3C960,245,1056,235,1152,218.7C1248,203,1344,181,1392,170.7L1440,160L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path></svg>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight drop-shadow-lg">Privacy Policy</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto font-medium drop-shadow">
              Your privacy is important to us. Learn how we collect, use, and protect your information.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-blue-100 space-y-12 animate-fade-in">
          {sectionData.map((section, idx) => (
            <section key={section.title} className="relative group">
              <div className="flex items-center mb-4">
                <span className="material-icons text-blue-500 text-3xl mr-3 drop-shadow">{section.icon}</span>
                <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  Section {idx + 1}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
                {section.title}
              </h2>
              <div className="prose prose-lg max-w-none text-gray-600">
                {section.content}
              </div>
              {idx < sectionData.length - 1 && (
                <div className="w-full border-b border-dashed border-blue-100 my-8" />
              )}
            </section>
          ))}

          {/* Contact Section */}
          <section className="relative group">
            <div className="flex items-center mb-4">
              <span className="material-icons text-blue-500 text-3xl mr-3 drop-shadow">mail</span>
              <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                Contact
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
              Contact Us
            </h2>
            <div className="prose prose-lg max-w-none text-gray-600">
              <p>
                If you have any questions about our Privacy Policy, please contact us at:
              </p>
              <div className="mt-4 p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200 shadow flex flex-col sm:flex-row items-center gap-6">
                <div className="flex-1">
                  <p className="font-semibold text-blue-900">StayFinder Privacy Team</p>
                  <p>Email: <span className="text-blue-700">privacy@stayfinder.com</span></p>
                  <p>Phone: <span className="text-blue-700">+1 (555) 123-4567</span></p>
                </div>
              </div>
            </div>
          </section>

          {/* Updates Section */}
          <section className="relative group">
            <div className="flex items-center mb-4">
              <span className="material-icons text-blue-500 text-3xl mr-3 drop-shadow">update</span>
              <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                Updates
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
              Updates to This Policy
            </h2>
            <div className="prose prose-lg max-w-none text-gray-600">
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any changes
                by posting the new Privacy Policy on this page and updating the "Last Updated" date.
              </p>
              <p className="mt-4 text-sm text-gray-500">
                Last Updated: {new Date().toLocaleDateString()}
              </p>
            </div>
          </section>
        </div>
      </div>
      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.8s cubic-bezier(0.4,0,0.2,1);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(32px); }
          to { opacity: 1; transform: none; }
        }
      `}</style>
    </div>
  );
};

export default PrivacyPolicy; 