import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
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

const UpdateResult = () => {
  const [categories, setCategories] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [form] = Form.useForm();
  const quillRef = useRef(null);
  const editorRef = useRef(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const catRes = await axios.get(`${IP}/api/v1/result-categories`);
        setCategories(catRes.data);

        // Fetch result data
        const res = await axios.get(`${IP}/api/v1/result/${id}`);
        const result = res.data;

        // Set form values
        form.setFieldsValue({
          year: result.year,
          state: result.state,
          rank: result.rank,
          rollNo: result.rollNo,
          marks: result.marks,
          rollCode: result.rollCode,
          district: result.district,
          category: result.category?._id,
          blogTitle: result.blogTitle,
          blogShortMetaDescription: result.blogShortMetaDescription,
        });

        // Set image if exists
        if (result.image) {
          setFileList([
            {
              uid: "-1",
              name: "current-image",
              status: "done",
              url: result.image,
            },
          ]);
        }

        // Initialize Quill and set content if exists
        if (!quillRef.current) {
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

        // Set blog content if exists
        if (result.blogContent) {
          quillRef.current.root.innerHTML = result.blogContent;
        }

        setFetching(false);
      } catch (err) {
        console.error(err);
        message.error("Failed to load data.");
        setFetching(false);
      }
    };

    fetchData();
  }, [id, form]);

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
    const data = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value) {
        data.append(key, value);
      }
    });

    // Append new image if uploaded
    if (fileList.length && fileList[0].originFileObj) {
      data.append("image", fileList[0].originFileObj);
    }

    // Get Quill content as HTML
    const blogContent = quillRef.current.root.innerHTML;

    if (values.blogTitle) {
      data.append("blogTitle", values.blogTitle);
      data.append(
        "blogShortMetaDescription",
        values.blogShortMetaDescription || ""
      );
      data.append("blogContent", blogContent);
    }

    try {
      setLoading(true);
      await axios.put(`${IP}/api/v1/results/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      message.success("✅ Result updated successfully!");
      navigate(`/results/${id}`);
    } catch (err) {
      console.error(err);
      message.error("❌ Update failed.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card title="Update Result" bordered>
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

          <Form.Item label="Image">
            <Upload
              beforeUpload={() => false}
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList)}
              accept="image/*"
              maxCount={1}
              listType="picture"
            >
              <Button icon={<UploadOutlined />}>
                {fileList.length ? "Change Image" : "Select Image"}
              </Button>
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
              Update Result
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default UpdateResult;
