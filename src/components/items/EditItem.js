import { collection, serverTimestamp, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { db } from "../../firebase/Config";
import { useData } from "../../contexts/DataContext";
import ButtonSpinner from "../../utils/ButtonSpinner";
import { useParams } from "react-router-dom";

const EditItem = () => {
  const { items, setItems } = useData();

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
      const updatedItem = {
        name,
        stock,
        unit,
        timestamp: serverTimestamp(),
      };
      await updateDoc(collection(db, "items", itemId), updatedItem);
      setItems((prev) =>
        prev?.map((i) => (i.id === itemId ? { ...i, ...updatedItem } : i))
      );
      toast.success("Item updated successfully");
      setName("");
      setStock(0);
      setUnit("");
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

  return (
    <section>
      <h2>Update Item</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleUpdateItem(item.id);
        }}
      >
        <div>
          <label htmlFor="name">Item Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            autoComplete="off"
          />
        </div>

        <div>
          <label htmlFor="stock">Stock</label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="unit">Unit</label>
          <select
            name="unit"
            id="unit"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
          >
            <option value="" disabled selected>
              Select a unit
            </option>
            <option value="kg">kg</option>
            <option value="L">L</option>
          </select>
        </div>

        <div>
          <button type="submit" disabled={buttonLoading}>
            {buttonLoading ? (
              <>
                Adding... <ButtonSpinner />
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

export default EditItem;
