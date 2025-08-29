import React from "react";
import ItmesList from "../components/items/ItmesList";
import PageHeader from "../components/PageHeader";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <section className="container stack">
      <PageHeader
        title="Dashboard"
        subtitle="View and update your café’s inventory in real time."
        actions={
          <Link to="/add-item" className="btn btn--primary">
            Add Item
          </Link>
        }
      />
      <div className="card card--padded">
        <ItmesList />
      </div>
    </section>
  );
};

export default Dashboard;
