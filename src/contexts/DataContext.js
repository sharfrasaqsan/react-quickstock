import { createContext, useContext, useEffect, useState } from "react";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/Config";
import { toast } from "sonner";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    const fetchItems = onSnapshot(
      collection(db, "items"),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setItems(data);
        setLoading(false);
      },
      (err) => {
        console.log("Error fetching items", err.code, err.message);
        toast.error("Error fetching items");
        setLoading(false);
      }
    );

    return () => fetchItems();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await getDocs(collection(db, "users"));
        const data = res.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setUsers(data);
      } catch (err) {
        console.log("Error fetching users", err.code, err.message);
        toast.error("Error fetching users");
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const res = await getDocs(collection(db, "logs"));
        const data = res.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setLogs(data);
      } catch (err) {
        console.log("Error fetching logs", err.code, err.message);
        toast.error("Error fetching logs");
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  // Item Search
  const [itemSearch, setItemSearch] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);

  useEffect(() => {
    if (!itemSearch.trim()) {
      setFilteredItems(items);
      return;
    }

    const searchedItems = items?.filter((item) =>
      item?.name?.toLowerCase().includes(itemSearch.toLowerCase())
    );

    setFilteredItems(searchedItems);
  }, [items, itemSearch]);

  // Log Search
  const [logSearch, setLogSearch] = useState("");
  const [logFilter, setLogFilter] = useState("all");
  const [filteredLogs, setFilteredLogs] = useState([]);

  useEffect(() => {
    if (!logSearch.trim()) {
      setFilteredLogs(logs);
      return;
    }

    const searchedLogs = logs?.filter((log) => {
      const user = users.find((u) => u.id === log.userId);

      const matchesSearch =
        log?.itemName.toLowerCase()?.includes(logSearch.toLowerCase()) ||
        user?.name?.toLowerCase()?.includes(logSearch.toLowerCase()) ||
        user?.email?.toLowerCase()?.includes(logSearch.toLowerCase());

      const matchesFilter = logFilter === "all" || log.itemName === logFilter;

      return matchesSearch && matchesFilter;
    });

    setFilteredLogs(searchedLogs);
  }, [logs, users, logSearch, logFilter]);

  return (
    <DataContext.Provider
      value={{
        items,
        setItems,
        users,
        setUsers,
        logs,
        setLogs,
        loading,
        itemSearch,
        setItemSearch,
        filteredItems,
        logSearch,
        setLogSearch,
        logFilter,
        setLogFilter,
        filteredLogs,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  return useContext(DataContext);
};
