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
  const [allSubcategories, setAllSubcategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState(null);
  const [readOnlyFields, setReadOnlyFields] = useState({
    category: false,
    parent: false,
  });
  const [isChildForm, setIsChildForm] = useState(false); // NEW

  const buildIndentedSubcategoryList = (subs, parentId = null, level = 0) => {
    return subs
      .filter((s) => (s.parent ? s.parent._id === parentId : parentId === null))
      .map((s) => ({
        ...s,
        indentName: `${"— ".repeat(level)}${s.name}`,
        children: buildIndentedSubcategoryList(subs, s._id, level + 1),
      }))
      .flat();
  };

  const fetchSubcategories = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${IP}/api/v1/subcategories`);
      setAllSubcategories(res.data);
      const flat = buildIndentedSubcategoryList(res.data);
      setSubcategories(flat);
    } catch (err) {
      message.error("Failed to load subcategories");
    }
    setLoading(false);
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${IP}/api/v1/categories`);
      setCategories(res.data);
    } catch (err) {
      message.error("Failed to load categories");
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchSubcategories();
  }, []);

  const openModal = (record = null, isChild = false) => {
    setEditing(record);
    setIsChildForm(isChild); // NEW
    setModalVisible(true);

    form.setFieldsValue({
      name: record?.name || "",
      category: record?.category || record?.category?._id || undefined,
      parent: record?.parent || record?.parent?._id || null,
    });

    if (isChild) {
      setReadOnlyFields({ category: true, parent: true });
    } else {
      setReadOnlyFields({ category: false, parent: false });
    }
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
      if (editing && editing._id) {
        await axios.put(`${IP}/api/v1/subcategories/${editing._id}`, values);
        message.success("Subcategory updated");
      } else {
        await axios.post(`${IP}/api/v1/subcategories`, values);
        message.success("Subcategory created");
      }
      setModalVisible(false);
      setIsChildForm(false); // NEW
      setReadOnlyFields({ category: false, parent: false });
      form.resetFields();
      fetchSubcategories();
    } catch {
      message.error("Save failed");
    }
  };

  const columns = [
    {
      title: "Subcategory",
      dataIndex: "indentName",
    },
    {
      title: "Category",
      dataIndex: ["category", "name"],
    },
    {
      title: "Parent",
      dataIndex: ["parent", "name"],
      render: (text) => text || "-",
    },
    {
      title: "Actions",
      render: (_, record) => (
        <div className="space-x-2">
          <Button onClick={() => openModal(record)} size="small">
            Edit
          </Button>
          <Button
            size="small"
            onClick={() =>
              openModal(
                {
                  name: "",
                  category: record.category._id,
                  parent: record._id,
                },
                true
              )
            }
          >
            + Add Child
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
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editing && editing._id ? "Edit Subcategory" : "New Subcategory"}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setReadOnlyFields({ category: false, parent: false });
          setIsChildForm(false); // NEW
        }}
        onOk={() => form.submit()}
        okText={editing && editing._id ? "Update" : "Create"}
        destroyOnClose
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
            <Select
              placeholder="Select a category"
              disabled={readOnlyFields.category}
            >
              {categories.map((cat) => (
                <Select.Option key={cat._id} value={cat._id}>
                  {cat.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          {isChildForm && (
            <Form.Item name="parent" label="Parent Subcategory">
              <Select
                placeholder="Select a parent subcategory"
                allowClear
                disabled={readOnlyFields.parent}
              >
                {subcategories.map((sub) => (
                  <Select.Option key={sub._id} value={sub._id}>
                    {sub.indentName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default SubcategoryPage;
