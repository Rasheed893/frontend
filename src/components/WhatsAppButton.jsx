// src/components/WhatsAppButton.jsx
import { FaWhatsapp } from "react-icons/fa";

const WhatsAppButton = () => {
  // Replace with your WhatsApp number (include country code)
  const phoneNumber = import.meta.env.VITE_WHATSAPP_NUMBER;
  const defaultMessage = "Hi! I need help with my order.";

  return (
    <a
      href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(
        defaultMessage
      )}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:scale-110 hover:shadow-xl transition-all duration-300 z-50 animate-float"
      aria-label="Chat via WhatsApp"
    >
      <FaWhatsapp size={30} />
    </a>
  );
};

export default WhatsAppButton;
