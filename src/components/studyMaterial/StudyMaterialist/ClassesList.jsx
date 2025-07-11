// ClassesList.jsx
import React from "react";

export default function ClassesList({ classes, onClassClick }) {
  if (!classes.length) return null;

  return (
    <div className="bg-gray-100 py-6 px-6">
      <h2 className="text-lg font-semibold mb-4">Classes</h2>
      <div className="flex space-x-4 overflow-x-auto">
        {classes.map((cls) => (
          <button
            key={cls._id}
            onClick={() => onClassClick(cls._id)}
            className="min-w-[120px] flex-shrink-0 px-4 py-6 bg-white rounded shadow hover:bg-gray-50 text-center"
          >
            {cls.name}
          </button>
        ))}
      </div>
    </div>
  );
}
