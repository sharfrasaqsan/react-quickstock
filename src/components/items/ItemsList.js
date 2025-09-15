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
  ItemsList — reusable table for the /items page.
  - Parent passes items (already filtered)
  - Inline edit (number input only), Enter=Save, Esc=Cancel
  - Save updates Firestore + DataContext and logs UPDATE_STOCK
  - Simple sorting by name/stock/status
*/

function ItemsList({ items = [] }) {
  const { user } = useAuth();
  const { setItems, setLogs } = useData();

  // sorting
  const [sortBy, setSortBy] = useState("name"); // name | stock | status
  const [sortDir, setSortDir] = useState("asc"); // asc | desc

  // editing state (single row at a time to keep it simple)
  const [editingId, setEditingId] = useState(null);
  const [stockInput, setStockInput] = useState("");
  const [isInvalid, setIsInvalid] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  // helpers
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

  function toggleSort(key) {
    if (sortBy === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortBy(key);
      setSortDir("asc");
    }
  }

  function sorted(list) {
    const out = [...list];
    out.sort((a, b) => {
      let av, bv;
      if (sortBy === "name") {
        av = (a.name || "").toLowerCase();
        bv = (b.name || "").toLowerCase();
      } else if (sortBy === "stock") {
        av = Number(a.stock) || 0;
        bv = Number(b.stock) || 0;
      } else {
        av = statusOf(a); // in, low, out
        bv = statusOf(b);
      }
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return out;
  }

  function startEdit(item) {
    setEditingId(item.id);
    setStockInput(String(Number(item.stock) || 0));
    setIsInvalid(false);
    setMsg("");
  }

  function cancelEdit() {
    setEditingId(null);
    setStockInput("");
    setIsInvalid(false);
    setSaving(false);
  }

  function onInputChange(e) {
    const v = e.target.value;
    setStockInput(v);
    const n = Number(v);
    setIsInvalid(!(Number.isFinite(n) && n >= 0));
  }

  function onInputKeyDown(e, item) {
    if (e.key === "Enter" && !isInvalid && !saving) save(item);
    if (e.key === "Escape" && !saving) cancelEdit();
  }

  async function save(item) {
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
      const thr = thresholdOf(item);
      if (thr > 0 && newStock <= thr && newStock > 0) {
        toast.warning(
          `Low stock: ${item.name} • ${newStock} ${item.unit || ""}`
        );
      } else if (newStock === 0) {
        toast.warning(`Out of stock: ${item.name}`);
      } else {
        toast.success(`Stock updated for ${item.name}`);
      }
      setMsg("Stock updated.");
      cancelEdit();
    } catch (e) {
      console.error("Error updating stock", e);
      toast.error("Could not update stock.");
      setMsg("Could not update stock. Please try again.");
      setSaving(false);
    }
  }

  const rows = sorted(items);
  if (!rows.length)
    return <p className="text-muted mb-0">No items to display.</p>;

  return (
    <>
      {msg && (
        <div className="alert alert-info py-2" role="status" aria-live="polite">
          {msg}
        </div>
      )}

      <div className="table-responsive">
        <table className="table align-middle">
          <thead>
            <tr>
              <th style={{ width: "40%" }}>
                Item{" "}
                <button
                  type="button"
                  className="btn btn-sm btn-link p-0 ms-1"
                  onClick={() => toggleSort("name")}
                >
                  sort
                </button>
              </th>
              <th style={{ width: 140 }}>
                Stock{" "}
                <button
                  type="button"
                  className="btn btn-sm btn-link p-0 ms-1"
                  onClick={() => toggleSort("stock")}
                >
                  sort
                </button>
              </th>
              <th style={{ width: 140 }}>Min/Threshold</th>
              <th style={{ width: 100 }}>
                Status{" "}
                <button
                  type="button"
                  className="btn btn-sm btn-link p-0 ms-1"
                  onClick={() => toggleSort("status")}
                >
                  sort
                </button>
              </th>
              <th style={{ width: 260 }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((it) => {
              const isEditing = editingId === it.id;
              const s = statusOf(it);
              const thr = thresholdOf(it);

              return (
                <tr key={it.id}>
                  <td>
                    <div className="fw-medium">{it.name || "Unnamed item"}</div>
                    <div className="text-muted small">{String(it.id)}</div>
                  </td>

                  {/* Stock */}
                  <td>
                    {!isEditing ? (
                      <span className="fw-semibold">{num(it.stock)}</span>
                    ) : (
                      <>
                        <input
                          type="number"
                          min={0}
                          className={`form-control ${
                            isInvalid ? "is-invalid" : ""
                          }`}
                          value={stockInput}
                          onChange={onInputChange}
                          onKeyDown={(e) => onInputKeyDown(e, it)}
                          disabled={saving}
                        />
                        {isInvalid && (
                          <div className="invalid-feedback">
                            Please enter 0 or a positive number.
                          </div>
                        )}
                      </>
                    )}
                  </td>

                  {/* Threshold */}
                  <td>
                    {thr ? num(thr) : <span className="text-muted">—</span>}
                  </td>

                  {/* Status */}
                  <td>
                    <span className={badge(s)}>
                      {s === "in" ? "In" : s === "low" ? "Low" : "Out"}
                    </span>
                  </td>

                  {/* Actions */}
                  <td>
                    {!isEditing ? (
                      <div className="d-flex flex-wrap gap-2">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => startEdit(it)}
                        >
                          Update stock
                        </button>
                        <Link
                          to={`/items/${it.id}`}
                          className="btn btn-sm btn-outline-secondary"
                        >
                          Details
                        </Link>
                        <Link
                          to={`/items/${it.id}/edit`}
                          className="btn btn-sm btn-outline-secondary"
                        >
                          Edit
                        </Link>
                      </div>
                    ) : (
                      <div className="d-flex flex-wrap gap-2">
                        <button
                          type="button"
                          className="btn btn-sm btn-success d-inline-flex align-items-center"
                          onClick={() => save(it)}
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
                          type="button"
                          className="btn btn-sm btn-outline-secondary"
                          onClick={cancelEdit}
                          disabled={saving}
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default ItemsList;
