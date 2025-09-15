import { Link } from "react-router-dom";
import { useData } from "../contexts/DataContext";
import LoadingSpinner from "../utils/LoadingSpinner";

function Dashboard() {
  const { items = [], transactions = [], logs = [], loading } = useData();

  if (loading) return <LoadingSpinner />;

  // ---- helpers (tiny & readable) ----
  const num = (n) => (Number(n) || 0).toLocaleString();
  const when = (d) => new Date(d).toLocaleString();

  // Prefer item.lowStock; if not present, try item.minStock; otherwise 0.
  const thresholdOf = (item) => {
    if (typeof item.lowStock === "number") return item.lowStock;
    if (typeof item.minStock === "number") return item.minStock;
    return 0;
  };

  // ---- KPIs (plain loops) ----
  let totalSKUs = items.length;
  let totalUnits = 0;
  let lowStockCount = 0;
  let stockoutCount = 0;
  let hasAnyPrice = false;
  let inventoryValue = 0;

  for (const it of items) {
    const stock = Number(it.stock) || 0;
    totalUnits += stock;

    const thr = thresholdOf(it);
    if (thr > 0 && stock <= thr) lowStockCount += 1;
    if (stock === 0) stockoutCount += 1;

    if (typeof it.unitPrice === "number") {
      hasAnyPrice = true;
      inventoryValue += stock * it.unitPrice;
    }
  }

  // ---- Movement summary (last 7 days) ----
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  let inbound7 = 0;
  let outbound7 = 0;

  for (const t of transactions) {
    const ts = new Date(t.at || t.date || Date.now());
    if (ts < sevenDaysAgo) continue;

    const qty = Math.abs(Number(t.qty ?? t.quantity) || 0);
    const isOutbound =
      typeof t.type === "string"
        ? t.type.toLowerCase().startsWith("out")
        : false;

    if (isOutbound) outbound7 += qty;
    else inbound7 += qty;
  }

  const net7 = inbound7 - outbound7;

  // ---- Recent activity (short list = summary) ----
  const recentLogs = (logs || []).slice(0, 5);

  return (
    <div className="container my-3">
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-2 pb-3 mb-3 border-bottom">
        <div>
          <h1 className="h3 mb-1">Dashboard</h1>
          <p className="text-muted mb-0">
            Quick summary of inventory and recent activity
          </p>
        </div>
        <div className="d-flex gap-2">
          <Link to="/add-item" className="btn btn-outline-primary">
            Add Item
          </Link>
        </div>
      </div>

      {/* KPI row */}
      <div className="row g-3 mb-3">
        <div className="col-12 col-md-6 col-lg-3">
          <div className="card h-100">
            <div className="card-body">
              <div className="text-muted small">Total SKUs</div>
              <div className="fs-4 fw-bold">{num(totalSKUs)}</div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 col-lg-3">
          <div className="card h-100">
            <div className="card-body">
              <div className="text-muted small">Total Units</div>
              <div className="fs-4 fw-bold">{num(totalUnits)}</div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 col-lg-3">
          <div className="card h-100">
            <div className="card-body">
              <div className="text-muted small">Low Stock</div>
              <div className="fs-4 fw-bold">{num(lowStockCount)}</div>
              <div className="mt-2">
                <Link
                  to="/items#low"
                  className="btn btn-sm btn-outline-secondary"
                >
                  Review low stock
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 col-lg-3">
          <div className="card h-100">
            <div className="card-body">
              <div className="text-muted small">Stockouts</div>
              <div className="fs-4 fw-bold">{num(stockoutCount)}</div>
              <div className="mt-2">
                <Link to="/items#out" className="btn btn-sm btn-outline-danger">
                  See out-of-stock
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Optional inventory value (only if you have unitPrice on items) */}
      {hasAnyPrice && (
        <div className="row g-3 mb-3">
          <div className="col-12 col-lg-4">
            <div className="card h-100">
              <div className="card-body">
                <div className="text-muted small">Inventory Value</div>
                <div className="fs-4 fw-bold">
                  {Number(inventoryValue).toLocaleString(undefined, {
                    style: "currency",
                    currency: "USD", // change to your currency
                    maximumFractionDigits: 0,
                  })}
                </div>
                <div className="text-muted small mt-1">
                  Based on unitPrice × stock
                </div>
              </div>
            </div>
          </div>

          {/* Movement summary (last 7 days) */}
          <div className="col-12 col-lg-8">
            <div className="card h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h2 className="h5 mb-0">Movement (7 days)</h2>
                  <Link to="/logs" className="btn btn-sm btn-outline-secondary">
                    View logs
                  </Link>
                </div>
                <div className="row text-center">
                  <div className="col-4">
                    <div className="text-muted small">Inbound</div>
                    <div className="fs-5 fw-semibold">{num(inbound7)}</div>
                  </div>
                  <div className="col-4">
                    <div className="text-muted small">Outbound</div>
                    <div className="fs-5 fw-semibold">{num(outbound7)}</div>
                  </div>
                  <div className="col-4">
                    <div className="text-muted small">Net</div>
                    <div
                      className={`fs-5 fw-semibold ${
                        net7 < 0 ? "text-danger" : "text-success"
                      }`}
                    >
                      {(net7 > 0 ? "+" : "") + num(net7)}
                    </div>
                  </div>
                </div>
                <div className="text-muted small mt-2">
                  Inbound minus outbound in the past 7 days
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity (short list only = summary) */}
      <div className="card">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h2 className="h5 mb-0">Recent Activity</h2>
            <Link to="/logs" className="btn btn-sm btn-outline-secondary">
              All activity
            </Link>
          </div>

          {recentLogs.length === 0 ? (
            <p className="text-muted mb-0">No recent activity.</p>
          ) : (
            <ul className="list-group">
              {recentLogs?.map((log, i) => (
                <li key={log.id ?? i} className="list-group-item">
                  <div className="fw-medium">
                    {log.action ?? "Updated inventory"}
                    {log.itemName ? `: ${log.itemName}` : ""}
                  </div>
                  <div className="text-muted small">
                    {log.actor ? `${log.actor} · ` : ""}
                    {when(log.at ?? log.date ?? Date.now())}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
