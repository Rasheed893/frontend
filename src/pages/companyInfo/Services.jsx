import React from "react";

function Services() {
  return (
    <div className="bg-white text-gray-800">
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Our Services</h1>
          <p className="text-lg mb-10">
            At RFstore, we go beyond great products. Discover the benefits that
            make shopping with us seamless and worry-free.
          </p>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Service Card */}
            <div className="p-6 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-4">
                <svg
                  className="w-12 h-12 mx-auto text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4" />
                  <path
                    strokeWidth={2}
                    d="M7 13l-1.3 5.2a1 1 0 001 1.2h12.6a1 1 0 001-1.2L17 13"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-2">Fast Delivery</h3>
              <p>
                Get your accessories delivered anywhere in the UAE within 1–3
                business days, free on orders over AED 150.
              </p>
            </div>

            <div className="p-6 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-4">
                <svg
                  className="w-12 h-12 mx-auto text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeWidth={2}
                    d="M12 11c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3z"
                  />
                  <path
                    strokeWidth={2}
                    d="M19.4 15a7.97 7.97 0 00.6-3c0-4.418-3.582-8-8-8S4 7.582 4 12s3.582 8 8 8c1.066 0 2.082-.208 3-.6"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-2">Secure Payment</h3>
              <p>
                Your data is protected with industry-standard SSL encryption and
                verified payment gateways.
              </p>
            </div>

            <div className="p-6 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-4">
                <svg
                  className="w-12 h-12 mx-auto text-purple-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeWidth={2} d="M18 8a6 6 0 11-12 0 6 6 0 0112 0z" />
                  <path strokeWidth={2} d="M2 20h20" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-2">24/7 Support</h3>
              <p>
                Our friendly support team is available around the clock via
                email and WhatsApp to answer your questions.
              </p>
            </div>

            <div className="p-6 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-4">
                <svg
                  className="w-12 h-12 mx-auto text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-2">Easy Returns</h3>
              <p>
                Changed your mind? Initiate a return within 72 hours and get a
                full refund—no questions asked.
              </p>
            </div>

            <div className="p-6 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-4">
                <svg
                  className="w-12 h-12 mx-auto text-yellow-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeWidth={2}
                    d="M12 8V4m0 0a4 4 0 014 4m-4-4a4 4 0 00-4 4m0 8v4m0 0a4 4 0 004-4m-4 4a4 4 0 01-4-4"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-2">
                Authentic Products
              </h3>
              <p>
                We source all items directly from reputable brands and
                suppliers—no knock-offs, guaranteed.
              </p>
            </div>

            <div className="p-6 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-4">
                <svg
                  className="w-12 h-12 mx-auto text-indigo-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeWidth={2} d="M3 10h18M3 6h18M3 14h18M3 18h18" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-2">Daily Deals</h3>
              <p>
                Check out our daily flash sales for up to 50% off on selected
                items—new deals every day!
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Services;
