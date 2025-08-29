import AddStocks from "./AddStocks";
import RemoveStocks from "./RemoveStocks";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/Config";
import { useData } from "../../contexts/DataContext";
import { useState } from "react";
import ButtonSpinner from "../../utils/ButtonSpinner";

const ItemsCard = ({ item, index }) => {
  const { setItems } = useData();
  const [deleteLoading, setDeleteLoading] = useState(false);

  const deleteItem = async (itemId) => {
    setDeleteLoading(true);
    try {
      await deleteDoc(doc(db, "items", itemId));
      setItems((prev) => prev.filter((item) => item.id !== itemId));
      toast.success("Item deleted successfully");
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
        <Link to={`/edit-item/${item.id}`}>Edit</Link>
        <button onClick={() => deleteItem(item.id)}>
          {deleteLoading ? (
            <>
              Deleting... <ButtonSpinner />
            </>
          ) : (
            "Delete"
          )}
        </button>
      </td>
    </tr>
  );
};

export default ItemsCard;
