import React, { useEffect, useState } from "react";
import { api } from "./api";

export default function SelectClass({
  subcategoryId,
  selectedClass,
  setSelectedClass,
}) {
  const [classes, setClasses] = useState([]);
  const [newClassName, setNewClassName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (subcategoryId) {
      setLoading(true);
      api
        .get(`/subcategory/${subcategoryId}/classes`)
        .then((res) => {
          // Access the classes array from the response object
          setClasses(res.data.classes || []);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setClasses([]); // Reset classes if no subcategoryId
    }
  }, [subcategoryId]);

  const createClass = () => {
    if (!newClassName.trim()) return;

    api
      .post("/classes", { name: newClassName, subcategoryId })
      .then((res) => {
        setClasses((prev) => [...prev, res.data]);
        setNewClassName("");
      })
      .catch(console.error);
  };

  return (
    <div>
      <label>Class</label>
      {loading ? (
        <p>Loading classes...</p>
      ) : (
        <>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="">-- Select Class --</option>
            {classes.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>

          <div>
            <input
              type="text"
              placeholder="New Class Name"
              value={newClassName}
              onChange={(e) => setNewClassName(e.target.value)}
            />
            <button onClick={createClass}>Add Class</button>
          </div>
        </>
      )}
    </div>
  );
}
