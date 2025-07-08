import { useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { useSearchItemsQuery } from "../redux/features/itemAPI";
import Loading from "./Loading";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isLoading } = useSearchItemsQuery(searchTerm, {
    skip: searchTerm.length < 2, // don't run query on empty input
  });

  return (
    <div>
      <div className="relative sm:w-72 w-40 space-x-2 mb-4">
        <IoIosSearch className="absolute left-2 inset-y-2.5" />
        <input
          type="text"
          placeholder="search here"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-[#EAEAEA] w-full py-1 md:px-8 px-7 rounded-md focus:outline-none"
        />
      </div>

      {isLoading && <Loading />}

      {data?.items?.length > 0
        ? data.items.map((item) => (
            <div key={item.id} className="mb-2">
              <h2 className="text-lg font-semibold">{item.title}</h2>
              <p>{item.description}</p>
            </div>
          ))
        : searchTerm.length > 1 && <p>No results found</p>}
    </div>
  );
};

export default SearchBar;
