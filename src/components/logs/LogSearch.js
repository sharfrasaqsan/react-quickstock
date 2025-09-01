import { useData } from "../../contexts/DataContext";

const LogSearch = () => {
  const { LogSearch, setLogSearch } = useData();

  return (
    <div className="w-50 m-auto">
      <label htmlFor="logsearch" style={{ display: "none" }}>
        Search
      </label>
      <input
        type="text"
        name="logsearch"
        id="logsearch"
        placeholder="Search logs"
        className="input"
        value={LogSearch}
        onChange={(e) => setLogSearch(e.target.value)}
      />
    </div>
  );
};

export default LogSearch;
