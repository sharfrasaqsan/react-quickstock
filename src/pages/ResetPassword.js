import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useState } from "react";
import { toast } from "sonner";
import { auth, db } from "../firebase/Config";
import { sendPasswordResetEmail } from "firebase/auth";
import ButtonSpinner from "../utils/ButtonSpinner";
import PageHeader from "../components/PageHeader";
import getFirebaseErrorMessage from "../utils/ErrorMessages";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email cannot be empty.");
      return;
    }

    const existEmail = await getDocs(
      query(collection(db, "users"), where("email", "==", email))
    );
    if (existEmail.empty) {
      toast.error(
        "User does not exist in our database. Please enter a valid email."
      );
      return;
    }

    setResetLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent.");
      setEmail("");
    } catch (err) {
      console.log("Error resetting password", err.code, err.message);
      toast.error(getFirebaseErrorMessage(err.code));
    }

    setResetLoading(false);
  };

  return (
    <section className="container my-3 stack">
      <PageHeader
        title="Reset Password"
        subtitle="Get a password reset link via email."
      />

      <form
        className="card card--padded stack"
        onSubmit={handleReset}
        aria-busy={resetLoading}
      >
        <div className="field">
          <label className="label" htmlFor="email">
            Enter your email
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

        <button
          type="submit"
          className="btn btn--primary w-100"
          disabled={resetLoading}
        >
          {resetLoading ? (
            <>
              <span>Resetting…</span> <ButtonSpinner />
            </>
          ) : (
            "Reset Password"
          )}
        </button>
      </form>
    </section>
  );
};

export default ResetPassword;
