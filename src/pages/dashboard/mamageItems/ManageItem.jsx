import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  useDeleteItemMutation,
  useFetchAllItemsQuery,
} from "../../../redux/features/itemAPI";
import Loading from "../../../components/Loading";
import { ref, deleteObject, listAll } from "firebase/storage";
import { storage } from "../../../firebase/firebase.config";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";

const ManageItem = () => {
  const navigate = useNavigate();

  const { data = {}, isLoading, isError, refetch } = useFetchAllItemsQuery();
  const items = data.item || [];

  const [deleteItem] = useDeleteItemMutation();
  const user = useSelector((state) => state.auth.user);
  console.log(user.role);

  const handleDeleteItem = async (itemId) => {
    if (user.role !== "admin") {
      Swal.fire({
        title: "Permission Denied",
        text: "You do not have permission to delete this item.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This will delete the item and all of its images.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        // 1. Get the reference to the folder
        const coverFolder = ref(storage, `items/${itemId}/cover`);
        const galleryFolder = ref(storage, `items/${itemId}/gallery`);

        // 2. List all files in that folder
        const [coverResult, galleryResult] = await Promise.all([
          listAll(coverFolder),
          listAll(galleryFolder),
        ]);
        // const result = await listAll(coverFolder, galleryFolder);

        // 3. Delete each file
        const deletionPromises = [
          ...coverResult.items.map((itemRef) => deleteObject(itemRef)),
          ...galleryResult.items.map((itemRef) => deleteObject(itemRef)),
        ];
        // const deletionPromises = result.items.map((itemRef) =>
        //   deleteObject(itemRef)
        // );
        await Promise.all(deletionPromises);

        // 4. Delete the item from the database
        await deleteItem(itemId).unwrap();

        // 5. Refetch items to update UI
        await refetch();

        Swal.fire(
          "Deleted!",
          "Item and its images have been removed.",
          "success"
        );
      } catch (error) {
        console.error("Error deleting item and its images:", error);
        Swal.fire("Error!", "Something went wrong during deletion.", "error");
      }
    }
  };

  const getFirebasePathFromUrl = (url) => {
    // Works for Firebase-hosted URLs like:
    // https://firebasestorage.googleapis.com/v0/b/your-bucket/o/items%2Ffilename.jpg?alt=media&token=abc
    const decodedUrl = decodeURIComponent(url);
    const base = "https://firebasestorage.googleapis.com/v0/b/";
    const start = decodedUrl.indexOf("/o/") + 3;
    const end = decodedUrl.indexOf("?alt=");
    const fullPath = decodedUrl.substring(start, end);
    return fullPath; // returns 'items/filename.jpg'
  };

  const handleEditClick = (id) => {
    navigate(`dashboard/edit-item/${id}`);
  };

  // console.log("Result is ", items);

  if (isLoading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  if (isError) {
    return <div>Error fetching items: {isError.message}</div>;
  }
  // console.log(items.map((item) => item.id));

  return (
    <section className="py-1 bg-blueGray-50">
      <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-2 mx-auto mt-24">
        <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded ">
          <div className="rounded-t mb-0 px-4 py-3 border-0">
            <div className="flex flex-wrap items-center">
              <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                <h3 className="font-semibold text-base text-blueGray-700">
                  All items
                </h3>
              </div>
              <div className="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
                <button
                  className="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                >
                  See all
                </button>
              </div>
            </div>
          </div>

          <div className="block w-full overflow-x-auto">
            <table className="items-center bg-transparent w-full border-collapse ">
              <thead>
                <tr>
                  <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                    #
                  </th>
                  <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                    Item Title
                  </th>
                  <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                    Category
                  </th>
                  <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                    Price
                  </th>
                  <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                    Stock Quantity
                  </th>
                  <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {items.length > 0 ? (
                  items.map((item, index) => (
                    <tr key={item.id}>
                      <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left text-blueGray-700 ">
                        {index + 1}
                      </th>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 ">
                        {item.title}
                      </td>
                      <td className="border-t-0 px-6 align-center border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                        {item.category}
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                        ${item.newPrice}
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                        {item.stockQuantity}
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 space-x-2">
                        <Link
                          to={`/dashboard/edit-item/${item.id}`}
                          className="font-medium text-indigo-600 hover:text-indigo-700 mr-4 hover:underline underline-offset-2"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={async () => {
                            const result = await Swal.fire({
                              title: "Are you sure?",
                              text: "This item will be permanently deleted!",
                              icon: "warning",
                              showCancelButton: true,
                              confirmButtonColor: "#d33",
                              cancelButtonColor: "#3085d6",
                              confirmButtonText: "Yes, delete it!",
                            });

                            if (result.isConfirmed) {
                              handleDeleteItem(item.id, item.coverImage);
                            }
                          }}
                          className="font-medium bg-red-500 py-1 px-4 rounded-full text-white mr-2"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center text-gray-500 py-4">
                      No items found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ManageItem;
