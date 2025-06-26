import React, { useEffect, useState } from "react";
import { Form, Select, message, Button, Upload, Input } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import { IP } from "../../utils/Constent";

const { Option } = Select;

const CreateStudyMaterialForm = () => {
  const [categories, setCategories] = useState([]);
  const [selectionPath, setSelectionPath] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/v1/categoriesWithSubcategories"
      );
      setCategories(res.data.categories);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      message.error("Failed to load categories");
    }
  };

  const getCurrentSubcategories = () => {
    let current = { subcategories: categories };
    for (const id of selectionPath) {
      current = current.subcategories.find((c) => c._id === id);
    }
    return current?.subcategories || [];
  };

  const handleCategoryChange = (level, value) => {
    const newPath = [...selectionPath.slice(0, level), value];
    setSelectionPath(newPath);
  };

  const handleFileChange = ({ fileList }) => {
    setFileList(fileList.slice(-1)); // Only keep the latest file
  };

  const handleFinish = async (values) => {
    if (!fileList.length) {
      message.warning("Please upload a PDF file.");
      return;
    }

    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("language", values.language);
    formData.append("pdf", fileList[0].originFileObj); // important
    formData.append("category", selectionPath[0]);
    selectionPath
      .slice(1)
      .forEach((subId) => formData.append("subCategories[]", subId));

    try {
      setLoading(true);
      await axios.post(`${IP}/api/v1/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      message.success("Study material uploaded!");
      form.resetFields();
      setSelectionPath([]);
      setFileList([]);
    } catch (error) {
      console.error("Upload failed:", error);
      message.error("Upload failed.");
    } finally {
      setLoading(false); // ← Step 3
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4">Create Study Material</h2>

      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          name="name"
          label="Material Name"
          rules={[{ required: true }]}
        >
          <Input placeholder="Enter material name" />
        </Form.Item>

        <Form.Item
          name="language"
          label="Language"
          rules={[{ required: true }]}
        >
          <Select placeholder="Select language">
            <Option value="English">English</Option>
            <Option value="Hindi">Hindi</Option>
            <Option value="Other">Other</Option>
          </Select>
        </Form.Item>

        {[...Array(selectionPath.length + 1)].map((_, level) => {
          let options = level === 0 ? categories : categories;
          for (let i = 0; i < level; i++) {
            const parent = options.find((c) => c._id === selectionPath[i]);
            options = parent?.subcategories || [];
          }

          if (!options.length) return null;

          return (
            <Form.Item
              key={level}
              label={level === 0 ? "Category" : `Subcategory ${level}`}
              required
            >
              <Select
                value={selectionPath[level]}
                placeholder={`Select ${
                  level === 0 ? "category" : "subcategory"
                }`}
                onChange={(value) => handleCategoryChange(level, value)}
              >
                {options.map((cat) => (
                  <Option key={cat._id} value={cat._id}>
                    {cat.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          );
        })}

        {/* Upload PDF */}
        <Form.Item label="Upload PDF" required>
          <Upload
            accept=".pdf"
            beforeUpload={() => false} // Prevent auto upload
            fileList={fileList}
            onChange={handleFileChange}
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>Select PDF File</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="w-full"
            loading={loading}
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateStudyMaterialForm;
