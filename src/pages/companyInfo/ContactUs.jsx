import React from "react";
import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";
import getBaseURL from "../../utils/baseURL";
import { ToastContainer, toast } from "react-toastify";

const ContactUs = () => {
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      name: e.target.name.value,
      email: e.target.email.value,
      message: e.target.message.value,
    };

    try {
      const response = await fetch(`${getBaseURL()}/api/email/contact-form`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (result.success) {
        toast.success("Message sent successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        // Clear the form fields
        e.target.reset();
      } else {
        toast.error("Failed to send message. Please try again.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An error occurred. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const phoneNumber = import.meta.env.VITE_WHATSAPP_NUMBER;
  const defaultMessage = "Hi! I need help with my order.";
  return (
    <div className="bg-gray-50 py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">
          Contact Us
        </h1>
        <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto mb-10">
          Have questions or need assistance? Our team is here to help! Reach out
          to us through the form below or via email, and we’ll get back to you
          as soon as possible.
        </p>

        <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-gray-700 font-medium mb-2"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your name"
              />
            </div>

            {/* Email */}
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-700 font-medium mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
              />
            </div>

            {/* Message */}
            <div className="mb-4">
              <label
                htmlFor="message"
                className="block text-gray-700 font-medium mb-2"
              >
                Message
              </label>
              <textarea
                id="message"
                rows="5"
                className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your message"
              ></textarea>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Contact Info */}
        <div className="mt-10 text-center">
          <p className="text-gray-600">
            <strong>Email:</strong> support@rfstore.ae
          </p>
          <p className="text-gray-600">
            <strong>Phone:</strong> +971-50-123-4567
          </p>
          <p className="text-gray-600">
            <strong>Working Hours:</strong> 9:00 AM - 6:00 PM (Sunday to
            Thursday)
          </p>
        </div>
        {/* social Media */}
        <div className="flex justify-center space-x-6 mt-8">
          <a
            href="https://instagram.com/rfstore"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white p-2 rounded-full shadow-lg"
          >
            <FaInstagram size={24} />
          </a>
          <a
            href="https://facebook.com/rfstore"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#1877F2] text-white p-2 rounded-full shadow-lg"
          >
            <FaFacebook size={24} />
          </a>
          <a
            href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(
              defaultMessage
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#25D366] text-white p-2 rounded-full shadow-lg"
          >
            <FaWhatsapp size={24} />
          </a>
        </div>
      </div>
      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default ContactUs;
