import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <section className="container center" style={{ height: "70vh" }}>
      <div className="card card--padded stack">
        <h2>404 – Page Not Found</h2>
        <p className="text-muted">Sorry, we couldn’t find that page.</p>
        <Link to="/" className="btn btn--primary">
          Back to Dashboard
        </Link>
      </div>
    </section>
  );
};

export default NotFound;
