import { useEffect, useState } from "react";
import { toast } from "sonner";
import ButtonSpinner from "../utils/ButtonSpinner";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/Config";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useData } from "../contexts/DataContext";
import LoadingSpinner from "../utils/LoadingSpinner";
import PageHeader from "../components/PageHeader";

const Login = () => {
  const { user, setUser } = useAuth();
  const { loading } = useData();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loginLoading, setLoginLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const handleLogin = async () => {
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
      const userCredintials = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      setUser(userCredintials.user);
      setEmail("");
      setPassword("");
      toast.success("Logged in successfully");
      navigate("/");
    } catch (err) {
      console.log(
        "Error logging in",
        "error: ",
        err,
        "error message: ",
        err.message
      );
      toast.error("Error logging in");
    } finally {
      setLoginLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <section className="container stack">
      <PageHeader
        title="Login"
        subtitle="Access your QuickStock dashboard."
        actions={
          <Link to="/register" className="btn btn--outline">
            Create account
          </Link>
        }
      />

      <form
        className="card card--padded stack"
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
        aria-busy={loginLoading}
      >
        <div className="field">
          <label className="label" htmlFor="email">
            Email
          </label>
          <input
            className="input"
            type="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            autoFocus
          />
        </div>

        <div className="field">
          <label className="label" htmlFor="password">
            Password
          </label>
          <input
            className="input"
            type="password"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>

        <button
          type="submit"
          className="btn btn--primary w-100"
          disabled={loginLoading}
        >
          {loginLoading ? (
            <>
              <span>Logging in…</span> <ButtonSpinner />
            </>
          ) : (
            "Login"
          )}
        </button>

        <small className="text-muted">
          Don’t have an account? <Link to="/register">Register</Link>
        </small>
      </form>
    </section>
  );
};

export default Login;
