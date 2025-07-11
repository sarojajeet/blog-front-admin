// ClassesDropdown.jsx
import React from "react";

export default function ClassesDropdown({ classes }) {
  return (
    <div className="absolute left-full top-0 ml-2 w-40 bg-white text-black rounded shadow-lg">
      {classes.length > 0 ? (
        classes.map((cls) => (
          <a
            key={cls._id}
            href="#"
            className="block px-4 py-2 hover:bg-gray-100"
          >
            {cls.name}
          </a>
        ))
      ) : (
        <div className="px-4 py-2 text-gray-500">No classes</div>
      )}
    </div>
  );
}
