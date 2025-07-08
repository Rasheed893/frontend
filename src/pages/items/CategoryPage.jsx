import React from "react";
import { useParams } from "react-router-dom";
import Loading from "../../components/Loading";
import ItemCard from "./ItemCard";
import { useFetchAllItemsQuery } from "../../redux/features/itemAPI";

const CategoryPage = () => {
  const { category } = useParams();
  const { data: itemsData = {}, isLoading, isError } = useFetchAllItemsQuery();
  const items = itemsData.item || [];

  // Filter items by category
  const filteredItems = items.filter(
    (item) => item.category.toLowerCase() === category.toLowerCase()
  );

  if (isLoading) return <Loading />;
  if (isError) return <div>Error loading category items</div>;

  return (
    <div className="container mx-auto px-3 py-6">
      <h1 className="text-3xl font-bold mb-6 capitalize">
        {category.replace("-", " ")}
      </h1>
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500">No products found.</div>
      )}
    </div>
  );
};

export default CategoryPage;
