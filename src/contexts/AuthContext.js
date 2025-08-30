import { onAuthStateChanged } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase/Config";
import { toast } from "sonner";
import { doc, getDoc } from "firebase/firestore";
import LoadingSpinner from "../utils/LoadingSpinner";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const res = await getDoc(doc(db, "users", user.uid));
          if (res.exists()) {
            setUser({ id: res.id, ...res.data() });
          } else {
            setUser(null);
          }
        } catch (err) {
          console.log(
            "Error fetching user",
            "error: ",
            err,
            "error message: ",
            err.message
          );
          toast.error("Error fetching user");
          setUser(null);
        }
      } else {
        setUser(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
