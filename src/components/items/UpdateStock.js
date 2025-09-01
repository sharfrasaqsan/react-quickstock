import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import React, { useState } from "react";
import { toast } from "sonner";
import { db } from "../../firebase/Config";
import { useData } from "../../contexts/DataContext";
import { useAuth } from "../../contexts/AuthContext";
import ButtonSpinner from "../../utils/ButtonSpinner";

const UpdateStock = ({ item }) => {
  const { user } = useAuth();
  const { setItems, setLogs } = useData();

  const [updatedStock, setUpdatedStock] = useState(null);

  const [updateLoading, setUpdateLoading] = useState(false);

  const handleUpdatedStock = async (itemId) => {
    if (!updatedStock) {
      toast.error("Stock cannot be empty.");
      return;
    }

    setUpdateLoading(true);
    try {
      const updatedStockValue = Number(item.stock) + Number(updatedStock);
      await updateDoc(doc(db, "items", itemId), { stock: updatedStockValue });
      setItems((prev) =>
        prev?.map((item) =>
          item.id === itemId ? { ...item, stock: updatedStockValue } : item
        )
      );
      toast.success("Stock updated successfully");
      setUpdatedStock("");

      // New log
      const newLog = {
        userId: user.id,
        action: "UPDATE_STOCK",
        itemName: item.name,
        stockFrom: item.stock,
        stockTo: updatedStockValue,
        itemUnit: item.unit,
        createdAt: serverTimestamp(),
        createdAtMs: Date.now(),
      };
      const updateLog = await addDoc(collection(db, "logs"), newLog);
      setLogs((prev) => [...prev, { id: updateLog.id, ...newLog }]);
    } catch (err) {
      console.log(
        "Error updating stock",
        "error: ",
        err,
        "error message: ",
        err.message
      );
      toast.error("Error updating stock");
    }
    setUpdateLoading(false);
  };

  return (
    <div>
      <form onSubmit={(e) => e.preventDefault()}>
        <div>
          <label htmlFor="updatedStock">Enter updated stock value</label>
          <input
            type="number"
            name="updatedStock"
            id="updatedStock"
            placeholder="Enter updated stock value"
            value={updatedStock}
            onChange={(e) => setUpdatedStock(e.target.value)}
          />
        </div>

        {updatedStock && (
          <div>
            {item.stock} + {updatedStock} ={" "}
            {Number(item.stock) + Number(updatedStock)} {item.unit}
          </div>
        )}

        <button type="submit" onClick={() => handleUpdatedStock(item.id)}>
          {updateLoading ? (
            <>
              Updating... <ButtonSpinner />{" "}
            </>
          ) : (
            "Update"
          )}
        </button>
      </form>
    </div>
  );
};

export default UpdateStock;
