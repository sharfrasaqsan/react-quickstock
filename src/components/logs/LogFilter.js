import React from "react";
import { useData } from "../../contexts/DataContext";

const LogFilter = () => {
  const { items, logFilter, setLogFilter } = useData();

  return (
    <div>
      <select
        name="logFilter"
        id="logFilter"
        className="input"
        value={logFilter}
        onChange={(e) => setLogFilter(e.target.value)}
      >
        <option value="all">All</option>
        {items?.map((item) => (
          <option key={item.id} value={item.name}>
            {item.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LogFilter;
