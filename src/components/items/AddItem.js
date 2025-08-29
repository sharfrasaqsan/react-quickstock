import React from "react";

const AddItem = () => {
  return (
    <section>
      <h2>Add Item</h2>
      <form>
        <div>
          <label htmlFor="name">Name</label>
          <input type="text" id="name" />
        </div>
        <div>
          <label htmlFor="stock">Stock</label>
          <input type="number" id="stock" />
        </div>
        <div>
          <label htmlFor="unit">Unit</label>
          <input type="text" id="unit" />
        </div>
        <div>
          <button type="submit">Add</button>
        </div>
      </form>
    </section>
  );
};

export default AddItem;
