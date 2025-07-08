import React from "react";

const AboutUs = () => {
  return (
    <div className="bg-gray-50 py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">
          About RFstore
        </h1>
        <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto mb-10">
          Welcome to RFstore, your one-stop destination for premium accessories
          in the UAE. We are an online-only store dedicated to providing
          high-quality products that enhance your lifestyle. From stylish
          gadgets to everyday essentials, we bring you the best at your
          fingertips.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Our Mission */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Our Mission
            </h2>
            <p className="text-gray-600">
              At RFstore, our mission is to deliver exceptional value to our
              customers by offering a curated selection of accessories that
              combine quality, style, and affordability. We aim to make online
              shopping seamless and enjoyable for everyone in the UAE.
            </p>
          </div>

          {/* Why Choose Us */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Why Choose Us?
            </h2>
            <ul className="list-disc pl-5 text-gray-600 space-y-2">
              <li>Wide range of premium accessories.</li>
              <li>Fast and reliable delivery across the UAE.</li>
              <li>Secure online payment options.</li>
              <li>Dedicated customer support team.</li>
            </ul>
          </div>
        </div>

        {/* Image Section */}
        <section className="bg-gray-100 py-12 mt-10">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Why Choose Us?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center">
                <svg
                  className="h-12 w-12 text-blue-500 mb-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <h3 className="text-xl font-semibold">Affordability</h3>
                <p className="mt-2">
                  Quality products at low prices. Shop stylish accessories
                  without breaking the bank.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <svg
                  className="h-12 w-12 text-green-500 mb-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <h3 className="text-xl font-semibold">Convenience</h3>
                <p className="mt-2">
                  100% online shopping. Browse and order anytime, from anywhere
                  in the UAE.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <svg
                  className="h-12 w-12 text-purple-500 mb-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <h3 className="text-xl font-semibold">Variety</h3>
                <p className="mt-2">
                  From fashion to gadgets to toys – explore a wide range of
                  accessories all in one place.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;
