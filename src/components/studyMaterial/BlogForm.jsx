// BlogForm.js
import React, { useState } from "react";
import { Form, Input, Button } from "antd";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const BlogForm = ({ onBlogSubmit, onCancel }) => {
  const [form] = Form.useForm();
  const [content, setContent] = useState("");

  const handleFinish = (values) => {
    onBlogSubmit({
      ...values,
      content: content,
    });
    form.resetFields();
    setContent("");
  };

  // Quill editor modules configuration
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      ["clean"],
    ],
  };

  // Quill editor formats configuration
  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "link",
    "image",
  ];

  return (
    <div className="mt-4 p-4 border rounded-lg">
      <h3 className="text-lg font-medium mb-4">Add Blog Content</h3>
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          name="title"
          label="Blog Title"
          rules={[{ required: true, message: "Please enter a title" }]}
        >
          <Input placeholder="Enter blog title" />
        </Form.Item>

        <Form.Item
          name="shortDescription"
          label="Short Description"
          rules={[
            { required: true, message: "Please enter a short description" },
          ]}
        >
          <Input placeholder="Enter short description" />
        </Form.Item>

        <Form.Item
          label="Content"
          required
          rules={[
            {
              validator: () =>
                content
                  ? Promise.resolve()
                  : Promise.reject("Please enter blog content"),
            },
          ]}
        >
          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            modules={modules}
            formats={formats}
            placeholder="Write your blog content here..."
            className="h-64 mb-12"
          />
        </Form.Item>

        <div className="flex gap-2">
          <Button type="primary" htmlType="submit">
            Add Blog
          </Button>
          <Button onClick={onCancel}>Cancel</Button>
        </div>
      </Form>
    </div>
  );
};

export default BlogForm;
