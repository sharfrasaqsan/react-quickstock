import { useState } from "react";
import { toast } from "sonner";
import ButtonSpinner from "../utils/ButtonSpinner";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/Config";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useData } from "../contexts/DataContext";
import LoadingSpinner from "../utils/LoadingSpinner";

const Login = () => {
  const { user, setUser } = useAuth();
  const { loading } = useData();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loginLoading, setLoginLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (user) {
      toast.error("You are already logged in.");
      setLoginLoading(false);
      return;
    }

    if (!email) {
      toast.error("Email cannot be empty.");
      setLoginLoading(false);
      return;
    }

    if (!password) {
      toast.error("Password cannot be empty.");
      setLoginLoading(false);
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      setLoginLoading(false);
      return;
    }

    setLoginLoading(true);
    try {
      const userCredintials = signInWithEmailAndPassword(auth, email, password);
      setUser(userCredintials.user);
      navigate("/");
      toast.success("Logged in successfully");
      setEmail("");
      setPassword("");
    } catch (err) {
      console.log(
        "Error logging in",
        "error: ",
        err,
        "error message: ",
        err.message
      );
      toast.error("Error logging in");
    }
    setLoginLoading(false);
  };

  if (loading) {
    return <LoadingSpinner />;
  }
  if (user) {
    return <LoadingSpinner />;
  }

  return (
    <section>
      <div>
        <h2>Login</h2>
      </div>
      <div>
        <form onSubmit={handleLogin}>
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <button type="submit">
              {loginLoading ? (
                <>
                  Logging in... <ButtonSpinner />
                </>
              ) : (
                "Login"
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Login;
