import { useData } from "../contexts/DataContext";

const Logs = () => {
  const { logs, users } = useData();

  const reversedLogs = [...logs].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <section>
      <div>
        <h2>Logs</h2>
      </div>
      <div>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>User name</th>
              <th>Email</th>
              <th>Action made</th>
              <th>Date & Time</th>
            </tr>
          </thead>
          <tbody>
            {reversedLogs?.map((log, index) => {
              const user = users?.find((u) => u.id === log.userId);
              return (
                <tr key={log.id}>
                  <td>{index + 1}</td>
                  <td>{user ? user.name : log.userId}</td>
                  <td>{user ? user.email : log.email}</td>
                  <td>
                    Updated <b>{log.itemName}</b> from{" "}
                    <b>
                      {log.from} {log.itemUnit}
                    </b>{" "}
                    to{" "}
                    <b>
                      {log.to} {log.itemUnit}
                    </b>
                  </td>

                  <td>
                    {log.createdAt?.toDate
                      ? log.createdAt.toDate().toLocaleString()
                      : new Date(log.createdAtMs).toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Logs;
