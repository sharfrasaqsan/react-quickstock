// src/pages/Dashboard.js
import React, { useState } from "react";
import ItmesList from "../components/items/ItmesList";
import PageHeader from "../components/PageHeader";
import { Link } from "react-router-dom";
import ItemSearch from "../components/items/ItemSearch";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("inStock");

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
            <button
              role="tab"
              aria-selected={activeTab === "inStock"}
              className={`tab ${activeTab === "inStock" ? "active" : ""}`}
              onClick={() => setActiveTab("inStock")}
            >
              In Stock
            </button>
            <button
              role="tab"
              aria-selected={activeTab === "lowStock"}
              className={`tab ${activeTab === "lowStock" ? "active" : ""}`}
              onClick={() => setActiveTab("lowStock")}
            >
              Low Stock
            </button>
            <button
              role="tab"
              aria-selected={activeTab === "outOfStock"}
              className={`tab ${activeTab === "outOfStock" ? "active" : ""}`}
              onClick={() => setActiveTab("outOfStock")}
            >
              Out of Stock
            </button>
          </div>

          <ItmesList activeTab={activeTab} />
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
