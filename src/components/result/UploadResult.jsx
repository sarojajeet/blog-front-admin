import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Form,
  Input,
  InputNumber,
  Button,
  Select,
  Upload,
  message,
  Card,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { IP } from "../../utils/Constent";

const { Option } = Select;

const UploadResult = () => {
  const [categories, setCategories] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm(); // ✅ AntD form instance

  useEffect(() => {
    // Fetch categories on mount
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${IP}/api/v1/result-categories`);
        setCategories(res.data);
      } catch (err) {
        console.error(err);
        message.error("Failed to load categories.");
      }
    };

    fetchCategories();
  }, []);

  const onFinish = async (values) => {
    const data = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      data.append(key, value);
    });
    if (fileList.length) {
      data.append("image", fileList[0].originFileObj);
    }

    try {
      setLoading(true);
      await axios.post(`${IP}/api/v1/results`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      message.success("✅ Result uploaded successfully!");

      // ✅ Reset form fields
      form.resetFields();
      setFileList([]);
    } catch (err) {
      console.error(err);
      message.error("❌ Failed to upload result.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card title="Upload Result" bordered>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Year"
            name="year"
            rules={[{ required: true, message: "Please enter year" }]}
          >
            <InputNumber className="w-full" placeholder="e.g. 2024" />
          </Form.Item>

          <Form.Item
            label="State"
            name="state"
            rules={[{ required: true, message: "Please enter state" }]}
          >
            <Input placeholder="State name" />
          </Form.Item>

          <Form.Item
            label="Rank"
            name="rank"
            rules={[{ required: true, message: "Please enter rank" }]}
          >
            <InputNumber className="w-full" placeholder="Rank" />
          </Form.Item>

          <Form.Item
            label="Roll No"
            name="rollNo"
            rules={[{ required: true, message: "Please enter roll number" }]}
          >
            <Input placeholder="Roll No" />
          </Form.Item>

          <Form.Item
            label="Marks"
            name="marks"
            rules={[{ required: true, message: "Please enter marks" }]}
          >
            <InputNumber className="w-full" placeholder="Marks" />
          </Form.Item>

          <Form.Item
            label="Roll Code"
            name="rollCode"
            rules={[{ required: true, message: "Please enter roll code" }]}
          >
            <Input placeholder="Roll Code" />
          </Form.Item>

          <Form.Item
            label="District"
            name="district"
            rules={[{ required: true, message: "Please enter district" }]}
          >
            <Input placeholder="District" />
          </Form.Item>

          <Form.Item
            label="Category"
            name="category"
            rules={[{ required: true, message: "Please select category" }]}
          >
            <Select placeholder="Select a category">
              {categories.map((cat) => (
                <Option key={cat._id} value={cat._id}>
                  {cat.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Image"
            rules={[{ required: true, message: "Please upload an image" }]}
          >
            <Upload
              beforeUpload={() => false}
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList)}
              accept="image/*"
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Select Image</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-full"
            >
              Upload Result
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default UploadResult;
