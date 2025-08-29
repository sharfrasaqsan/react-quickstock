import React from "react";
import { useData } from "../../contexts/DataContext";
import { toast } from "sonner";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/Config";

const RemoveStocks = ({ item }) => {
  const { setItems } = useData();
  const removeStocks = async () => {
    try {
      const updatedStocks = item.stock - 1;
      await updateDoc(doc(db, "items", item.id), { stock: updatedStocks });
      setItems((prev) =>
        prev?.map((i) =>
          i.id === item.id ? { ...i, stock: updatedStocks } : i
        )
      );
    } catch (err) {
      console.log(
        "Error removing stocks",
        "error: ",
        err,
        "error message: ",
        err.message
      );
      toast.error("Error removing stocks");
    }
  };

  return (
    <>
      <button onClick={() => removeStocks()}>Remove</button>
    </>
  );
};

export default RemoveStocks;
