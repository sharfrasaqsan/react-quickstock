import React, { useMemo } from "react";
import { useData } from "../../contexts/DataContext";
import ItemsCard from "./ItemsCard";
import LoadingSpinner from "../../utils/LoadingSpinner";
import { useAuth } from "../../contexts/AuthContext";
import NotFoundText from "../../utils/NotFoundText";

const ItmesList = ({ activeTab = "inStock" }) => {
  const { user } = useAuth();
  const { items, filteredItems, itemSearch, loading } = useData();

  const status = (item) => {
    if (item.stock === 0) return "outOfStock";
    if (item.stock <= item.lowStock) return "lowStock";
    return "inStock";
  };

  const visibleItems = useMemo(() => {
    return filteredItems?.filter((item) => status(item) === activeTab);
  }, [filteredItems, activeTab]);

  if (loading) return <LoadingSpinner />;
  if (!items || items.length === 0) {
    return <NotFoundText text="No items yet. Please add your first item." />;
  }

  if (visibleItems.length === 0) {
    return (
      <NotFoundText
        text={
          itemSearch?.trim()
            ? `No ${activeTab
                .replace(/([A-Z])/g, " $1")
                .toLowerCase()} items match “${itemSearch}”.`
            : `No items in ${activeTab
                .replace(/([A-Z])/g, " $1")
                .toLowerCase()}.`
        }
      />
    );
  }

  return (
    <div className="cards-list">
      {visibleItems?.map((item, index) => (
        <ItemsCard key={item.id} item={item} index={index} user={user} />
      ))}
    </div>
  );
};

export default ItmesList;
