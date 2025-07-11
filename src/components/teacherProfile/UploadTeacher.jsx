import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  InputNumber,
  Button,
  Select,
  Upload,
  message,
  Card,
  Divider,
  Spin,
  Rate,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import "quill-better-table/dist/quill-better-table.css";
import ImageResize from "quill-image-resize-module-react";
import QuillBetterTable from "quill-better-table";
import { IP } from "../../utils/Constent";

const { Option } = Select;

Quill.register("modules/imageResize", ImageResize);
Quill.register({ "modules/better-table": QuillBetterTable }, true);

const UploadTeacher = () => {
  const [categories, setCategories] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [form] = Form.useForm();
  const quillRef = useRef(null);
  const editorRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${IP}/api/v1/teacher-categories`);
        setCategories(res.data);
      } catch (err) {
        console.error(err);
        message.error("Failed to load categories.");
      }
    };

    fetchCategories();

    // Initialize Quill editor
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        modules: {
          toolbar: {
            container: [
              [{ font: [] }, { size: [] }],
              ["bold", "italic", "underline", "strike"],
              [{ list: "ordered" }, { list: "bullet" }],
              ["link", "image", "video", "table"],
              ["clean"],
            ],
            handlers: {
              image: imageHandler,
              table: () => {
                const rows = prompt("Rows:", "3");
                const cols = prompt("Cols:", "3");
                if (rows && cols) {
                  quillRef.current
                    .getModule("better-table")
                    .insertTable(parseInt(rows), parseInt(cols));
                }
              },
            },
          },
          imageResize: {},
          "better-table": {},
        },
      });
    }
  }, []);

  const imageHandler = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;

      if (file.size > 5 * 1024 * 1024) {
        message.error("Image must be under 5MB");
        return;
      }

      try {
        const data = new FormData();
        data.append("image", file);
        const res = await axios.post(`${IP}/api/v1/blogs/upload-image`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        const imageUrl = res.data.imageUrl;

        const range = quillRef.current.getSelection(true);
        quillRef.current.insertEmbed(range.index, "image", imageUrl);
        quillRef.current.setSelection(range.index + 1);
        message.success("Image uploaded!");
      } catch (err) {
        console.error(err);
        message.error("Upload failed");
      }
    };
  };

  const onFinish = async (values) => {
    if (!fileList.length) {
      message.error("Please upload a photo");
      return;
    }

    const data = new FormData();
    data.append("photo", fileList[0].originFileObj);
    data.append("subject", values.subject);
    data.append("star", values.star);
    data.append("experience", values.experience);
    data.append("category", values.category);

    // Append blog fields if they exist
    if (values.blogTitle) {
      data.append("blogTitle", values.blogTitle);
      data.append(
        "blogShortMetaDescription",
        values.blogShortMetaDescription || ""
      );
      data.append("blogContent", quillRef.current.root.innerHTML);
    }

    try {
      setLoading(true);
      await axios.post(`${IP}/api/v1/create-teacher`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      message.success("✅ Teacher created successfully!");
      form.resetFields();
      setFileList([]);
      quillRef.current.root.innerHTML = "";
      navigate("/teachers");
    } catch (err) {
      console.error(err);
      message.error("❌ Creation failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card title="Create New Teacher" bordered>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Subject"
            name="subject"
            rules={[{ required: true, message: "Please enter subject" }]}
          >
            <Input placeholder="e.g. Mathematics, Physics" />
          </Form.Item>

          <Form.Item
            label="Star Rating (1-5)"
            name="star"
            rules={[
              { required: true, message: "Please select a rating" },
              {
                type: "number",
                min: 1,
                max: 5,
                message: "Rating must be between 1 and 5",
              },
            ]}
          >
            <Rate />
          </Form.Item>

          <Form.Item
            label="Experience (years)"
            name="experience"
            rules={[{ required: true, message: "Please enter experience" }]}
          >
            <InputNumber
              className="w-full"
              placeholder="Years of experience"
              min={0}
            />
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
            label="Photo"
            rules={[{ required: true, message: "Please upload a photo" }]}
          >
            <Upload
              beforeUpload={() => false}
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList)}
              accept="image/*"
              maxCount={1}
              listType="picture"
            >
              <Button icon={<UploadOutlined />}>Select Photo</Button>
            </Upload>
          </Form.Item>

          <Divider>Optional Blog Post</Divider>

          <Form.Item label="Blog Title" name="blogTitle">
            <Input placeholder="Blog Title (optional)" />
          </Form.Item>
          <Form.Item
            label="Short Meta Description"
            name="blogShortMetaDescription"
          >
            <Input placeholder="Short description (optional)" />
          </Form.Item>

          <Form.Item label="Blog Content">
            <div
              ref={editorRef}
              className="h-[300px] border border-gray-300 rounded"
            ></div>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-full"
            >
              Create Teacher
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default UploadTeacher;
