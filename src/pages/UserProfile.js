import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { useData } from "../contexts/DataContext";
import { Link, useParams } from "react-router-dom";
import LoadingSpinner from "../utils/LoadingSpinner";
import NotFoundText from "../utils/NotFoundText";
import PageHeader from "../components/PageHeader";

const UserProfile = () => {
  const { user } = useAuth();
  const { users, loading } = useData();
  const { id } = useParams();

  const profileUser = users?.find((user) => user.id === id);

  if (!user) return <NotFoundText text={"User not found."} />;
  if (loading) return <LoadingSpinner />;

  return (
    <section className="container my-3 stack">
      <PageHeader
        title="User Profile"
        subtitle="View and edit user details."
        actions={
          <>
            <Link to="/" className="btn btn--outline">
              Back to Dashboard
            </Link>
          </>
        }
      />

      <div className="card card--padded mt-4">
        <ul className="profile-details stack">
          <li className="profile-details__item">
            <strong>Name:</strong> {profileUser?.name}
          </li>
          <li className="profile-details__item">
            <strong>Email:</strong> {profileUser?.email}
          </li>
          <li className="profile-details__item">
            <strong>Role:</strong> {profileUser?.role}
          </li>
          <li className="profile-details__item">
            <strong>Joined At:</strong>{" "}
            {profileUser?.createdAt
              ? profileUser.createdAt.toDate().toString()
              : "Loading..."}
          </li>
        </ul>
      </div>
    </section>
  );
};

export default UserProfile;
