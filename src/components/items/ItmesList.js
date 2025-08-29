import React from "react";
import { useData } from "../../contexts/DataContext";
import ItemsCard from "./ItemsCard";
import LoadingSpinner from "../../utils/LoadingSpinner";

const ItmesList = () => {
  const { items, loading } = useData();
  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <table className="table table-hover">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Stock</th>
            <th scope="col">Add Stock</th>
            <th scope="col">Remove Stock</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {items?.map((item, index) => (
            <ItemsCard key={item.id} item={item} index={index} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ItmesList;
