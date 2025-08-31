import { useData } from "../contexts/DataContext";

const Logs = () => {
  const { logs, users } = useData();

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
            {logs?.map((log, index) => {
              const user = users?.find((u) => u.id === log.userId);
              return (
                <tr key={log.id}>
                  <td>{index + 1}</td>
                  <td>{user ? user.name : log.userId}</td>
                  <td>{user ? user.email : log.email}</td>
                  <td>{log.action}</td>
                  <td>{log.timestamp.toDate().toLocaleString()}</td>
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
