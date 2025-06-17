// src/pages/CategoryManagement.js
import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Upload,
  message,
  Space,
  Card,
  Image,
} from "antd";
import {
  UploadOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import axios from "axios";

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Columns for AntD Table
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (image) =>
        image ? <Image width={50} src={image} alt="category" /> : "No Image",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record._id)}
          />
        </Space>
      ),
    },
  ];

  // Fetch categories from API
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/categories");
      setCategories(response.data.data);
    } catch (error) {
      message.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle form submission
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const formData = new FormData();

      formData.append("name", values.name);
      formData.append("description", values.description);

      if (values.image && values.image[0]) {
        formData.append("image", values.image[0].originFileObj);
      }

      setLoading(true);

      if (currentCategory) {
        // Update existing category
        await axios.put(`/api/categories/${currentCategory._id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        message.success("Category updated successfully");
      } else {
        // Create new category
        await axios.post("/api/categories", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        message.success("Category created successfully");
      }

      setIsModalVisible(false);
      form.resetFields();
      fetchCategories();
    } catch (error) {
      message.error(error.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Handle edit action
  const handleEdit = (category) => {
    setCurrentCategory(category);
    form.setFieldsValue({
      name: category.name,
      description: category.description,
      image: category.image
        ? [
            {
              uid: "-1",
              name: "current-image",
              status: "done",
              url: category.image,
            },
          ]
        : [],
    });
    setIsModalVisible(true);
  };

  // Handle delete action
  const handleDelete = async (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this category?",
      content: "This action cannot be undone",
      onOk: async () => {
        try {
          await axios.delete(`/api/categories/${id}`);
          message.success("Category deleted successfully");
          fetchCategories();
        } catch (error) {
          message.error("Failed to delete category");
        }
      },
    });
  };

  // Upload props for AntD Upload component
  const uploadProps = {
    beforeUpload: (file) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error("You can only upload image files!");
      }
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error("Image must be smaller than 5MB!");
      }
      return isImage && isLt5M;
    },
    maxCount: 1,
    listType: "picture-card",
  };

  return (
    <Card
      title="Blog Categories Management"
      extra={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setCurrentCategory(null);
            form.resetFields();
            setIsModalVisible(true);
          }}
        >
          Add Category
        </Button>
      }
    >
      <Table
        columns={columns}
        dataSource={categories}
        rowKey="_id"
        loading={loading}
      />

      <Modal
        title={currentCategory ? "Edit Category" : "Add New Category"}
        visible={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Category Name"
            rules={[{ required: true, message: "Please input category name!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item
            name="image"
            label="Category Image"
            valuePropName="fileList"
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) {
                return e;
              }
              return e && e.fileList;
            }}
          >
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />}>Upload Image</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default CategoryManagement;
