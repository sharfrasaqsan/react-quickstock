import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase/Config";
import { useData } from "../../contexts/DataContext";
import { useMemo, useState } from "react";
import ButtonSpinner from "../../utils/ButtonSpinner";
import UpdateStock from "./UpdateStock";

const ItemsCard = ({ item, index, user }) => {
  const { setItems, setLogs } = useData();
  const [deleteLoading, setDeleteLoading] = useState(false);

  const isLow = useMemo(() => {
    if (typeof item.lowStockThreshold !== "number") return false;
    return item.stock <= item.lowStockThreshold;
  }, [item.stock, item.lowStockThreshold]);

  const deleteItem = async (itemId) => {
    setDeleteLoading(true);
    try {
      await deleteDoc(doc(db, "items", itemId));
      setItems((prev) => prev.filter((item) => item.id !== itemId));
      toast.success("Item deleted successfully");

      // new Log
      const newLog = {
        userId: user.id,
        action: "DELETE_ITEM",
        itemName: item.name,
        stock: item.stock,
        itemUnit: item.unit,
        createdAt: serverTimestamp(),
        createdAtMs: Date.now(),
      };
      const deleteLog = await addDoc(collection(db, "logs"), newLog);
      setLogs((prev) => [...prev, { id: deleteLog.id, ...newLog }]);
    } catch (err) {
      console.log(
        "Error deleting item",
        "error: ",
        err,
        "error message: ",
        err.message
      );
      toast.error("Error deleting item");
    }
    setDeleteLoading(false);
  };

  if (!item) return <p>Item not found</p>;
  if (!user) return <p>User not found</p>;

  return (
    <article className={`item-card card ${isLow ? "item-card--low" : ""}`}>
      <div className="item-card__main">
        <div className="item-card__title">
          <span className="item-card__index" aria-hidden>
            {index + 1}.
          </span>
          <div className="item-card__name">
            <strong>{item.name}</strong>
            {isLow && <span className="badge badge--low">Low</span>}
          </div>
        </div>

        <div className="item-card__stock">
          <span
            className="item-card__count"
            title={
              item.unit
                ? `${item.stock} ${item.unit} ${item.name}`
                : String(item.stock)
            }
          >
            {item.stock}
            {item.unit ? ` ${item.unit}` : ""}
          </span>

          <div
            className="item-card__stepper stepper"
            aria-label={`Adjust ${item.name} stock`}
          >
            {/* <RemoveStocks item={item} />
            <AddStocks item={item} /> */}
            <UpdateStock item={item} />
          </div>
        </div>
      </div>

      <div className="item-card__actions">
        <Link to={`/edit-item/${item.id}`} className="btn btn--info">
          Edit
        </Link>
        <button
          className="btn btn--danger"
          onClick={() => deleteItem(item.id)}
          disabled={deleteLoading}
        >
          {deleteLoading ? (
            <>
              Deleting… <ButtonSpinner />
            </>
          ) : (
            "Delete"
          )}
        </button>
      </div>
    </article>
  );
};

export default ItemsCard;
