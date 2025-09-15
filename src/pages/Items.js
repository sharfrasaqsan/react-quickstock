import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useData } from "../contexts/DataContext";
import LoadingSpinner from "../utils/LoadingSpinner";
import ItemCard from "../components/items/ItemsCard";
import ItemsList from "../components/items/ItemsList";

function Items() {
  const { items = [], loading } = useData();

  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // all | inStock | lowStock | outOfStock

  if (loading) return <LoadingSpinner />;

  // tiny helpers (keep it obvious)
  const num = (n) => (Number(n) || 0).toLocaleString();
  const thresholdOf = (it) =>
    typeof it.lowStock === "number"
      ? it.lowStock
      : typeof it.minStock === "number"
      ? it.minStock
      : 0;
  const statusOf = (it) => {
    const stock = Number(it.stock) || 0;
    const thr = thresholdOf(it);
    if (stock === 0) return "out";
    if (thr > 0 && stock <= thr) return "low";
    return "in";
  };
  const matchesQuery = (it) => {
    if (!query) return true;
    const q = query.toLowerCase();
    const name = String(it.name ?? "").toLowerCase();
    const id = String(it.id ?? it.sku ?? "").toLowerCase();
    return name.includes(q) || id.includes(q);
  };

  // filter + counts (plain loop)
  const visibleItems = [];
  let countAll = 0,
    countIn = 0,
    countLow = 0,
    countOut = 0;

  for (const it of items) {
    if (!matchesQuery(it)) continue;

    countAll += 1;
    const s = statusOf(it); // "in" | "low" | "out"
    if (s === "in") countIn += 1;
    if (s === "low") countLow += 1;
    if (s === "out") countOut += 1;

    const tabMatches =
      activeTab === "all" ||
      (activeTab === "inStock" && s === "in") ||
      (activeTab === "lowStock" && s === "low") ||
      (activeTab === "outOfStock" && s === "out");

    if (tabMatches) visibleItems.push(it);
  }

  return (
    <div className="container my-3">
      {/* Page header */}
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-2 pb-3 mb-3 border-bottom">
        <div>
          <h1 className="h3 mb-1">Items</h1>
          <p className="text-muted mb-0">
            Search, filter, and update stock inline.
          </p>
        </div>
        <div className="d-flex gap-2">
          <Link to="/add-item" className="btn btn-primary">
            Add Item
          </Link>
          <Link to="/dashboard" className="btn btn-outline-secondary">
            Back to Dashboard
          </Link>
        </div>
      </div>

      {/* Search + tabs */}
      <div className="card mb-3">
        <div className="card-body">
          <div className="row g-2 align-items-center">
            <div className="col-12 col-md-6">
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="form-control"
                placeholder="Search by name or ID…"
                aria-label="Search items"
              />
            </div>

            <div className="col-12 col-md-6 d-flex justify-content-md-end">
              <div
                className="btn-group gap-3"
                role="tablist"
                aria-label="Item filters"
              >
                <button
                  type="button"
                  className={`btn ${
                    activeTab === "all" ? "btn-primary" : "btn-outline-primary"
                  }`}
                  onClick={() => setActiveTab("all")}
                  aria-pressed={activeTab === "all"}
                >
                  All ({num(countAll)})
                </button>
                <button
                  type="button"
                  className={`btn ${
                    activeTab === "inStock"
                      ? "btn-success"
                      : "btn-outline-success"
                  }`}
                  onClick={() => setActiveTab("inStock")}
                  aria-pressed={activeTab === "inStock"}
                >
                  In ({num(countIn)})
                </button>
                <button
                  type="button"
                  className={`btn ${
                    activeTab === "lowStock"
                      ? "btn-warning"
                      : "btn-outline-warning"
                  }`}
                  onClick={() => setActiveTab("lowStock")}
                  aria-pressed={activeTab === "lowStock"}
                >
                  Low ({num(countLow)})
                </button>
                <button
                  type="button"
                  className={`btn ${
                    activeTab === "outOfStock"
                      ? "btn-danger"
                      : "btn-outline-danger"
                  }`}
                  onClick={() => setActiveTab("outOfStock")}
                  aria-pressed={activeTab === "outOfStock"}
                >
                  Out ({num(countOut)})
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cards on mobile */}
      <div className="row g-3 d-lg-none">
        {visibleItems.length === 0 ? (
          <div className="col-12">
            <p className="text-muted mb-0">
              No items match your search/filter.
            </p>
          </div>
        ) : (
          visibleItems.map((it) => (
            <div key={it.id} className="col-12 col-sm-6">
              <ItemCard item={it} />
            </div>
          ))
        )}
      </div>

      {/* Table on desktop */}
      <div className="d-none d-lg-block">
        <ItemsList items={visibleItems} />
      </div>
    </div>
  );
}

export default Items;
