import React, { useEffect, useState } from "react";
import { api } from "./api";

export default function SelectSubcategory({
  categoryId,
  selectedSubcategory,
  setSelectedSubcategory,
}) {
  const [subcategories, setSubcategories] = useState([]);

  useEffect(() => {
    if (categoryId) {
      api
        .get(`/subcategories?category=${categoryId}`)
        .then((res) => setSubcategories(res.data))
        .catch(console.error);
    }
  }, [categoryId]);

  return (
    <div>
      <label>Subcategory</label>
      <select
        value={selectedSubcategory}
        onChange={(e) => setSelectedSubcategory(e.target.value)}
      >
        <option value="">-- Select Subcategory --</option>
        {subcategories.map((s) => (
          <option key={s._id} value={s._id}>
            {s.name}
          </option>
        ))}
      </select>
      {/* Add create new subcategory form here if needed */}
    </div>
  );
}
