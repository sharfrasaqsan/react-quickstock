import React, { useState } from "react";
import { toast } from "sonner";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase/Config";
import ButtonSpinner from "../utils/ButtonSpinner";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { useData } from "../contexts/DataContext";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";

const Register = () => {
  const { setUsers, loading } = useData();
  const { setUser } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [registerLoading, setRegisterLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setRegisterLoading(true);

    if (!name) {
      toast.error("Name cannot be empty.");
      setRegisterLoading(false);
      return;
    }

    if (!email) {
      toast.error("Email cannot be empty.");
      setRegisterLoading(false);
      return;
    }

    if (!password) {
      toast.error("Password cannot be empty.");
      setRegisterLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      setRegisterLoading(false);
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      setRegisterLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      setRegisterLoading(false);
      return;
    }

    const existEmail = await auth.fetchSignInMethodsForEmail(email);
    if (existEmail.length > 0) {
      toast.error("Email already exists.");
      setRegisterLoading(false);
      return;
    }

    try {
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const { uid } = userCredentials.user;
      const newUser = {
        id: uid,
        name,
        email,
        role: "analyst",
        createdAt: serverTimestamp(),
      };
      await setDoc(doc(db, "users", uid), newUser);
      setUsers((prev) => [...prev, { id: uid, ...newUser }]);
      setUser({ id: uid, ...newUser });
      toast.success("User registered successfully");
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      navigate("/");
    } catch (err) {
      console.log(
        "Error registering user",
        "error: ",
        err,
        "error message: ",
        err.message
      );
      toast.error("Error registering user");
    }
    setRegisterLoading(false);
  };

  if (loading) {
    return <ButtonSpinner />;
  }

  return (
    <section className="container stack">
      <PageHeader
        title="Create your account"
        subtitle="Join QuickStock to manage your inventory with ease."
        actions={
          <Link to="/login" className="btn btn--outline">
            Back to Login
          </Link>
        }
      />

      <form
        className="card card--padded stack"
        onSubmit={handleSubmit}
        aria-busy={registerLoading}
      >
        <div className="field">
          <label className="label" htmlFor="name">
            Name *
          </label>
          <input
            className="input"
            type="text"
            id="name"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            autoFocus
          />
        </div>

        <div className="field">
          <label className="label" htmlFor="email">
            Email *
          </label>
          <input
            className="input"
            type="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>

        <div className="field">
          <label className="label" htmlFor="password">
            Password *
          </label>
          <input
            className="input"
            type="password"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
        </div>

        <div className="field">
          <label className="label" htmlFor="confirm-password">
            Confirm Password *
          </label>
          <input
            className="input"
            type="password"
            id="confirm-password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
          />
        </div>

        <button
          type="submit"
          className="btn btn--primary w-100"
          disabled={registerLoading}
        >
          {registerLoading ? (
            <>
              <span>Registering…</span> <ButtonSpinner />
            </>
          ) : (
            "Register"
          )}
        </button>

        <small className="text-muted">
          Already have an account? <Link to="/login">Login</Link>
        </small>
      </form>
    </section>
  );
};

export default Register;
