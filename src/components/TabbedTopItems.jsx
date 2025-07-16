import { useState } from "react";

const TabbedTopItems = ({ mostPurchased = [], leastPurchased = [] }) => {
  const [tab, setTab] = useState("most");

  const activeList = tab === "most" ? mostPurchased : leastPurchased;

  const exportToCSV = () => {
    const rows = activeList.map((item) => ({
      title: item.title,
      sold: item.totalSold,
      stock: item.stockQuantity,
    }));

    const csv = [
      "Title,Sold,Stock",
      ...rows.map((r) => `${r.title},${r.sold},${r.stock}`),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${
      tab === "most" ? "most-purchased" : "least-purchased"
    }-items.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="col-span-2 row-span-3 bg-white shadow rounded-lg flex flex-col">
      {/* Header with Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-6 py-5 font-semibold border-b border-gray-100">
        <span>
          {tab === "most" ? "Most Purchased Items" : "Least Purchased Items"}
        </span>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-start sm:justify-end">
          <button
            onClick={() => setTab("most")}
            className={`px-3 py-1 rounded ${
              tab === "most"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            🔥 Most
          </button>
          <button
            onClick={() => setTab("least")}
            className={`px-3 py-1 rounded ${
              tab === "least"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            🧊 Least
          </button>
          <button
            onClick={exportToCSV}
            className="px-3 py-1 rounded bg-green-500 text-white hover:bg-green-600"
          >
            📤 Export CSV
          </button>
        </div>
      </div>

      {/* Scrollable List */}
      <div className="flex-grow overflow-y-auto" style={{ maxHeight: "24rem" }}>
        <ul className="p-6 space-y-4">
          {activeList.map((item, idx) => (
            <li key={idx} className="flex justify-between items-center">
              <div>
                <div className="font-medium text-gray-800">{item.title}</div>
                <div className="text-sm">
                  {item.totalSold === 0 ? (
                    <span className="text-red-500 font-bold">Never Sold</span>
                  ) : (
                    <span className="text-gray-500">{item.totalSold} sold</span>
                  )}
                  {" • "}
                  {item.stockQuantity <= 0 ? (
                    <span className="text-red-600 font-bold">Out of stock</span>
                  ) : (
                    <span className="text-gray-600">
                      {item.stockQuantity} in stock
                    </span>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TabbedTopItems;
