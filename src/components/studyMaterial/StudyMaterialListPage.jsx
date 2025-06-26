import React, { useEffect, useState } from "react";
import axios from "axios";
import { Menu, Card, Spin, message } from "antd";
import { IP } from "../../utils/Constent";

const { SubMenu } = Menu;

const StudyMaterialListPage = () => {
  const [categories, setCategories] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchMaterials(); // Load all initially
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${IP}/api/v1/categoriesWithSubcategories`);
      setCategories(res.data.categories || []);
    } catch (err) {
      message.error("Failed to load categories");
    }
  };

  const fetchMaterials = async (categoryId = "", subCategoryId = "") => {
    try {
      setLoading(true);
      let url = `${IP}/api/v1/get-study-material`;
      const params = new URLSearchParams();
      if (categoryId) params.append("category", categoryId);
      if (subCategoryId) params.append("subCategory", subCategoryId);
      if ([...params].length) url += `?${params.toString()}`;

      const res = await axios.get(url);
      setMaterials(res.data || []);
    } catch (err) {
      message.error("Failed to load materials");
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (categoryId) => {
    fetchMaterials(categoryId, "");
  };

  const handleSubCategoryClick = (categoryId, subCategoryId) => {
    fetchMaterials(categoryId, subCategoryId);
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6">
      {/* Sidebar Categories */}
      <Menu
        mode="vertical"
        className="w-full md:w-64 border rounded shadow"
        style={{ maxHeight: "80vh", overflowY: "auto" }}
      >
        {categories.map((cat) => (
          <SubMenu key={cat._id} title={cat.name}>
            {cat.subcategories?.length ? (
              cat.subcategories.map((sub) => (
                <Menu.Item
                  key={sub._id}
                  onClick={() => handleSubCategoryClick(cat._id, sub._id)}
                >
                  {sub.name}
                </Menu.Item>
              ))
            ) : (
              <Menu.Item onClick={() => handleCategoryClick(cat._id)}>
                {cat.name}
              </Menu.Item>
            )}
          </SubMenu>
        ))}
      </Menu>

      {/* Study Materials */}
      <div className="flex-1">
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
      </div>
    </div>
  );
};

export default StudyMaterialListPage;
