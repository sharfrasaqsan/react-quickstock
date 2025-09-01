import React from "react";

const LogCard = ({ log, user, index }) => {
  return (
    <tr>
      <td>{index + 1}</td>
      <td className="mw-50" style={{ minWidth: "250px" }}>
        {user ? user.name : log.userId}
      </td>
      <td className="text-muted" style={{ minWidth: "250px" }}>
        {user ? user.email : log.email}
      </td>
      <td style={{ minWidth: "250px" }}>
        {log.action === "ADD_ITEM" && (
          <>
            Newly added item <b>{log.itemName}</b>
            <ul style={{ margin: "4px 0", paddingLeft: "16px" }}>
              <li>
                Stock:{" "}
                <b className="text-success">
                  {log.itemStock} {log.itemUnit}
                </b>
              </li>
            </ul>
          </>
        )}

        {log.action === "UPDATE_STOCK" && (
          <>
            Updated item <b>{log.itemName}</b>
            <ul style={{ margin: "4px 0", paddingLeft: "16px" }}>
              <li>
                Stock:{" "}
                <b className="text-danger">
                  {log.stockFrom} {log.itemUnit}
                </b>{" "}
                →{" "}
                <b className="text-success">
                  {log.stockTo} {log.itemUnit}
                </b>
              </li>
            </ul>
          </>
        )}

        {log.action === "UPDATE_ITEM" && (
          <>
            Updated item <b>{log.itemName}</b>
            <ul style={{ margin: "4px 0", paddingLeft: "16px" }}>
              {log.itemName !== log.updatedItemName && (
                <li>
                  Name: <b className="text-danger">{log.itemName}</b> →{" "}
                  <b className="text-success">{log.updatedItemName}</b>
                </li>
              )}
              {log.itemUnit !== log.updatedItemUnit && (
                <li>
                  Unit: <b className="text-danger">{log.itemUnit}</b> →{" "}
                  <b className="text-success">{log.updatedItemUnit}</b>
                </li>
              )}
              {log.stockFrom !== log.stockTo && (
                <li>
                  Stock:{" "}
                  <b className="text-danger">
                    {log.stockFrom}{" "}
                    {log.updatedItemUnit ? log.updatedItemUnit : log.itemUnit}
                  </b>{" "}
                  →{" "}
                  <b className="text-success">
                    {log.stockTo}{" "}
                    {log.updatedItemUnit ? log.updatedItemUnit : log.itemUnit}
                  </b>
                </li>
              )}
            </ul>
          </>
        )}
      </td>
      <td className="text-muted" style={{ minWidth: "250px" }}>
        {log.createdAt?.toDate
          ? log.createdAt.toDate().toLocaleString()
          : new Date(log.createdAtMs).toLocaleString()}
      </td>
    </tr>
  );
};

export default LogCard;
