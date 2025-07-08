import React, { useEffect, useState } from "react";
import InputField from "../additem/InputField";
import SelectField from "../additem/SelectField";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import {
  useFetchItemByIdQuery,
  useUpdateItemMutation,
} from "../../../redux/features/itemAPI";
import Loading from "../../../components/Loading";
import Swal from "sweetalert2";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "../../../firebase/firebase.config";
import getFirebasePathFromUrl from "../../../utils/getFirebasePathFromUrl";
import { v4 as uuidv4 } from "uuid";

const UpdateItems = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { id } = useParams();
  const { data: itemsData, isLoading, isError } = useFetchItemByIdQuery(id);
  const [updateItem] = useUpdateItemMutation();
  const { register, handleSubmit, setValue, getValues } = useForm();

  // State management
  const [coverImage, setCoverImage] = useState("");
  const [galleryImages, setGalleryImages] = useState([]);
  const [features, setFeatures] = useState([""]);
  const [colorOptions, setColorOptions] = useState([""]);
  const [specs, setSpecs] = useState({
    material: "",
    dimensions: "",
    weight: "",
    warranty: "",
    countryOfOrigin: "",
  });

  // Initialize form values
  useEffect(() => {
    if (itemsData?.item) {
      const item = itemsData.item;
      // Basic fields
      const basicFields = [
        "title",
        "description",
        "category",
        "trending",
        "oldPrice",
        "newPrice",
        "rating",
        "quantity",
        "stockQuantity",
        "additionalDescription",
        "moreDetails",
      ];
      basicFields.forEach((field) => setValue(field, item[field] || ""));

      // Specifications
      setSpecs({
        material: item.material || "",
        dimensions: item.dimensions || "",
        weight: item.weight || "",
        warranty: item.warranty || "",
        countryOfOrigin: item.countryOfOrigin || "",
      });

      // Features and colors
      setFeatures(item.features?.length ? item.features : [""]);
      setColorOptions(item.colorOptions?.length ? item.colorOptions : [""]);

      // Images
      setCoverImage(item.coverImage || "");
      setGalleryImages(item.galleryImages || []);

      // Set specification values in the form
      const specFields = [
        "material",
        "dimensions",
        "weight",
        "warranty",
        "countryOfOrigin",
      ];
      specFields.forEach((field) => setValue(field, item[field] || ""));

      // Force category update
      setValue("category", item.category || "");
    }
  }, [itemsData, setValue]);
  // Image handling functions
  const handleImageUpload = async (file, path) => {
    const fileRef = ref(storage, `${path}/${uuidv4()}`);
    await uploadBytes(fileRef, file);
    return getDownloadURL(fileRef);
  };

  const handleCoverImageUpdate = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      Swal.showLoading();
      // Upload new image
      const url = await handleImageUpload(file, `items/${id}/cover`);

      // Update database
      await updateItem({
        id,
        coverImage: url,
        ...getValues(),
      }).unwrap();

      // Cleanup old image
      if (coverImage) {
        const oldPath = getFirebasePathFromUrl(coverImage);
        await deleteObject(ref(storage, oldPath));
      }

      setCoverImage(url);
      Swal.fire("Success", "Cover image updated!", "success");
    } catch (error) {
      Swal.fire("Error", "Image update failed", "error");
    }
  };

  const handleGalleryImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    try {
      const uniqueName = uuidv4(); // Match your uploadImagesToFirebase naming
      // const fileRef = ref(storage, `items/${id}/${uniqueName}`);
      const uploads = files.map((file) =>
        handleImageUpload(file, `items/${id}/${uniqueName}/gallery`)
      );
      const newImages = await Promise.all(uploads);

      const updatedGallery = [...galleryImages, ...newImages];
      setGalleryImages(updatedGallery);

      await updateItem({
        id,
        galleryImages: updatedGallery,
        ...getValues(),
      }).unwrap();
    } catch (error) {
      Swal.fire("Error", "Gallery update failed", "error");
    }
  };

  const handleRemoveImage = async (url) => {
    try {
      await deleteObject(ref(storage, getFirebasePathFromUrl(url)));
      const updated = galleryImages.filter((img) => img !== url);
      setGalleryImages(updated);

      await updateItem({
        id,
        galleryImages: updated,
        ...getValues(),
      }).unwrap();
    } catch (error) {
      Swal.fire("Error", "Image deletion failed", "error");
    }
  };

  // Form submission
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    Swal.fire({
      title: "Updating…",
      text: "Please wait while your item is being updated.",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });
    try {
      const payload = {
        ...data,
        features: features.filter((f) => f.trim()),
        colorOptions: colorOptions.filter((c) => c.trim()),
        ...specs,
        coverImage,
        galleryImages,
        oldPrice: parseFloat(data.oldPrice),
        newPrice: parseFloat(data.newPrice),
        stockQuantity: parseInt(data.stockQuantity, 10),
        rating: parseFloat(data.rating),
      };

      await updateItem({ id, ...payload }).unwrap();
      Swal.fire("Success", "Item updated successfully!", "success");
    } catch (error) {
      Swal.fire("Error", "Update failed", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <Loading />;
  if (isError) return <div>Error loading item</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-md shadow">
      <h2 className="text-2xl font-semibold mb-4">
        Update {itemsData?.item?.title || "Product"}
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Basic Fields */}
        <InputField label="Title" name="title" register={register} />
        <InputField
          label="Description"
          name="description"
          type="textarea"
          register={register}
        />
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
        <InputField
          label="Stock Quantity"
          name="stockQuantity"
          type="textarea"
          register={register}
        />
        <InputField
          label="Rating"
          name="rating"
          type="textarea"
          register={register}
        />

        {/* Features */}
        <div className="space-y-2">
          <label className="block font-medium">Features</label>
          {features.map((feat, idx) => (
            <div key={idx} className="flex gap-2">
              <input
                value={feat}
                onChange={(e) => {
                  const updated = [...features];
                  updated[idx] = e.target.value;
                  setFeatures(updated);
                }}
                className="flex-1 border p-2 rounded"
              />
              <button
                type="button"
                onClick={() =>
                  setFeatures((f) => f.filter((_, i) => i !== idx))
                }
                className="text-red-500"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setFeatures((f) => [...f, ""])}
            className="text-blue-600"
          >
            + Add Feature
          </button>
        </div>

        {/* Color Options */}
        <div className="space-y-2">
          <label className="block font-medium">Color Options</label>
          {colorOptions.map((color, idx) => (
            <div key={idx} className="flex gap-2">
              <input
                value={color}
                onChange={(e) => {
                  const updated = [...colorOptions];
                  updated[idx] = e.target.value;
                  setColorOptions(updated);
                }}
                className="flex-1 border p-2 rounded"
              />
              <button
                type="button"
                onClick={() =>
                  setColorOptions((c) => c.filter((_, i) => i !== idx))
                }
                className="text-red-500"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setColorOptions((c) => [...c, ""])}
            className="text-blue-600"
          >
            + Add Color
          </button>
        </div>

        {/* Specifications */}
        <div className="grid grid-cols-2 gap-4">
          <InputField label="Material" name="material" register={register} />
          <InputField
            label="Dimensions"
            name="dimensions"
            register={register}
          />
          <InputField label="Weight" name="weight" register={register} />
          <InputField label="Warranty" name="warranty" register={register} />
          <InputField
            label="Country of Origin"
            name="countryOfOrigin"
            register={register}
          />
        </div>

        {/* Category and Pricing */}
        <SelectField
          label="Category"
          name="category"
          options={[
            { value: "business", label: "Business" },
            { value: "technology", label: "Technology" },
            { value: "fiction", label: "Fiction" },
            { value: "horror", label: "Horror" },
            { value: "adventure", label: "Adventure" },
          ]}
          register={register}
          defaultValue={itemsData?.item?.category}
        />

        {/* Image Uploads */}
        <div className="space-y-4">
          <div>
            <label className="block font-medium mb-2">Cover Image</label>
            {coverImage && (
              <img
                src={coverImage}
                alt="Cover"
                className="w-32 h-32 object-cover mb-2"
              />
            )}
            <input type="file" onChange={handleCoverImageUpdate} />
          </div>

          <div>
            <label className="block font-medium mb-2">Gallery Images</label>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {galleryImages.map((url, idx) => (
                <div key={idx} className="relative">
                  <img
                    src={url}
                    alt={`Gallery ${idx}`}
                    className="w-full h-24 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(url)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <input type="file" multiple onChange={handleGalleryImageUpload} />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          {isSubmitting ? "Submitting…" : "Update Item"}
        </button>
      </form>
    </div>
  );
};

export default UpdateItems;
