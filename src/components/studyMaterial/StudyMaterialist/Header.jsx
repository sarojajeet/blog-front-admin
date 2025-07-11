import React, { useEffect, useState } from "react";
import ClassesList from "./ClassesList";
import AccordiansList from "./AccordiansList";

export default function Header() {
  const [categories, setCategories] = useState([]);
  const [classes, setClasses] = useState([]);
  const [accordians, setAccordians] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/v1/categoriesWithSubcategories"
        );
        const data = await res.json();
        setCategories(data.categories);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };

    fetchCategories();
  }, []);

  const handleSubcategoryClick = async (subcategoryId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/v1/subcategory/${subcategoryId}/classes`
      );
      const data = await res.json();
      setClasses(data.classes);
      setAccordians([]); // clear old accordians
    } catch (err) {
      console.error("Failed to fetch classes:", err);
      setClasses([]);
    }
  };

  const handleClassClick = async (classId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/v1/class/${classId}/carousels`
      );
      const data = await res.json();
      setAccordians(data.carousels);
    } catch (err) {
      console.error("Failed to fetch accordians:", err);
      setAccordians([]);
    }
  };

  return (
    <>
      <header className="bg-blue-600 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex space-x-8">
          {categories.map((category) => (
            <div key={category._id} className="relative group">
              <button className="hover:text-gray-200 font-semibold">
                {category.name}
              </button>

              {category.subcategories && category.subcategories.length > 0 && (
                <div className="absolute left-0 mt-2 w-48 bg-white text-black rounded shadow-lg opacity-0 group-hover:opacity-100 group-hover:visible invisible transition duration-200">
                  {category.subcategories.map((sub) => (
                    <button
                      key={sub._id}
                      onClick={() => handleSubcategoryClick(sub._id)}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      {sub.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </header>

      <ClassesList classes={classes} onClassClick={handleClassClick} />
      <AccordiansList accordians={accordians} />
    </>
  );
}
