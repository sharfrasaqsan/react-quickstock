import React, { useState } from "react";
import { toast } from "sonner";
import ButtonSpinner from "../utils/ButtonSpinner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loginLoading, setLoginLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginLoading(true);
    try {
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
