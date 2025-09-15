import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase/Config";
import { useData } from "../../contexts/DataContext";
import { useAuth } from "../../contexts/AuthContext";
import ButtonSpinner from "../../utils/ButtonSpinner";

/*
  ItemCard — compact card for grid/mobile views.
  - Shows name, id, stock, threshold, status badge
  - Inline edit (number input only), Save/Cancel
  - Save updates Firestore + DataContext and logs UPDATE_STOCK
  - No redirects
*/

function ItemCard({ item }) {
  const { user } = useAuth();
  const { setItems, setLogs } = useData();

  // local UI state
  const [editing, setEditing] = useState(false);
  const [stockInput, setStockInput] = useState(String(Number(item.stock) || 0));
  const [isInvalid, setIsInvalid] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  // tiny helpers (kept close for readability)
  const num = (n) => (Number(n) || 0).toLocaleString();
  const thresholdOf = (it) =>
    typeof it.lowStock === "number"
      ? it.lowStock
      : typeof it.minStock === "number"
      ? it.minStock
      : 0;
  const statusOf = (it) => {
    const stock = Number(it.stock) || 0;
    const thr = thresholdOf(it);
    if (stock === 0) return "out";
    if (thr > 0 && stock <= thr) return "low";
    return "in";
  };
  const badge = (s) =>
    s === "out"
      ? "badge text-bg-danger"
      : s === "low"
      ? "badge text-bg-warning"
      : "badge text-bg-success";

  const s = statusOf(item);
  const thr = thresholdOf(item);

  function onStockChange(e) {
    const v = e.target.value;
    setStockInput(v);
    const n = Number(v);
    setIsInvalid(!(Number.isFinite(n) && n >= 0));
  }

  function cancel() {
    setEditing(false);
    setStockInput(String(Number(item.stock) || 0));
    setMsg("");
  }

  async function save() {
    const newStock = Math.max(0, Number(stockInput) || 0);
    setSaving(true);
    setMsg("");

    try {
      // 1) Update Firestore
      await updateDoc(doc(db, "items", item.id), { stock: newStock });

      // 2) Update client state
      setItems((prev) =>
        prev.map((it) => (it.id === item.id ? { ...it, stock: newStock } : it))
      );

      // 3) Log action (UPDATE_STOCK)
      const newLog = {
        userId: user?.id,
        action: "UPDATE_STOCK",
        itemName: item.name,
        itemUnit: item.unit,
        stockFrom: Number(item.stock),
        stockTo: newStock,
        createdAt: serverTimestamp(),
        createdAtMs: Date.now(),
      };
      const logDoc = await addDoc(collection(db, "logs"), newLog);
      setLogs((prev) => [...prev, { id: logDoc.id, ...newLog }]);

      // 4) UX feedback
      const now = newStock;
      if (thr > 0 && now <= thr && now > 0) {
        toast.warning(`Low stock: ${item.name} • ${now} ${item.unit || ""}`);
      } else if (now === 0) {
        toast.warning(`Out of stock: ${item.name}`);
      } else {
        toast.success(`Stock updated for ${item.name}`);
      }
      setMsg("Stock updated.");
      setEditing(false);
    } catch (e) {
      console.error("Error updating stock", e);
      toast.error("Could not update stock.");
      setMsg("Could not update stock. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  function onKeyDown(e) {
    if (e.key === "Enter" && !isInvalid && !saving) save();
    if (e.key === "Escape" && !saving) cancel();
  }

  return (
    <div className="card h-100">
      <div className="card-body">
        {/* Header: name/id + badge */}
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <div className="fw-semibold">{item.name || "Unnamed item"}</div>
            <div className="text-muted small">{String(item.id)}</div>
          </div>
          <span className={badge(s)}>
            {s === "in" ? "In" : s === "low" ? "Low" : "Out"}
          </span>
        </div>

        {/* Stock / Threshold */}
        <div className="mt-3">
          {!editing ? (
            <div className="d-flex justify-content-between">
              <div>
                <div className="text-muted small">Current Stock</div>
                <div className="fs-5 fw-semibold">{num(item.stock)}</div>
              </div>
              <div className="text-end">
                <div className="text-muted small">Min/Threshold</div>
                <div className="fw-medium">{thr ? num(thr) : "—"}</div>
              </div>
            </div>
          ) : (
            <>
              <label htmlFor={`stock-${item.id}`} className="form-label">
                New stock
              </label>
              <input
                id={`stock-${item.id}`}
                type="number"
                min={0}
                className={`form-control ${isInvalid ? "is-invalid" : ""}`}
                value={stockInput}
                onChange={onStockChange}
                onKeyDown={onKeyDown}
                disabled={saving}
              />
              {isInvalid && (
                <div className="invalid-feedback">
                  Please enter 0 or a positive number.
                </div>
              )}
            </>
          )}
        </div>

        {/* feedback */}
        {msg && (
          <div
            className="alert alert-info mt-3 mb-0 py-2"
            role="status"
            aria-live="polite"
          >
            {msg}
          </div>
        )}

        {/* Actions */}
        <div className="d-flex flex-wrap gap-2 mt-3">
          {!editing ? (
            <>
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={() => setEditing(true)}
              >
                Update stock
              </button>
              <Link
                to={`/items/${item.id}`}
                className="btn btn-outline-secondary btn-sm"
              >
                Details
              </Link>
              <Link
                to={`/items/${item.id}/edit`}
                className="btn btn-outline-secondary btn-sm"
              >
                Edit
              </Link>
            </>
          ) : (
            <>
              <button
                className="btn btn-success btn-sm d-inline-flex align-items-center"
                onClick={save}
                disabled={saving || isInvalid}
              >
                {saving && (
                  <>
                    <ButtonSpinner />
                    <span className="ms-2" />
                  </>
                )}
                {saving ? "Saving…" : "Save"}
              </button>
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={cancel}
                disabled={saving}
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ItemCard;
