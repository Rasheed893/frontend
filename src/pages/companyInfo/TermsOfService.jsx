// TermsOfService.jsx
import React from "react";

function TermsOfService() {
  return (
    <div className="bg-gray-50 text-gray-800 py-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-4xl font-bold mb-6 text-center">
          Terms of Service
        </h1>
        <p className="mb-8 text-center">
          By using RFstore’s website, you agree to the following terms. Please
          read them carefully.
        </p>

        <div className="space-y-4">
          <details className="border border-gray-200 rounded-lg p-4">
            <summary className="font-semibold cursor-pointer">
              1. Acceptance of Terms
            </summary>
            <p className="mt-2">
              Your access and use of RFstore are subject to these Terms. If you
              disagree, please do not use our site.
            </p>
          </details>

          <details className="border border-gray-200 rounded-lg p-4">
            <summary className="font-semibold cursor-pointer">
              2. User Obligations
            </summary>
            <ul className="mt-2 list-disc list-inside">
              <li>Provide accurate, up-to-date information.</li>
              <li>Maintain the security of your account credentials.</li>
              <li>Comply with applicable laws when using the site.</li>
            </ul>
          </details>

          <details className="border border-gray-200 rounded-lg p-4">
            <summary className="font-semibold cursor-pointer">
              3. Intellectual Property
            </summary>
            <p className="mt-2">
              All content—text, images, logos—on RFstore is owned by or licensed
              to us. You may not reuse without permission.
            </p>
          </details>

          <details className="border border-gray-200 rounded-lg p-4">
            <summary className="font-semibold cursor-pointer">
              4. Order Acceptance & Pricing
            </summary>
            <p className="mt-2">
              All orders are subject to availability and confirmation. Prices
              are as listed; RFstore reserves the right to change them.
            </p>
          </details>

          <details className="border border-gray-200 rounded-lg p-4">
            <summary className="font-semibold cursor-pointer">
              5. Disclaimers & Limitation of Liability
            </summary>
            <p className="mt-2">
              We provide the site “as is.” RFstore is not liable for indirect or
              consequential damages arising from the use of our services.
            </p>
          </details>

          <details className="border border-gray-200 rounded-lg p-4">
            <summary className="font-semibold cursor-pointer">
              6. Governing Law
            </summary>
            <p className="mt-2">
              These Terms are governed by the laws of the United Arab Emirates.
              Any disputes will be resolved in UAE courts.
            </p>
          </details>

          <details className="border border-gray-200 rounded-lg p-4">
            <summary className="font-semibold cursor-pointer">
              7. Changes to Terms
            </summary>
            <p className="mt-2">
              RFstore may update these Terms at any time. We’ll notify you of
              significant changes via email or website banner.
            </p>
          </details>

          <details className="border border-gray-200 rounded-lg p-4">
            <summary className="font-semibold cursor-pointer">
              8. Contact Us
            </summary>
            <p className="mt-2">
              Questions about these Terms? Email us at{" "}
              <a href="mailto:terms@rfstore.ae" className="text-blue-600">
                terms@rfstore.ae
              </a>
              .
            </p>
          </details>
        </div>
      </div>
    </div>
  );
}

export default TermsOfService;
