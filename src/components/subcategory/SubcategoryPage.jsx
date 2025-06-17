// src/pages/SubcategoryPage.jsx
import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Popconfirm,
} from "antd";
import axios from "axios";
import { IP } from "../../utils/Constent";

const SubcategoryPage = () => {
  const [form] = Form.useForm();
  const [subcategories, setSubcategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState(null);

  // Load subcategories
  const fetchSubcategories = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${IP}/api/v1/subcategories`);

      setSubcategories(res.data);
    } catch (err) {
      message.error("Failed to load subcategories");
    }
    setLoading(false);
  };

  // Load categories for dropdown
  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${IP}/api/v1/categories`);
      setCategories(res.data);
    } catch (err) {
      message.error("Failed to load categories");
    }
  };

  useEffect(() => {
    fetchSubcategories();
    fetchCategories();
  }, []);

  const openModal = (record = null) => {
    setEditing(record);
    setModalVisible(true);
    form.setFieldsValue({
      name: record?.name || "",
      category: record?.category?._id || undefined,
    });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${IP}/api/v1/subcategories/${id}`);
      message.success("Subcategory deleted");
      fetchSubcategories();
    } catch {
      message.error("Delete failed");
    }
  };

  const handleFinish = async (values) => {
    try {
      if (editing) {
        await axios.put(`${IP}/api/v1/subcategories/${editing._id}`, values);
        message.success("Subcategory updated");
      } else {
        await axios.post(`${IP}/api/v1/subcategories`, values);
        message.success("Subcategory created");
      }
      setModalVisible(false);
      form.resetFields();
      fetchSubcategories();
    } catch {
      message.error("Save failed");
    }
  };

  const columns = [
    { title: "Name", dataIndex: "name" },
    { title: "Category", dataIndex: ["category", "name"] },
    {
      title: "Actions",
      render: (_, record) => (
        <div className="space-x-2">
          <Button onClick={() => openModal(record)} size="small">
            Edit
          </Button>
          <Popconfirm
            title="Are you sure?"
            onConfirm={() => handleDelete(record._id)}
          >
            <Button danger size="small">
              Delete
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Subcategories</h2>
        <Button type="primary" onClick={() => openModal()}>
          + Add Subcategory
        </Button>
      </div>

      <Table
        dataSource={subcategories}
        columns={columns}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 8 }}
      />

      <Modal
        title={editing ? "Edit Subcategory" : "New Subcategory"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        okText={editing ? "Update" : "Create"}
        destroyOnHidden
      >
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item
            name="name"
            label="Subcategory Name"
            rules={[{ required: true }]}
          >
            <Input placeholder="Enter subcategory name" />
          </Form.Item>

          <Form.Item
            name="category"
            label="Parent Category"
            rules={[{ required: true }]}
          >
            <Select placeholder="Select a category">
              {categories.map((cat) => (
                <Select.Option key={cat._id} value={cat._id}>
                  {cat.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SubcategoryPage;
