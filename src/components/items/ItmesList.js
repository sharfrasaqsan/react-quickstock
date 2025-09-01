import React from "react";
import { useData } from "../../contexts/DataContext";
import ItemsCard from "./ItemsCard";
import LoadingSpinner from "../../utils/LoadingSpinner";
import { useAuth } from "../../contexts/AuthContext";
import NotFoundText from "../../utils/NotFoundText";

const ItmesList = () => {
  const { user } = useAuth();
  const { items, loading } = useData();

  if (loading) return <LoadingSpinner />;
  if (!items || items.length === 0)
    return <NotFoundText text={"No items added yet. Please add one first."} />;

  return (
    <div className="cards-list">
      {items.map((item, index) => (
        <ItemsCard key={item.id} item={item} index={index} user={user} />
      ))}
    </div>
  );
};

export default ItmesList;
