import ItemsCard from "../items/ItemsCard";

export default function ItemsList({ items = [] }) {
  if (!items.length) {
    return (
      <div
        className="alert alert-light border d-flex align-items-center"
        role="alert"
      >
        <i className="bi-info-circle me-2" aria-hidden="true"></i>
        <div>No items to display.</div>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table table-sm table-striped table-hover align-middle mb-0">
        <thead className="table-light sticky-top" style={{ top: 0, zIndex: 1 }}>
          <tr>
            <th style={{ minWidth: 240 }}>Name</th>
            <th style={{ width: 140 }}>Low Alert</th>
            <th style={{ width: 200 }}>Stock</th>
            <th style={{ width: 140 }}>Status</th>
            <th className="text-end" style={{ width: 260 }}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((it) => (
            <ItemsCard key={it.id} item={it} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
