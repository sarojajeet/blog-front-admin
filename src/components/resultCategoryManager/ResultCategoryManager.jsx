import React, { useEffect, useState } from "react";
import { Form, Input, Button, List, message, Card } from "antd";
import axios from "axios";
import { IP } from "../../utils/Constent";

const { TextArea } = Input;

const ResultCategoryManager = () => {
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${IP}/api/v1/result-categories`);
      setCategories(res.data);
    } catch (err) {
      console.error(err);
      message.error("Failed to fetch categories.");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await axios.post(`${IP}/api/v1/result-categories`, values);
      message.success("Category created!");
      fetchCategories();
    } catch (err) {
      console.error(err);
      message.error(
        err.response?.data?.message || "Failed to create category."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <Card title="Create New Category" className="mb-8">
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter category name" }]}
          >
            <Input placeholder="e.g. 10th Board" />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <TextArea rows={4} placeholder="Optional description" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Create Category
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card title="All Categories">
        <List
          bordered
          dataSource={categories}
          renderItem={(category) => (
            <List.Item>
              <div>
                <p className="font-semibold">{category.name}</p>
                <p className="text-gray-600 text-sm">{category.description}</p>
              </div>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default ResultCategoryManager;
