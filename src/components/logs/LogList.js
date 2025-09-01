import LogCard from "./LogCard";
import { useData } from "../../contexts/DataContext";

const LogList = () => {
  const { filteredLogs, users } = useData();
  const reversedLogs = [...filteredLogs].sort(
    (a, b) => b.timestamp - a.timestamp
  );

  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>User name</th>
            <th>Email</th>
            <th>Action</th>
            <th>Date & Time</th>
          </tr>
        </thead>
        <tbody>
          {reversedLogs?.map((log, index) => {
            const user = users?.find((u) => u.id === log.userId);
            return <LogCard key={log.id} log={log} user={user} index={index} />;
          })}
        </tbody>
      </table>
    </div>
  );
};

export default LogList;
