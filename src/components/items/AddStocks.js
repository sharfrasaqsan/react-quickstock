import React from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/Config";
import { useData } from "../../contexts/DataContext";
import { toast } from "sonner";

const AddStocks = ({ item }) => {
  const { setItems } = useData();

  const addStocks = async () => {
    try {
      const updatedStocks = item.stock + 1;
      await updateDoc(doc(db, "items", item.id), { stock: updatedStocks });
      setItems((prev) =>
        prev?.map((i) =>
          i.id === item.id ? { ...i, stock: updatedStocks } : i
        )
      );
    } catch (err) {
      console.log(
        "Error adding stocks",
        "error: ",
        err,
        "error message: ",
        err.message
      );
      toast.error("Error adding stocks");
    }
  };

  return (
    <button className="btn btn--primary" onClick={addStocks}>
      +1
    </button>
  );
};

export default AddStocks;
