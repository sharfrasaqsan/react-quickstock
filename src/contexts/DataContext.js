import { createContext, useContext, useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/Config";
import { toast } from "sonner";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const res = await getDocs(collection(db, "items"));
        const data = res.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setItems(data);
      } catch (err) {
        console.log(
          "Error fetching items",
          "error: ",
          err,
          "error message: ",
          err.message
        );
        toast.error("Error fetching items");
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await getDocs(collection(db, "users"));
        const data = res.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setUsers(data);
      } catch (err) {
        console.log(
          "Error fetching users",
          "error: ",
          err,
          "error message: ",
          err.message
        );
        toast.error("Error fetching users");
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <DataContext.Provider value={{ items, setItems, users, setUsers, loading }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  return useContext(DataContext);
};
