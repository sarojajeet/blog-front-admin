import React, { useEffect, useState } from "react";
import axios from "axios";
import { Menu, Card, Spin, message } from "antd";
import { IP } from "../../utils/Constent";
import ClassCarousel from "./ClassCarousel";

const StudyMaterialListPage = () => {
  const [categories, setCategories] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [materialsSource, setMaterialsSource] = useState(""); // "subCarousel" or ""

  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchMaterials(); // load all initially
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${IP}/api/v1/categoriesWithSubcategories`);
      setCategories(res.data.categories || []);
    } catch (err) {
      message.error("Failed to load categories");
    }
  };

  const fetchMaterials = async (
    categoryId = "",
    subCategoryId = "",
    subCarouselId = ""
  ) => {
    try {
      setLoading(true);
      let url = `${IP}/api/v1/get-study-material`;
      const params = new URLSearchParams();
      if (categoryId) params.append("category", categoryId);
      if (subCategoryId) params.append("subCategory", subCategoryId);
      if (subCarouselId) params.append("subCarouselId", subCarouselId);
      if ([...params].length) url += `?${params.toString()}`;

      const res = await axios.get(url);
      setMaterials(res.data || []);

      if (subCarouselId) {
        setMaterialsSource("subCarousel");
      } else {
        setMaterialsSource("");
      }
    } catch (err) {
      message.error("Failed to load materials");
    } finally {
      setLoading(false);
    }
  };

  const handleFetchByCarousel = (subCarouselId) => {
    fetchMaterials("", "", subCarouselId);
  };

  const fetchClasses = async (subCategoryId) => {
    try {
      const res = await axios.get(
        `${IP}/api/v1/subcategory/${subCategoryId}/classes`
      );
      setClasses(res.data.classes || []);
    } catch (error) {
      console.error("Failed to load classes:", error);
      message.error("Failed to load classes");
      setClasses([]);
    }
  };

  const handleCategoryClick = (categoryId) => {
    fetchMaterials(categoryId);
    setClasses([]); // clear classes if only category is clicked
  };

  const handleSubCategoryClick = (categoryId, subCategoryId) => {
    fetchMaterials(categoryId, subCategoryId);
    fetchClasses(subCategoryId);
  };

  const menuItems = categories.map((cat) => {
    if (cat.subcategories?.length) {
      return {
        key: cat._id,
        label: cat.name,
        children: cat.subcategories.map((sub) => ({
          key: sub._id,
          label: sub.name,
          onClick: () => handleSubCategoryClick(cat._id, sub._id),
        })),
      };
    } else {
      return {
        key: cat._id,
        label: cat.name,
        onClick: () => handleCategoryClick(cat._id),
      };
    }
  });

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6">
      <Menu
        mode="vertical"
        className="w-full md:w-64 border rounded shadow"
        style={{ maxHeight: "80vh", overflowY: "auto" }}
        items={menuItems}
      />

      <div className="flex-1">
        {classes.length > 0 && (
          <>
            <h2 className="text-lg font-semibold mb-4">Classes</h2>
            <ClassCarousel
              classes={classes}
              onFetchByCarousel={handleFetchByCarousel}
            />
          </>
        )}

        {materialsSource === "subCarousel" && (
          <>
            <h2 className="text-lg font-semibold mb-4">Study Materials</h2>
            {loading ? (
              <Spin />
            ) : materials.length === 0 ? (
              <p>No study materials found.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {materials.map((material) => (
                  <Card key={material._id} title={material.name} bordered>
                    <p>
                      <strong>Language:</strong> {material.language}
                    </p>
                    <a
                      href={material.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600"
                    >
                      View PDF
                    </a>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default StudyMaterialListPage;
