import { useState } from "react";
import { Link } from 'react-router-dom';

export default function LegalDocuments() {
  const [activeTab, setActiveTab] = useState("terms");

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg relative">
      {/* Fixed Nav Bar */}
      <nav className="fixed top-0 left-0 right-0 z-10 bg-white shadow-md px-4 py-2">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <div className="flex space-x-4">
            <button
              id="terms"
              className={`px-4 py-2 font-semibold ${
                activeTab === "terms" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-600"
              }`}
              onClick={() => setActiveTab("terms")}
            >
              Terms of Service
            </button>
            <button
              id="privacy"
              className={`px-4 py-2 font-semibold ${
                activeTab === "privacy" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-600"
              }`}
              onClick={() => setActiveTab("privacy")}
            >
              Privacy Policy
            </button>
          </div>
          <div className="flex space-x-4">
            <Link
              to="/"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              Sign In
            </Link>
            <Link
              to="/dashboard"
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-1 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </nav>

      {/* Content starts below the fixed nav */}
      <div className="mt-20"> {/* Add margin-top to push content below nav */}
        {activeTab === "terms" ? <TermsOfService /> : <PrivacyPolicy />}
      </div>
    </div>
  );
}


function TermsOfService() {
  return (
    <div className="space-y-4 text-gray-700">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Service</h1>
      <p className="text-lg text-gray-500 mb-8">Welcome to Quoten</p>
      
      <h3 className="text-lg font-semibold">1. Acceptance of Terms</h3>
      <p>By accessing or using Quoten, you agree to comply with and be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our services.</p>
      
      <h3 className="text-lg font-semibold">2. Description of Service</h3>
      <p>Quoten provides a platform for users to generate quotes using AI technology. This service is available to users who comply with these Terms.</p>
      
      <h3 className="text-lg font-semibold">3. User Accounts</h3>
      <p>Account Creation: To fully use Quoten services, you must register for an account with a valid email address and secure password. Security: You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.</p>
      
      <h3 className="text-lg font-semibold">4. Use of Open AI Keys</h3>
      <p>Security: Quoten ensures that all Open AI keys are kept secure with industry-standard encryption practices. Access: Only authorized personnel can access these keys, and they are never shared with users or third parties.</p>
      
      <h3 className="text-lg font-semibold">5. Prohibited Conduct</h3>
      <p>You agree not to: Use the Service in any way that violates any applicable federal, state, local, or international law or regulation (including, but not limited to, any laws regarding the export of data or software to and from the US or other countries). Attempt to gain unauthorized access to, interfere with, damage, or disrupt any parts of the Service, the server on which the Service is stored, or any server, computer, or database connected to the Service.</p>
      
      <h3 className="text-lg font-semibold">6. Consequences of Violation</h3>
      <p>Any attempt to manipulate, misuse, or compromise the security of Quoten or engage in unlawful activities may lead to immediate account termination, legal action, and reporting to relevant authorities. Violations could be subject to prosecution under various US laws, including: Computer Fraud and Abuse Act (18 U.S.C. § 1030), Electronic Communications Privacy Act (18 U.S.C. § 2510 et seq.), California Consumer Privacy Act (CCPA) for California residents.</p>
      
      <h3 className="text-lg font-semibold">7. Changes to Terms</h3>
      <p>Quoten reserves the right to modify these Terms at any time. We will notify you of any changes by posting the new Terms on this page.</p>
      
      <h3 className="text-lg font-semibold">8. Termination</h3>
      <p>We may terminate or suspend your access to our Service immediately, without prior notice or liability, for any reason whatsoever, including, without limitation, if you breach the Terms.</p>
      
      <h3 className="text-lg font-semibold">9. Contact Us</h3>
      <p>If you have any questions about these Terms, please contact us at contact@quoten.com.</p>
    </div>
  );
}

function PrivacyPolicy() {
  return (
    <div className="space-y-4 text-gray-700">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
      <p className="text-lg text-gray-500 mb-8">Welcome to Quoten</p>
      
      <h3 className="text-lg font-semibold">1. Information We Collect</h3>
      <p>Account Information: When you create an account, we collect your name, email address, and other necessary details. Usage Data: Information on how you use Quoten, including quotes generated and interaction with our AI system.</p>
      
      <h3 className="text-lg font-semibold">2. How We Use Your Information</h3>
      <p>Service Provision: To deliver our services, manage accounts, and provide customer support. Security: To protect our systems and your data from unauthorized access or misuse.</p>
      
      <h3 className="text-lg font-semibold">3. Data Security</h3>
      <p>All personal data is stored securely using encryption and access is limited to authorized personnel only. We employ standard security measures to protect against loss, misuse, or alteration of data.</p>
      
      <h3 className="text-lg font-semibold">4. Sharing Your Information</h3>
      <p>We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties unless we provide users with advance notice. This does not include website hosting partners and other parties who assist us in operating our website, conducting our business, or serving our users, so long as those parties agree to keep this information confidential.</p>
      
      <h3 className="text-lg font-semibold">5. Your Rights</h3>
      <p>Under laws like the CCPA, California residents have rights to access, correct, or delete their personal data. To exercise these rights, please contact us.</p>
      
      <h3 className="text-lg font-semibold">6. Changes to This Privacy Policy</h3>
      <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.</p>
      
      <h3 className="text-lg font-semibold">7. Contact Us</h3>
      <p>For privacy-related inquiries or to exercise your rights, please contact us at privacy@quoten.com.</p>
    </div>
  );
}