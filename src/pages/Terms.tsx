const sectionData = [
  {
    icon: 'gavel',
    title: '1. Acceptance of Terms',
    content: (
      <p>
        By accessing or using StayFinder's services, you agree to be bound by these Terms of Service
        and all applicable laws and regulations. If you do not agree with any of these terms, you
        are prohibited from using or accessing our services.
      </p>
    ),
  },
  {
    icon: 'person',
    title: '2. User Accounts',
    content: (
      <>
        <p>
          To use certain features of our service, you must register for an account. You agree to:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Provide accurate and complete information</li>
          <li>Maintain the security of your account</li>
          <li>Notify us immediately of any unauthorized use</li>
          <li>Accept responsibility for all activities under your account</li>
        </ul>
      </>
    ),
  },
  {
    icon: 'payments',
    title: '3. Booking and Payments',
    content: (
      <>
        <p>
          When making a booking through StayFinder:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>You agree to pay all fees and charges</li>
          <li>You understand our cancellation policies</li>
          <li>You accept responsibility for any damages</li>
          <li>You agree to comply with house rules</li>
        </ul>
      </>
    ),
  },
  {
    icon: 'home',
    title: '4. Host Responsibilities',
    content: (
      <>
        <p>
          As a host, you agree to:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Provide accurate listing information</li>
          <li>Maintain your property in good condition</li>
          <li>Honor confirmed bookings</li>
          <li>Comply with all applicable laws</li>
        </ul>
      </>
    ),
  },
  {
    icon: 'block',
    title: '5. Prohibited Activities',
    content: (
      <>
        <p>
          Users are prohibited from:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Violating any laws or regulations</li>
          <li>Posting false or misleading information</li>
          <li>Interfering with the service</li>
          <li>Harassing other users</li>
          <li>Attempting to gain unauthorized access</li>
        </ul>
      </>
    ),
  },
  {
    icon: 'copyright',
    title: '6. Intellectual Property',
    content: (
      <p>
        All content on StayFinder, including text, graphics, logos, and software, is the property
        of StayFinder or its content suppliers and is protected by international copyright laws.
      </p>
    ),
  },
  {
    icon: 'warning',
    title: '7. Limitation of Liability',
    content: (
      <p>
        StayFinder shall not be liable for any indirect, incidental, special, consequential, or
        punitive damages resulting from your use of or inability to use the service.
      </p>
    ),
  },
  {
    icon: 'edit',
    title: '8. Changes to Terms',
    content: (
      <>
        <p>
          We reserve the right to modify these terms at any time. We will notify users of any
          material changes via email or through the service.
        </p>
        <p className="mt-4 text-sm text-gray-500">
          Last Updated: {new Date().toLocaleDateString()}
        </p>
      </>
    ),
  },
];

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 opacity-90 z-0" />
        <svg className="absolute top-0 left-0 w-full h-full opacity-20 z-0" viewBox="0 0 1440 320"><path fill="#fff" fillOpacity="0.2" d="M0,160L48,170.7C96,181,192,203,288,197.3C384,192,480,160,576,165.3C672,171,768,213,864,229.3C960,245,1056,235,1152,218.7C1248,203,1344,181,1392,170.7L1440,160L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path></svg>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight drop-shadow-lg">Terms of Service</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto font-medium drop-shadow">
              Please read these terms carefully before using our services.
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
              Contact Information
            </h2>
            <div className="prose prose-lg max-w-none text-gray-600">
              <p>
                For questions about these Terms of Service, please contact us at:
              </p>
              <div className="mt-4 p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200 shadow flex flex-col sm:flex-row items-center gap-6">
                <div className="flex-1">
                  <p className="font-semibold text-blue-900">StayFinder Legal Team</p>
                  <p>Email: <span className="text-blue-700">legal@stayfinder.com</span></p>
                  <p>Phone: <span className="text-blue-700">+1 (555) 123-4567</span></p>
                </div>
              </div>
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

export default TermsOfService; 