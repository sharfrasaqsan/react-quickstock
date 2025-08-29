import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useState } from "react";
import { toast } from "sonner";
import { db } from "../firebase/Config";
import { useData } from "../contexts/DataContext";
import ButtonSpinner from "../utils/ButtonSpinner";
import LoadingSpinner from "../utils/LoadingSpinner";
import PageHeader from "../components/PageHeader";
import { Link } from "react-router-dom";

const AddItem = () => {
  const { setItems, loading } = useData();

  const [name, setName] = useState("");
  const [stock, setStock] = useState(0);
  const [unit, setUnit] = useState("");

  const [buttonLoading, setButtonLoading] = useState(false);

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

    if (stock % 1 !== 0) {
      toast.error("Stock must be an integer.");
      setButtonLoading(false);
      return;
    }

    if (stock === 0) {
      toast.error("Stock cannot be zero.");
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
        unit,
        createdAt: serverTimestamp(),
      };
      await addDoc(collection(db, "items"), newItem);
      setItems((prev) => [...prev, newItem]);
      toast.success("Item added successfully");
      setName("");
      setStock(0);
      setUnit("");
    } catch (err) {
      console.log(
        "Error adding item",
        "error: ",
        err,
        "error message: ",
        err.message
      );
      toast.error("Error adding item");
    }
    setButtonLoading(false);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <section className="container stack">
      <PageHeader
        title="Add Item"
        subtitle="Create a new inventory item for QuickStock."
        actions={
          <>
            <Link to="/" className="btn btn--outline">
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
