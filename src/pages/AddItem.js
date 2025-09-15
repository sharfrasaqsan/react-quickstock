import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useState } from "react";
import { toast } from "sonner";
import { db } from "../firebase/Config";
import { useData } from "../contexts/DataContext";
import ButtonSpinner from "../utils/ButtonSpinner";
import LoadingSpinner from "../utils/LoadingSpinner";
import PageHeader from "../components/PageHeader";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const AddItem = () => {
  const { user } = useAuth();
  const { setItems, setLogs, loading } = useData();

  const [name, setName] = useState("");
  const [stock, setStock] = useState("");
  const [lowStock, setLowStock] = useState("");
  const [unit, setUnit] = useState("");

  const [buttonLoading, setButtonLoading] = useState(false);
  const navigate = useNavigate();

  const handleAddItem = async () => {
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

    if (lowStock === null) {
      toast.error("Low stock cannot be empty.");
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

    if (lowStock < 0) {
      toast.error("Low stock cannot be negative.");
      setButtonLoading(false);
      return;
    }

    if (lowStock > stock) {
      toast.error("Low stock cannot be greater than stock.");
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
      const newItem = {
        name,
        stock,
        lowStock,
        unit,
        createdAt: serverTimestamp(),
      };
      const res = await addDoc(collection(db, "items"), newItem);
      setItems((prev) => [...prev, { id: res.id, ...newItem }]);
      toast.success("Item added successfully");
      setName("");
      setStock("");
      setUnit("");
      navigate("/");

      // New log
      const newLog = {
        userId: user.id,
        action: "ADD_ITEM",
        itemName: name,
        itemStock: stock,
        itemUnit: unit,
        createdAt: serverTimestamp(),
        createdAtMs: Date.now(),
      };
      const addLog = await addDoc(collection(db, "logs"), newLog);
      setLogs((prev) => [...prev, { id: addLog.id, ...newLog }]);
    } catch (err) {
      console.log("Error adding item", err.code, err.message);
      toast.error("Error adding item");
    }
    setButtonLoading(false);
  };

  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <section className="container my-3 stack">
      <PageHeader
        title="Add Item"
        subtitle="Create a new inventory item for QuickStock."
        actions={
          <>
            <Link to="/" className="btn btn-primary">
              Back to Dashboard
            </Link>
          </>
        }
      />

      <form
        className="card card--padded stack"
        onSubmit={(e) => {
          e.preventDefault();
          handleAddItem();
        }}
      >
        <div className="field">
          <label className="label" htmlFor="name">
            Item Name
          </label>
          <input
            className="input"
            type="text"
            id="name"
            value={name}
            placeholder="Enter item name"
            onChange={(e) => setName(e.target.value)}
            autoFocus
            autoComplete="off"
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
            placeholder="Enter stock"
            value={stock}
            onChange={(e) => setStock(Number(e.target.value))}
          />
        </div>

        <div className="field">
          <label className="label" htmlFor="lowStock">
            Low Stock
          </label>
          <input
            className="input"
            type="number"
            id="lowStock"
            placeholder="Enter low stock"
            value={lowStock}
            onChange={(e) => setLowStock(Number(e.target.value))}
          />
        </div>

        <div className="field">
          <label className="label" htmlFor="unit">
            Unit
          </label>
          <select
            className="select"
            id="unit"
            name="unit"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
          >
            <option value="" disabled>
              Select a unit
            </option>
            <option value="kg">kg</option>
            <option value="L">L</option>
            <option value="pcs">pcs</option>
            <option value="cans">cans</option>
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
                Adding… <ButtonSpinner />
              </>
            ) : (
              "Add Item"
            )}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AddItem;
