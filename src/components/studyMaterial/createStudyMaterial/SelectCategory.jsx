import React, { useEffect, useState } from "react";
import { api } from "./api";

export default function SelectCategory({
  selectedCategory,
  setSelectedCategory,
}) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api
      .get("/categories")
      .then((res) => setCategories(res.data))
      .catch(console.error);
  }, []);

  return (
    <div>
      <label>Category</label>
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        <option value="">-- Select Category --</option>
        {categories.map((c) => (
          <option key={c._id} value={c._id}>
            {c.name}
          </option>
        ))}
      </select>
    </div>
  );
}
