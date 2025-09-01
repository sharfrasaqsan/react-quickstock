import { useData } from "../../contexts/DataContext";

const ItemSearch = () => {
  const { itemSearch, setItemSearch } = useData();

  return (
    <div className="w-50 m-auto mb-4">
      <label htmlFor="itemsearch" style={{ display: "none" }}>
        Item Search
      </label>
      <input
        type="text"
        name="itemsearch"
        id="itemsearch"
        placeholder="Search items"
        className="input"
        value={itemSearch}
        onChange={(e) => setItemSearch(e.target.value)}
      />
    </div>
  );
};

export default ItemSearch;
