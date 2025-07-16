// Enhanced AddItem.jsx with multiple image upload (max 5), resized for performance
import React, { useState } from "react";
import SelectField from "./SelectField";
import InputField from "./InputField";
import { useForm } from "react-hook-form";
import {
  useAddItemMutation,
  useUpdateItemMutation,
} from "../../../redux/features/itemAPI";
import Loading from "../../../components/Loading";
import Swal from "sweetalert2";
import { storage } from "../../../firebase/firebase.config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { useSelector } from "react-redux";

const AddItem = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [galleryImageFiles, setGalleryImageFiles] = useState([]);
  const [features, setFeatures] = useState([""]);
  const [colorOptions, setColorOptions] = useState([""]);
  const [reviews, setReviews] = useState([
    { userName: "", date: "", rating: "", comment: "" },
  ]);

  const [addItem, { isLoading, isError }] = useAddItemMutation();
  const [updateItem] = useUpdateItemMutation();
  const { register, handleSubmit, reset } = useForm();

  const uploadImage = async (file, path) => {
    const uniqueName = uuidv4();
    const fileRef = ref(storage, `${path}/${uniqueName}`);
    const snapshot = await uploadBytes(fileRef, file);
    return getDownloadURL(snapshot.ref);
  };

  const uploadGalleryImages = async (files, itemId) =>
    Promise.all(files.map((f) => uploadImage(f, `items/${itemId}/gallery`)));

  const onSubmit = async (data) => {
    if (!coverImageFile) {
      return Swal.fire(
        "No Images",
        "Please select at least one image.",
        "warning"
      );
    }

    // filter valid reviews
    // const validReviews = reviews
    //   .filter((r) => r.userName.trim() && r.rating && r.comment.trim())
    //   .map((r) => ({
    //     userName: r.userName,
    //     date: r.date || new Date().toISOString(),
    //     rating: parseFloat(r.rating),
    //     comment: r.comment,
    //   }));

    setIsSubmitting(true);
    Swal.fire({
      title: "Uploading…",
      text: "Please wait while your item is being uploaded",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    const payload = {
      title: data.title,
      description: data.description,
      additionalDescription: data.additionalDescription || "",
      moreDetails: data.moreDetails || "",
      features: features.filter((f) => f.trim()),
      colorOptions: colorOptions.filter((c) => c.trim()),
      material: data.material || "",
      dimensions: data.dimensions || "",
      weight: data.weight || "",
      warranty: data.warranty || "",
      countryOfOrigin: data.countryOfOrigin || "",
      category: data.category,
      trending: data.trending || false,
      // rating: parseFloat(data.rating) || 0,
      oldPrice: parseFloat(data.oldPrice),
      newPrice: parseFloat(data.newPrice),
      stockQuantity: parseInt(data.stockQuantity, 10),
      quantity: 1,
      coverImage: "",
      galleryImages: [],
      // reviews: validReviews,
    };

    try {
      const created = await addItem(payload).unwrap();
      const itemId = created.item?.id;
      if (!itemId) throw new Error("Item ID undefined");

      const coverUrl = await uploadImage(
        coverImageFile,
        `items/${itemId}/cover`
      );
      const galleryUrls = await uploadGalleryImages(galleryImageFiles, itemId);

      await updateItem({
        ...created.item,
        coverImage: coverUrl,
        galleryImages: galleryUrls,
        // reviews: validReviews,
        // rating: payload.rating,
      }).unwrap();

      Swal.fire({ title: "Item created!", icon: "success" });
      reset();
      setCoverImageFile(null);
      setGalleryImageFiles([]);
      setFeatures([""]);
      setColorOptions([""]);
      setReviews([{ userName: "", date: "", rating: "", comment: "" }]);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", err?.data?.message || "Failed to add item.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <Loading />;
  if (isError) return <div>Error: {isError.message}</div>;

  return (
    <div className="max-w-lg mx-auto p-4 bg-white dark:bg-gray-900 rounded-lg shadow text-gray-900 dark:text-gray-100">
      <h2 className="text-2xl font-bold mb-4">Add New Product</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Basic fields */}
        <InputField label="Title" name="title" register={register} />
        <InputField
          label="Description"
          name="description"
          type="textarea"
          register={register}
        />

        {/* Detailed fields */}
        <InputField
          label="Additional Description"
          name="additionalDescription"
          type="textarea"
          register={register}
        />
        <InputField
          label="More Details"
          name="moreDetails"
          type="textarea"
          register={register}
        />
        <InputField label="Material" name="material" register={register} />
        <InputField
          label="Dimensions"
          name="dimensions"
          placeholder="e.g. 12 x 8 x 3 cm"
          register={register}
        />
        <InputField
          label="Weight"
          name="weight"
          placeholder="e.g. 180g"
          register={register}
        />
        <InputField label="Warranty" name="warranty" register={register} />
        <InputField
          label="Country of Origin"
          name="countryOfOrigin"
          register={register}
        />

        {/* Dynamic Features */}
        <label className="block font-medium">Features</label>
        {features.map((feat, idx) => (
          <div key={idx} className="flex items-center space-x-2 mb-2">
            <input
              type="text"
              value={feat}
              onChange={(e) => {
                const arr = [...features];
                arr[idx] = e.target.value;
                setFeatures(arr);
              }}
              className="flex-1 border rounded px-2 py-1 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              placeholder="Feature description"
            />
            <button
              type="button"
              onClick={() => {
                const arr = features.filter((_, i) => i !== idx);
                setFeatures(arr.length ? arr : [""]);
              }}
              className="text-red-500"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          className="text-blue-600 dark:text-blue-400"
          onClick={() => setFeatures([...features, ""])}
        >
          + Add Feature
        </button>

        {/* Dynamic Colors */}
        <label className="block font-medium mt-4">Color Options</label>
        {colorOptions.map((color, idx) => (
          <div key={idx} className="flex items-center space-x-2 mb-2">
            <input
              type="text"
              value={color}
              onChange={(e) => {
                const arr = [...colorOptions];
                arr[idx] = e.target.value;
                setColorOptions(arr);
              }}
              className="flex-1 border rounded px-2 py-1 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              placeholder="Color name"
            />
            <button
              type="button"
              onClick={() => {
                const arr = colorOptions.filter((_, i) => i !== idx);
                setColorOptions(arr.length ? arr : [""]);
              }}
              className="text-red-500"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          className="text-blue-600 dark:text-blue-400"
          onClick={() => setColorOptions([...colorOptions, ""])}
        >
          + Add Color
        </button>

        {/* Category & Pricing */}
        <SelectField
          label="Category"
          name="category"
          options={[
            { value: "", label: "Choose A Category" },
            { value: "business", label: "Business" },
            { value: "technology", label: "Technology" },
            { value: "fiction", label: "Fiction" },
            { value: "horror", label: "Horror" },
            { value: "adventure", label: "Adventure" },
          ]}
          register={register}
        />
        <label className="inline-flex items-center">
          <input type="checkbox" {...register("trending")} className="mr-2" />{" "}
          Trending
        </label>
        <InputField
          label="Old Price"
          name="oldPrice"
          type="number"
          step="0.01"
          register={register}
        />
        <InputField
          label="New Price"
          name="newPrice"
          type="number"
          step="0.01"
          register={register}
        />
        <InputField
          label="Stock Quantity"
          name="stockQuantity"
          type="number"
          register={register}
        />

        {/* Images */}
        <label>Cover Image</label>
        <input
          type="file"
          accept="image/*"
          className="mb-4 file:bg-blue-600 file:text-white file:rounded file:px-3 file:py-1 dark:file:bg-blue-800"
          onChange={(e) => setCoverImageFile(e.target.files[0])}
        />
        <label>Gallery Images (max 4)</label>
        <input
          type="file"
          accept="image/*"
          multiple
          className="mb-6 file:bg-blue-600 file:text-white file:rounded file:px-3 file:py-1 dark:file:bg-blue-800"
          onChange={(e) => {
            const files = Array.from(e.target.files);
            if (files.length > 4) return alert("Max 4 images.");
            setGalleryImageFiles(files.slice(0, 4));
          }}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 bg-blue-600 dark:bg-blue-700 text-white rounded hover:bg-blue-700 dark:hover:bg-blue-800 transition"
        >
          {isSubmitting ? "Submitting…" : "Add Item"}
        </button>
      </form>
    </div>
  );
};

export default AddItem;

// import React, { useState } from "react";
// import InputField from "./InputField";
// import { useForm } from "react-hook-form";
// import { useAddItemMutation } from "../../../redux/features/itemAPI";
// import Loading from "../../../components/Loading";
// import Swal from "sweetalert2";
// import { storage } from "../../../firebase/firebase.config";
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { v4 as uuidv4 } from "uuid";
// import { useSelector } from "react-redux";

// const AddItem = () => {
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [coverImageFile, setCoverImageFile] = useState(null);
//   const [galleryImageFiles, setGalleryImageFiles] = useState([]);
//   const [features, setFeatures] = useState([]);
//   const [colorOptions, setColorOptions] = useState([]);
//   const [specs, setSpecs] = useState({
//     material: "",
//     dimensions: "",
//     weight: "",
//     warranty: "",
//     countryOfOrigin: "",
//   });

//   const user = useSelector((state) => state.auth.user);
//   const [addItem, { isLoading, isError }] = useAddItemMutation();
//   const { register, handleSubmit, reset } = useForm();

//   const uploadImage = async (file, path) => {
//     const fileRef = ref(storage, `${path}/${uuidv4()}`);
//     const snapshot = await uploadBytes(fileRef, file);
//     return await getDownloadURL(snapshot.ref);
//   };

//   const uploadGalleryImages = async (files, itemId) => {
//     return Promise.all(
//       files.map((file) => uploadImage(file, `items/${itemId}`))
//     );
//   };

//   const onSubmit = async (data) => {
//     if (!coverImageFile) {
//       Swal.fire("No Images", "Please select a cover image.", "warning");
//       return;
//     }

//     setIsSubmitting(true);
//     Swal.fire({
//       title: "Uploading...",
//       allowOutsideClick: false,
//       didOpen: () => Swal.showLoading(),
//     });

//     const newItem = {
//       ...data,
//       ...specs,
//       features,
//       colorOptions,
//       coverImage: "",
//       galleryImages: [],
//     };

//     try {
//       const created = await addItem(newItem).unwrap();
//       const itemId = created.item.id;

//       const coverUrl = await uploadImage(coverImageFile, `items/${itemId}`);
//       const galleryUrls = await uploadGalleryImages(galleryImageFiles, itemId);

//       await addItem({
//         id: itemId,
//         coverImage: coverUrl,
//         galleryImages: galleryUrls,
//       }).unwrap();

//       Swal.fire("Success", "Item created successfully!", "success");
//       reset();
//       setCoverImageFile(null);
//       setGalleryImageFiles([]);
//       setFeatures([]);
//       setColorOptions([]);
//       setSpecs({
//         material: "",
//         dimensions: "",
//         weight: "",
//         warranty: "",
//         countryOfOrigin: "",
//       });
//     } catch (error) {
//       console.error(error);
//       Swal.fire("Error", "Failed to add item.", "error");
//     }
//     setIsSubmitting(false);
//   };

//   if (isLoading) return <Loading />;
//   if (isError) return <div>Error adding item</div>;

//   return (
//     <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
//       <h2 className="text-2xl font-bold mb-4">Add New Item</h2>
//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//         <InputField label="Title" name="title" register={register} required />
//         <InputField
//           label="Description"
//           name="description"
//           type="textarea"
//           register={register}
//           required
//         />
//         <InputField
//           label="Category"
//           name="category"
//           register={register}
//           required
//         />
//         <InputField
//           label="Old Price"
//           name="oldPrice"
//           type="number"
//           step="0.01"
//           register={register}
//           required
//         />
//         <InputField
//           label="New Price"
//           name="newPrice"
//           type="number"
//           step="0.01"
//           register={register}
//           required
//         />
//         <InputField
//           label="Stock Quantity"
//           name="stockQuantity"
//           type="number"
//           register={register}
//           required
//         />
//         <InputField
//           label="Rating"
//           name="rating"
//           type="number"
//           placeholder="Rating 0-5"
//           register={register}
//           min="0"
//           max="5"
//           // errors={errors}
//           step="0.01"
//         />

//         {/* Warranty & Specs */}
//         <label className="block font-medium">Material</label>
//         <input
//           type="text"
//           value={specs.material}
//           onChange={(e) => setSpecs({ ...specs, material: e.target.value })}
//           className="w-full border rounded px-3 py-2"
//           placeholder="Material"
//         />
//         <label className="block font-medium mt-2">Dimensions</label>
//         <input
//           type="text"
//           value={specs.dimensions}
//           onChange={(e) => setSpecs({ ...specs, dimensions: e.target.value })}
//           className="w-full border rounded px-3 py-2"
//           placeholder="Dimensions"
//         />
//         <label className="block font-medium mt-2">Weight</label>
//         <input
//           type="text"
//           value={specs.weight}
//           onChange={(e) => setSpecs({ ...specs, weight: e.target.value })}
//           className="w-full border rounded px-3 py-2"
//           placeholder="Weight"
//         />
//         <label className="block font-medium mt-2">Warranty</label>
//         <input
//           type="text"
//           value={specs.warranty}
//           onChange={(e) => setSpecs({ ...specs, warranty: e.target.value })}
//           className="w-full border rounded px-3 py-2"
//           placeholder="Warranty"
//         />
//         <label className="block font-medium mt-2">Country of Origin</label>
//         <input
//           type="text"
//           value={specs.countryOfOrigin}
//           onChange={(e) =>
//             setSpecs({ ...specs, countryOfOrigin: e.target.value })
//           }
//           className="w-full border rounded px-3 py-2"
//           placeholder="Country of Origin"
//         />

//         {/* Features */}
//         <label className="block font-medium">Features</label>
//         {features.map((feat, idx) => (
//           <div key={idx} className="flex items-center space-x-2 mb-2">
//             <input
//               type="text"
//               value={feat}
//               onChange={(e) => {
//                 const arr = [...features];
//                 arr[idx] = e.target.value;
//                 setFeatures(arr);
//               }}
//               className="flex-1 border rounded px-2 py-1"
//               placeholder={`Feature ${idx + 1}`}
//             />
//             <button
//               type="button"
//               onClick={() => setFeatures(features.filter((_, i) => i !== idx))}
//               className="text-red-500"
//             >
//               Remove
//             </button>
//           </div>
//         ))}
//         <button
//           type="button"
//           onClick={() => setFeatures([...features, ""])}
//           className="text-blue-600"
//         >
//           + Add Feature
//         </button>

//         {/* Color Options */}
//         <label className="block font-medium mt-4">Color Options</label>
//         {colorOptions.map((color, idx) => (
//           <div key={idx} className="flex items-center space-x-2 mb-2">
//             <input
//               type="text"
//               value={color}
//               onChange={(e) => {
//                 const arr = [...colorOptions];
//                 arr[idx] = e.target.value;
//                 setColorOptions(arr);
//               }}
//               className="flex-1 border rounded px-2 py-1"
//               placeholder={`Color ${idx + 1}`}
//             />
//             <button
//               type="button"
//               onClick={() =>
//                 setColorOptions(colorOptions.filter((_, i) => i !== idx))
//               }
//               className="text-red-500"
//             >
//               Remove
//             </button>
//           </div>
//         ))}
//         <button
//           type="button"
//           onClick={() => setColorOptions([...colorOptions, ""])}
//           className="text-blue-600"
//         >
//           + Add Color
//         </button>

//         {/* Image Uploads */}
//         <div>
//           <label className="block font-medium">Cover Image</label>
//           <input
//             type="file"
//             accept="image/*"
//             onChange={(e) => setCoverImageFile(e.target.files[0])}
//           />
//         </div>
//         <div>
//           <label className="block font-medium">Gallery Images</label>
//           <input
//             type="file"
//             multiple
//             accept="image/*"
//             onChange={(e) => setGalleryImageFiles(Array.from(e.target.files))}
//           />
//         </div>

//         <button
//           type="submit"
//           disabled={isSubmitting}
//           className="w-full py-2 bg-green-600 text-white rounded"
//         >
//           {isSubmitting ? "Submitting..." : "Add Item"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default AddItem;
