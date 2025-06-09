// src/pages/CategoryManager.jsx
import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Input,
  Form,
  message,
  Popconfirm,
  Empty,
} from "antd";
import axios from "axios";
import { IP } from "../../utils/Constent";

const CategoryManager = () => {
  const [categories, setCategories] = useState([]); // Always an array
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form] = Form.useForm();

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${IP}/api/v1/categories`);
      //   `${IP}/api/v1/categories`
      const data = Array.isArray(res.data) ? res.data : [];
      setCategories(data);
    } catch (err) {
      console.error(err);
      setCategories([]);
      message.error("Failed to load categories");
    }
    setLoading(false);
  };

  const handleSubmit = async (values) => {
    try {
      if (editingCategory) {
        await axios.put(
          `${IP}/api/v1/categories/${editingCategory._id}`,
          values
        );
        message.success("Category updated");
      } else {
        await axios.post(`${IP}/api/v1/categories`, values);
        message.success("Category created");
      }
      setOpenModal(false);
      form.resetFields();
      fetchCategories();
    } catch (err) {
      message.error(err.response?.data?.error || "Operation failed");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${IP}/api/v1/categories/${id}`);
      message.success("Category deleted");
      fetchCategories();
    } catch (err) {
      message.error("Delete failed");
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Actions",
      render: (_, record) => (
        <div className="flex gap-2">
          <Button
            type="link"
            onClick={() => {
              setEditingCategory(record);
              form.setFieldsValue(record);
              setOpenModal(true);
            }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete?"
            onConfirm={() => handleDelete(record._id)}
          >
            <Button danger type="link">
              Delete
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-2xl shadow-md">
      <div className="flex justify-between mb-4 items-center">
        <h1 className="text-2xl font-bold">Category Management</h1>
        <Button
          type="primary"
          onClick={() => {
            setEditingCategory(null);
            form.resetFields();
            setOpenModal(true);
          }}
        >
          Add Category
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={Array.isArray(categories) ? categories : []}
        rowKey="_id"
        loading={loading}
        locale={{ emptyText: <Empty description="No categories found" /> }}
      />

      <Modal
        title={editingCategory ? "Edit Category" : "Add Category"}
        open={openModal}
        onCancel={() => setOpenModal(false)}
        onOk={() => form.submit()}
        destroyOnClose
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            name="name"
            label="Category Name"
            rules={[
              { required: true, message: "Please enter a category name" },
            ]}
          >
            <Input placeholder="Enter category name" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoryManager;
