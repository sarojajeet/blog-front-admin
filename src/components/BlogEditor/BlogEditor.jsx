// src/pages/BlogEditor.jsx
import React, { useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import { Input, Button, Form, message } from "antd";
import axios from "axios";

const BlogEditor = () => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const onFinish = async ({ title }) => {
    if (!content.trim()) {
      message.error("Please enter blog content.");
      return;
    }

    setLoading(true);
    try {
      await axios.post("/api/blogs", { title, content });
      message.success("Blog posted successfully!");
      setContent("");
    } catch (err) {
      message.error(err.response?.data?.error || "Error posting blog");
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-2xl shadow">
      <h2 className="text-2xl font-bold mb-4">Write a Blog</h2>

      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: "Please enter a blog title" }]}
        >
          <Input placeholder="Blog title..." />
        </Form.Item>

        <div className="mb-4" data-color-mode="light">
          <label className="block text-gray-700 font-medium mb-2">
            Content
          </label>
          <MDEditor value={content} onChange={setContent} height={300} />
        </div>

        <Button type="primary" htmlType="submit" loading={loading}>
          Submit Blog
        </Button>
      </Form>
    </div>
  );
};

export default BlogEditor;
