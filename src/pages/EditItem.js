import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { db } from "../firebase/Config";
import { useData } from "../contexts/DataContext";
import ButtonSpinner from "../utils/ButtonSpinner";
import LoadingSpinner from "../utils/LoadingSpinner";
import PageHeader from "../components/PageHeader";
import { useAuth } from "../contexts/AuthContext";

const EditItem = () => {
  const { user } = useAuth();
  const { items, setItems, setLogs, loading } = useData();

  const [name, setName] = useState("");
  const [stock, setStock] = useState(0);
  const [unit, setUnit] = useState("");

  const [buttonLoading, setButtonLoading] = useState(false);

  const { id } = useParams();

  const item = items?.find((item) => item.id === id);

  useEffect(() => {
    if (item) {
      setName(item.name);
      setStock(item.stock);
      setUnit(item.unit);
    }
  }, [item]);

  const handleUpdateItem = async (itemId) => {
    if (!itemId) {
      toast.error("Missing item id");
      return;
    }

    setButtonLoading(true);

    if (name.trim() === "") {
      toast.error("Name cannot be empty.");
      setButtonLoading(false);
      return;
    }

    if (stock === null) {
      toast.error("Stock cannot be empty.");
      setButtonLoading(false);
      return;
    }

    if (unit.trim() === "") {
      toast.error("Unit cannot be empty.");
      setButtonLoading(false);
      return;
    }

    if (stock < 0) {
      toast.error("Stock cannot be negative.");
      setButtonLoading(false);
      return;
    }

    if (unit.length > 10) {
      toast.error("Unit cannot be more than 10 characters.");
      setButtonLoading(false);
      return;
    }

    if (name.length > 50) {
      toast.error("Name cannot be more than 50 characters.");
      setButtonLoading(false);
      return;
    }

    try {
      const updatedItem = {
        name,
        stock,
        unit,
        updatedAt: serverTimestamp(),
      };
      await updateDoc(doc(db, "items", itemId), updatedItem);
      setItems((prev) =>
        prev?.map((i) => (i.id === itemId ? { ...i, ...updatedItem } : i))
      );
      toast.success("Item updated successfully");
      setName("");
      setStock(0);
      setUnit("");

      // New Log
      const newLog = {
        userId: user.id,
        action: "UPDATE_ITEM",
        itemName: item.name,
        updatedItemName: name,
        stockFrom: item.stock,
        stockTo: stock,
        itemUnit: item.unit,
        updatedItemUnit: unit,
        createdAt: serverTimestamp(),
        createdAtMs: Date.now(),
      };
      const updateLog = await addDoc(collection(db, "logs"), newLog);
      setLogs((prev) => [...prev, { id: updateLog.id, ...newLog }]);
    } catch (err) {
      console.log(
        "Error updating item",
        "error: ",
        err,
        "error message: ",
        err.message
      );
      toast.error("Error updating item");
    }
    setButtonLoading(false);
  };

  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/" replace />;
  if (!items) return <p>No items found</p>;
  if (!item) return <p>Item not found</p>;

  return (
    <section className="container stack">
      <PageHeader
        title={`Update: ${item.name}`}
        subtitle="Update the item details below."
        actions={
          <Link to="/" className="btn btn--outline">
            Back to Dashboard
          </Link>
        }
      />
      <form
        className="card card--padded stack"
        onSubmit={(e) => {
          e.preventDefault();
          handleUpdateItem(item.id);
        }}
      >
        <div className="field">
          <label className="label" htmlFor="name">
            Item Name
          </label>
          <input
            className="input"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="field">
          <label className="label" htmlFor="stock">
            Stock
          </label>
          <input
            className="input"
            type="number"
            id="stock"
            value={stock}
            onChange={(e) => setStock(Number(e.target.value))}
          />
        </div>

        <div className="field">
          <label className="label" htmlFor="unit">
            Unit
          </label>
          <select
            className="select"
            id="unit"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
          >
            <option value="" disabled>
              Select a unit
            </option>
            <option value="kg">kg</option>
            <option value="L">L</option>
            <option value="pcs">pcs</option>
          </select>
        </div>

        <div>
          <button
            type="submit"
            className="btn btn--primary"
            disabled={buttonLoading}
          >
            {buttonLoading ? (
              <>
                Updating… <ButtonSpinner />
              </>
            ) : (
              "Update Item"
            )}
          </button>
        </div>
      </form>
    </section>
  );
};

export default EditItem;
