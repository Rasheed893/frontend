// components/SlideForm.js
import { useState, useEffect } from "react";
import {
  useAddSlideMutation,
  useUpdateSlideMutation,
} from "../../../redux/features/spinnerAPI";

const SlideForm = ({ spinnerName, initialData, onClose }) => {
  // Local state for form inputs
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    buttons: [
      { text: "", url: "" },
      { text: "", url: "" },
    ],
  });
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // RTK Query mutations
  const [addSlide] = useAddSlideMutation();
  const [updateSlide] = useUpdateSlideMutation();

  // Sync initialData into state when editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        subtitle: initialData.subtitle || "",
        buttons:
          Array.isArray(initialData.buttons) && initialData.buttons.length
            ? initialData.buttons.map(({ text, url }) => ({ text, url }))
            : [
                { text: "", url: "" },
                { text: "", url: "" },
              ],
      });
      setPreviewUrl(initialData.image?.url || null);
      setImageFile(null);
    } else {
      // Reset on new
      setFormData({
        title: "",
        subtitle: "",
        buttons: [
          { text: "", url: "" },
          { text: "", url: "" },
        ],
      });
      setPreviewUrl(null);
      setImageFile(null);
    }
  }, [initialData]);

  // Handle input changes
  const handleInputChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleButtonChange = (index, field, value) => {
    setFormData((prev) => {
      const buttons = prev.buttons.map((btn, i) =>
        i === index ? { ...btn, [field]: value } : btn
      );
      return { ...prev, buttons };
    });
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("subtitle", formData.subtitle);
      payload.append("buttons", JSON.stringify(formData.buttons));
      if (imageFile) payload.append("image", imageFile);

      if (initialData) {
        await updateSlide({
          name: spinnerName,
          slideId: initialData._id,
          formData: payload,
        }).unwrap();
      } else {
        await addSlide({ name: spinnerName, formData: payload }).unwrap();
      }
      onClose();
    } catch (error) {
      console.error("Operation failed:", error);
      alert("Failed to save slide. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
        <h2 className="text-xl font-bold mb-4">
          {initialData ? "Edit Slide" : "New Slide"}
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Image Upload */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Slide Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setImageFile(file);
                  setPreviewUrl(URL.createObjectURL(file));
                }
              }}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Preview"
                className="mt-2 h-32 w-48 object-cover rounded"
              />
            )}
          </div>

          {/* Title & Subtitle */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subtitle
              </label>
              <input
                type="text"
                value={formData.subtitle}
                onChange={(e) => handleInputChange("subtitle", e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="mb-6">
            {formData.buttons.map((btn, idx) => (
              <div key={idx} className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {" "}
                  Button {idx + 1}
                </label>
                <input
                  type="text"
                  placeholder={`Button ${idx + 1} Text`}
                  value={btn.text}
                  onChange={(e) =>
                    handleButtonChange(idx, "text", e.target.value)
                  }
                  className="w-full border px-3 py-2 mb-2 rounded"
                />
                <input
                  type="text"
                  placeholder={`Button ${idx + 1} URL`}
                  value={btn.url}
                  onChange={(e) =>
                    handleButtonChange(idx, "url", e.target.value)
                  }
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    ></path>
                  </svg>
                  Submitting...
                </>
              ) : initialData ? (
                "Update Slide"
              ) : (
                "Create Slide"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SlideForm;
