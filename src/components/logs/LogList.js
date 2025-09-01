import LogCard from "./LogCard";
import { useData } from "../../contexts/DataContext";
import NotFoundText from "../../utils/NotFoundText";

const LogList = () => {
  const { filteredLogs, logSearch, users } = useData();
  const reversedLogs = [...filteredLogs].sort(
    (a, b) => b.createdAt - a.createdAt
  );

  if (filteredLogs.length === 0)
    return <NotFoundText text={`No logs match the ${logSearch} criteria.`} />;

  if (!reversedLogs || reversedLogs.length === 0)
    return <NotFoundText text={"No logs yet."} />;

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
