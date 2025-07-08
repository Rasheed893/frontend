import React, { useState } from "react";
import axios from "axios";
import getBaseURL from "../../../utils/baseURL";

const PromoManagment = () => {
  const [formData, setFormData] = useState({
    code: "",
    discountPercentage: "",
    expiresAt: "",
  });
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    try {
      const res = await axios.post(
        `${getBaseURL()}/api/promo/create`,
        formData
      );
      setMessage({ type: "success", text: res.data.message });
      setFormData({
        code: "",
        discountPercentage: "",
        expiresAt: "",
      });
    } catch (err) {
      const error = err.response?.data?.message || "Error creating promo code";
      setMessage({ type: "error", text: error });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-white">
      <div className="w-full max-w-md bg-gray-100 p-6 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold text-center mb-6 text-black">
          Promo Management
        </h1>
        {message && (
          <div
            className={`mb-4 p-3 rounded text-center ${
              message.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Code</label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffce1a]"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Discount Percentage
            </label>
            <input
              type="number"
              name="discountPercentage"
              value={formData.discountPercentage}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffce1a]"
              min="1"
              max="100"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Expiration Date
            </label>
            <input
              type="date"
              name="expiresAt"
              value={formData.expiresAt}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffce1a]"
              required
            />
          </div>
          <button type="submit" className="w-full btn-primary">
            Create Promo Code
          </button>
        </form>
      </div>
    </div>
  );
};

export default PromoManagment;
