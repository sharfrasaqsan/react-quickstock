import React from "react";
import { useData } from "../../contexts/DataContext";
import ItemsCard from "./ItemsCard";
import LoadingSpinner from "../../utils/LoadingSpinner";
import { useAuth } from "../../contexts/AuthContext";
import NotFoundText from "../../utils/NotFoundText";

const ItmesList = () => {
  const { user } = useAuth();
  const { items, filteredItems, itemSearch, loading } = useData();

  if (loading) return <LoadingSpinner />;

  if (!filteredItems || filteredItems.length === 0)
    return <NotFoundText text={`No items match the ${itemSearch} criteria.`} />;

  if (!items || items.length === 0)
    return <NotFoundText text={"No items yet."} />;

  return (
    <div className="cards-list">
      {filteredItems?.map((item, index) => (
        <ItemsCard key={item.id} item={item} index={index} user={user} />
      ))}
    </div>
  );
};

export default ItmesList;
