import React from "react";

const LogCard = ({ log, user, index }) => {
  return (
    <tr>
      <td>{index + 1}</td>
      <td className="mw-50" style={{ maxWidth: "115px" }}>
        {user ? user.name : log.userId}
      </td>
      <td className="text-muted" style={{ maxWidth: "150px" }}>
        {user ? user.email : log.email}
      </td>
      <td>
        Updated <b>{log.itemName}</b> from{" "}
        <b className="text-danger">
          {log.from} {log.itemUnit}
        </b>{" "}
        to{" "}
        <b className="text-success">
          {log.to} {log.itemUnit}
        </b>
      </td>
      <td className="text-muted">
        {log.createdAt?.toDate
          ? log.createdAt.toDate().toLocaleString()
          : new Date(log.createdAtMs).toLocaleString()}
      </td>
    </tr>
  );
};

export default LogCard;
