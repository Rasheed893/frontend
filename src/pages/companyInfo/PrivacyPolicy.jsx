// PrivacyPolicy.jsx
import React from "react";

function PrivacyPolicy() {
  return (
    <div className="bg-white text-gray-800 py-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-4xl font-bold mb-6 text-center">Privacy Policy</h1>
        <p className="mb-8 text-center">
          At RFstore, we value your privacy. This policy explains how we
          collect, use, and protect your personal data.
        </p>

        <div className="space-y-4">
          <details className="border border-gray-200 rounded-lg p-4">
            <summary className="font-semibold cursor-pointer">
              1. Information We Collect
            </summary>
            <ul className="mt-2 list-disc list-inside">
              <li>Personal details (name, email, address)</li>
              <li>Order history and payment info (encrypted)</li>
              <li>Usage data (pages visited, time spent)</li>
            </ul>
          </details>

          <details className="border border-gray-200 rounded-lg p-4">
            <summary className="font-semibold cursor-pointer">
              2. How We Use Your Data
            </summary>
            <ol className="mt-2 list-decimal list-inside">
              <li>Process orders and payments</li>
              <li>Send order updates and promotional emails</li>
              <li>Improve site experience and personalize content</li>
            </ol>
          </details>

          <details className="border border-gray-200 rounded-lg p-4">
            <summary className="font-semibold cursor-pointer">
              3. Cookies & Tracking
            </summary>
            <p className="mt-2">
              We use cookies and similar technologies to store preferences,
              analyze site traffic, and offer targeted promotions. You can
              disable cookies in your browser settings, but some features may
              not work.
            </p>
          </details>

          <details className="border border-gray-200 rounded-lg p-4">
            <summary className="font-semibold cursor-pointer">
              4. Third-Party Services
            </summary>
            <p className="mt-2">
              We may share data with service providers (payment gateways,
              analytics, email) under strict confidentiality agreements.
            </p>
          </details>

          <details className="border border-gray-200 rounded-lg p-4">
            <summary className="font-semibold cursor-pointer">
              5. Your Rights
            </summary>
            <p className="mt-2">
              You can request to access, correct, or delete your personal data
              at any time by contacting us.
            </p>
          </details>

          <details className="border border-gray-200 rounded-lg p-4">
            <summary className="font-semibold cursor-pointer">
              6. Contact Us
            </summary>
            <p className="mt-2">
              For privacy inquiries, email us at{" "}
              <a href="mailto:privacy@rfstore.ae" className="text-blue-600">
                privacy@rfstore.ae
              </a>
              .
            </p>
          </details>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
