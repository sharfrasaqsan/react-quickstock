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
    <form
      onSubmit={(e) => e.preventDefault()}
      className="field"
      style={{ maxWidth: "225px" }}
    >
      {/* Input + Button inline */}
      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <input
          type="number"
          name="updatedStock"
          id="updatedStock"
          placeholder="+/- Stock"
          className="input"
          value={updatedStock ?? ""}
          onChange={(e) => setUpdatedStock(e.target.value)}
          style={{ flex: 1 }}
        />

        <button
          type="submit"
          onClick={() => handleUpdatedStock(item.id)}
          className="btn btn--primary"
          disabled={updateLoading}
        >
          {updateLoading ? <ButtonSpinner /> : "Update"}
        </button>
      </div>

      {/* Small preview */}
      {updatedStock && (
        <small className="mt-2 text-muted">
          {item.stock} + {updatedStock} ={" "}
          <b>
            {Number(item.stock) + Number(updatedStock)} {item.unit}
          </b>
        </small>
      )}
    </form>
  );
};

export default UpdateStock;
