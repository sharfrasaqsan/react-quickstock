import { Link } from "react-router-dom";
import LogList from "../components/logs/LogList";
import PageHeader from "../components/PageHeader";
import LogSearch from "../components/logs/LogSearch";
import LogFilter from "../components/logs/LogFilter";

const Logs = () => {
  return (
    <section className="container">
      <PageHeader
        title="Activity Logs"
        subtitle="Track all changes made by users"
        actions={
          <>
            <Link to="/" className="btn btn--outline">
              Back to Dashboard
            </Link>
          </>
        }
      />

      <div className="card card--padded mt-3">
        <div className="mb-4 d-flex align-items-center justify-content-between">
          <LogSearch />
          <LogFilter />
        </div>
        <div>
          <LogList />
        </div>
      </div>
    </section>
  );
};

export default Logs;
