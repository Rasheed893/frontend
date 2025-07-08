// components/AdminDashboard.js
import { useState } from "react";
import SpinnerSelector from "./SpinnerSelector";
import SlideForm from "./SlideForm";
import SlidesList from "./SlidesList";

const SlidesManager = () => {
  const [selectedSpinner, setSelectedSpinner] = useState("main-banner");
  const [selectedSlide, setSelectedSlide] = useState(null);
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Carousel Management</h1>
        <div className="flex gap-4">
          <SpinnerSelector
            value={selectedSpinner}
            onChange={setSelectedSpinner}
          />
          <button
            onClick={() => {
              setSelectedSlide(null);
              setShowForm(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Add New Slide
          </button>
        </div>
      </div>

      <SlidesList
        spinnerName={selectedSpinner}
        onEdit={(slide) => {
          setSelectedSlide(slide);
          setShowForm(true);
        }}
      />

      {showForm && (
        <SlideForm
          spinnerName={selectedSpinner}
          initialData={selectedSlide}
          onClose={() => {
            setShowForm(false);
            setSelectedSlide(null);
          }}
        />
      )}
    </div>
  );
};

export default SlidesManager;
