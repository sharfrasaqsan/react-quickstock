import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase/Config";
import { useData } from "../../contexts/DataContext";
import { useAuth } from "../../contexts/AuthContext";
import ButtonSpinner from "../../utils/ButtonSpinner";

export default function ItemsCard({ item }) {
  const { user } = useAuth();
  const { setItems, setLogs } = useData();

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [stockInput, setStockInput] = useState(
    String(Number(item?.stock) || 0)
  );
  const [isInvalid, setIsInvalid] = useState(false);

  const [deleteLoading, setDeleteLoading] = useState(false);

  const status = useMemo(() => {
    const s = Number(item?.stock ?? 0);
    const thr = Number(item?.lowStock ?? 0);
    if (s <= 0) return "out";
    if (s <= thr) return "low";
    return "in";
  }, [item]);

  const badge = useMemo(() => {
    switch (status) {
      case "out":
        return { className: "badge text-bg-danger", text: "Out of stock" };
      case "low":
        return { className: "badge text-bg-warning", text: "Low stock" };
      default:
        return { className: "badge text-bg-success", text: "In stock" };
    }
  }, [status]);

  // Subtle row background per status (keeps stripes & hover)
  const rowClass =
    status === "out"
      ? "table-danger"
      : status === "low"
      ? "table-warning"
      : "table-success-subtle";

  function onStockChange(e) {
    const v = e.target.value;
    setStockInput(v);
    const n = Number(v);
    setIsInvalid(!(Number.isFinite(n) && n >= 0 && Number.isInteger(n)));
  }

  function startEdit() {
    setStockInput(String(Number(item.stock) || 0));
    setIsInvalid(false);
    setEditing(true);
  }

  function cancel() {
    setEditing(false);
    setStockInput(String(Number(item.stock) || 0));
    setIsInvalid(false);
  }

  async function save() {
    if (isInvalid || stockInput === "") {
      toast.error("Please enter a valid non-negative whole number.");
      return;
    }
    if (user?.role === "worker") {
      toast.error("You are not allowed to update items");
      return;
    }

    const nextStock = Number(stockInput);
    setSaving(true);
    try {
      await updateDoc(doc(db, "items", item.id), {
        stock: nextStock,
        updatedAt: serverTimestamp(),
      });

      setItems((prev) =>
        prev?.map((i) => (i.id === item.id ? { ...i, stock: nextStock } : i))
      );

      const newLog = {
        userId: user?.id,
        action: "UPDATE_STOCK",
        itemName: item.name,
        stockFrom: item.stock,
        stockTo: nextStock,
        itemUnit: item.unit,
        createdAt: serverTimestamp(),
        createdAtMs: Date.now(),
      };
      const logRef = await addDoc(collection(db, "logs"), newLog);
      setLogs?.((prev) => [...(prev || []), { id: logRef.id, ...newLog }]);
      toast.success("Stock updated");
      setEditing(false);
    } catch (err) {
      console.error("Error updating stock", err);
      toast.error("Error updating stock");
    } finally {
      setSaving(false);
    }
  }

  const deleteItem = async (itemId) => {
    setDeleteLoading(true);
    try {
      if (user?.role === "worker") {
        toast.error("You are not allowed to delete items");
        setDeleteLoading(false);
        return;
      }

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
      console.log("Error deleting item", err.code, err.message);
      toast.error("Error deleting item");
    }
    setDeleteLoading(false);
  };

  if (!item) return null;

  return (
    <tr className={rowClass}>
      {/* Name */}
      <td className="text-truncate" title={item.name}>
        <div className="fw-semibold">{item.name}</div>
        <div className="text-muted small">
          ID: <span className="font-monospace">{item.id}</span>
        </div>
      </td>

      {/* Low alert */}
      <td className="fw-semibold">{item.lowStock}</td>

      {/* Stock (inline edit) */}
      <td>
        {!editing ? (
          <div className="d-inline-flex align-items-center gap-2">
            <span className="fw-semibold">{item.stock}</span>
            <span className="text-muted small text-nowrap"></span>
          </div>
        ) : (
          <div className="d-inline-block" style={{ minWidth: 220 }}>
            <div className="input-group input-group-sm">
              <span className="input-group-text">Stock</span>
              <input
                type="number"
                className={`form-control ${isInvalid ? "is-invalid" : ""}`}
                placeholder="0"
                value={stockInput}
                onChange={onStockChange}
                inputMode="numeric"
                min="0"
                step="1"
                required
                aria-label="Stock"
              />
              <span className="input-group-text">{item.unit}</span>
              <div className="invalid-feedback text-start">
                Enter a non-negative whole number.
              </div>
            </div>
          </div>
        )}
      </td>

      {/* Status */}
      <td>
        <span className={badge.className}>{badge.text}</span>
      </td>

      {/* Actions */}
      <td className="text-end">
        {!editing ? (
          <div
            className="btn-group btn-group-sm gap-3"
            role="group"
            aria-label="Row actions"
          >
            <button
              type="button"
              className="btn btn-primary"
              onClick={startEdit}
            >
              Stock
            </button>
            <Link to={`/items/edit/${item.id}`} className="btn btn-secondary">
              Edit
            </Link>
            <button
              type="button"
              className="btn btn-danger"
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
        ) : (
          <div className="d-inline-flex gap-2">
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={save}
              disabled={saving || isInvalid}
            >
              {saving ? (
                <>
                  Saving… <ButtonSpinner />
                </>
              ) : (
                "Save"
              )}
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              onClick={cancel}
              disabled={saving}
            >
              Cancel
            </button>
          </div>
        )}
      </td>
    </tr>
  );
}
