import React from "react";
import { useData } from "../../contexts/DataContext";
import ItemsCard from "./ItemsCard";
import LoadingSpinner from "../../utils/LoadingSpinner";

const ItmesList = () => {
  const { items, loading } = useData();

  if (loading) return <LoadingSpinner />;
  if (!items || items.length === 0) {
    return (
      <div className="card card--padded">
        <p className="text-muted">
          No items yet. Add your first item to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="cards-list">
      {items.map((item, index) => (
        <ItemsCard key={item.id} item={item} index={index} />
      ))}
    </div>
  );
};

export default ItmesList;
