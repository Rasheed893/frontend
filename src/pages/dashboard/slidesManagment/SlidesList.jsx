import Loading from "../../../components/Loading";
import { useFetchCarouselQuery } from "../../../redux/features/spinnerAPI";
import { useDeleteSlideMutation } from "../../../redux/features/spinnerAPI";

const SlidesList = ({ spinnerName, onEdit }) => {
  const { data, isLoading } = useFetchCarouselQuery(spinnerName);
  const slides = data?.slides || [];

  const [deleteSlide] = useDeleteSlideMutation();

  const handleDelete = async (slideId) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this slide?"
    );
    if (!confirm) return;

    try {
      await deleteSlide({ name: spinnerName, slideId }).unwrap();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete the slide.");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {isLoading ? (
        <Loading />
      ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Preview
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {slides.map((slide) => (
              <tr key={slide._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <img
                    src={slide.image?.url}
                    alt="Slide preview"
                    className="h-12 w-20 object-cover rounded"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{slide.title}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => onEdit(slide)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(slide._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SlidesList;
