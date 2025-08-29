import React from "react";

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="container" style={{ textAlign: "center" }}>
        <p>
          &copy; {new Date().getFullYear()} <strong>QuickStock</strong> — Never
          run out, never overstock.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
