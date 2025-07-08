// components/SpinnerSelector.js
const SPINNER_TYPES = [
  { value: "main-banner", label: "Main Banner" },
  { value: "products-carousel", label: "Products Carousel" },
  { value: "special-offers", label: "Special Offers" },
];

const SpinnerSelector = ({ value, onChange }) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border rounded-md px-3 py-2"
    >
      {SPINNER_TYPES.map((spinner) => (
        <option key={spinner.value} value={spinner.value}>
          {spinner.label}
        </option>
      ))}
    </select>
  );
};

export default SpinnerSelector;
