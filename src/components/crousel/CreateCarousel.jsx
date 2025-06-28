import React, { useEffect, useState } from "react";
import { Form, Input, Select, Button, message, Spin } from "antd";
import axios from "axios";

const { Option } = Select;

const CreateCarousel = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "http://localhost:5000/api/v1/categoriesWithSubcategories"
      );
      setCategories(res.data.categories);
    } catch (err) {
      message.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (categoryId) => {
    const selectedCategory = categories.find((cat) => cat._id === categoryId);
    setSubcategories(selectedCategory?.subcategories || []);
    form.setFieldsValue({ subcategory: undefined });
  };

  const handleSubmit = async (values) => {
    try {
      await axios.post("http://localhost:5000/api/v1/carousel/create", values);
      message.success("Carousel created successfully");
      form.resetFields();
    } catch (err) {
      message.error(err.response?.data?.error || "Error creating carousel");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-2xl shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Create Carousel</h2>

      {loading ? (
        <div className="text-center">
          <Spin />
        </div>
      ) : (
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Category"
            name="category"
            rules={[{ required: true, message: "Please select a category" }]}
          >
            <Select
              placeholder="Select Category"
              onChange={handleCategoryChange}
            >
              {categories.map((cat) => (
                <Option key={cat._id} value={cat._id}>
                  {cat.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Subcategory"
            name="subcategory"
            rules={[{ required: true, message: "Please select a subcategory" }]}
          >
            <Select placeholder="Select Subcategory">
              {subcategories.map((sub) => (
                <Option key={sub._id} value={sub._id}>
                  {sub.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Carousel Name"
            name="name"
            rules={[{ required: true, message: "Please enter a name" }]}
          >
            <Input placeholder="Enter carousel name" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full">
              Create Carousel
            </Button>
          </Form.Item>
        </Form>
      )}
    </div>
  );
};

export default CreateCarousel;
