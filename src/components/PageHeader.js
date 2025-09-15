import React from "react";

const PageHeader = ({ title, subtitle, actions }) => {
  return (
    <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-2 pb-3 mb-3 border-bottom">
      <div>
        <h1 className="h3 mb-1">{title}</h1>
        <p className="text-muted mb-0">{subtitle}</p>
      </div>
      <div className="d-flex gap-2">{actions}</div>
    </div>
  );
};

export default PageHeader;
