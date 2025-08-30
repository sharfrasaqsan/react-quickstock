import { signOut } from "firebase/auth";
import { useState } from "react";
import { toast } from "sonner";
import { auth } from "../firebase/Config";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import ButtonSpinner from "../utils/ButtonSpinner";

const Logout = () => {
  const { user, setUser } = useAuth();

  const [logoutLoading, setLogoutLoading] = useState(false);
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = async () => {
    if (!user) {
      return navigate("/login");
    }

    setLogoutLoading(true);

    try {
      await signOut(auth);
      setUser(null);
      toast.success("Logged out successfully");
      setTimeout(() => {
        navigate("/login");
      }, [2000]);
    } catch (err) {
      console.log(
        "Error logging out",
        "error: ",
        err,
        "error message: ",
        err.message
      );
      toast.error("Error logging out");
    }

    setLogoutLoading(false);
  };

  return (
    <button onClick={handleLogout}>
      {logoutLoading ? (
        <>
          Logging out... <ButtonSpinner />
        </>
      ) : (
        "Logout"
      )}
    </button>
  );
};

export default Logout;
