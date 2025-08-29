import React from "react";
import AddStocks from "./AddStocks";
import RemoveStocks from "./RemoveStocks";

const ItemsCard = ({ item, index }) => {
  return (
    <tr>
      <td>{index + 1}</td>
      <td>{item.name}</td>
      <td>
        {item.stock}
        {item.unit}
      </td>
      <td>
        <AddStocks item={item} />
      </td>
      <td>
        <RemoveStocks item={item} />
      </td>
      <td>
        <button>Edit</button>
        <button>Delete</button>
      </td>
    </tr>
  );
};

export default ItemsCard;
