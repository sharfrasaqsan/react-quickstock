import React, { useState, useMemo } from "react";
import ItmesList from "../components/items/ItmesList";
import PageHeader from "../components/PageHeader";
import { Link } from "react-router-dom";
import ItemSearch from "../components/items/ItemSearch";
import { useData } from "../contexts/DataContext";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("inStock");
  const { filteredItems } = useData();

  const getStatus = (item) => {
    if (item.stock === 0) return "outOfStock";
    if (item.stock <= item.lowStock) return "lowStock";
    return "inStock";
  };

  const itemCounts = useMemo(() => {
    const counts = { inStock: 0, lowStock: 0, outOfStock: 0 };
    filteredItems?.forEach((item) => {
      const status = getStatus(item);
      counts[status]++;
    });
    return counts;
  }, [filteredItems]);

  return (
    <section className="container stack">
      <PageHeader
        title="Dashboard"
        subtitle="View and update your café’s inventory in real time."
        actions={
          <Link to="/add-item" className="btn btn--primary">
            Add Item
          </Link>
        }
      />
      <div className="card card--padded">
        <div>
          <ItemSearch />
        </div>

        <div>
          <div className="tabs" role="tablist" aria-label="Inventory filters">
            {["inStock", "lowStock", "outOfStock"].map((tabKey) => (
              <button
                key={tabKey}
                role="tab"
                aria-selected={activeTab === tabKey}
                className={`tab ${activeTab === tabKey ? "active" : ""}`}
                onClick={() => setActiveTab(tabKey)}
              >
                {tabKey === "inStock" && `In Stock (${itemCounts.inStock})`}
                {tabKey === "lowStock" && `Low Stock (${itemCounts.lowStock})`}
                {tabKey === "outOfStock" &&
                  `Out of Stock (${itemCounts.outOfStock})`}
              </button>
            ))}
          </div>

          <ItmesList activeTab={activeTab} />
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
