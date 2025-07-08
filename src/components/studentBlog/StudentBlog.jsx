import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { Input, Button, message } from "antd";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useParams, useNavigate } from "react-router-dom";
import { IP } from "../utils/Constent";

export default function BlogForm() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!slug;

  const [formData, setFormData] = useState({
    title: "",
    shortMetaDescription: "",
    content: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      const fetchBlog = async () => {
        try {
          const response = await axios.get(`${IP}/api/v1/blogs/${slug}`);
          const blog = response.data;

          setFormData({
            title: blog.title || "",
            shortMetaDescription: blog.shortMetaDescription || "",
            content: blog.content || "",
          });
        } catch (err) {
          console.error(err);
          message.error("Failed to load blog");
          navigate("/blogs");
        }
      };
      fetchBlog();
    }
  }, [slug, isEditMode, navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleQuillChange = useCallback((value) => {
    setFormData((prev) => ({ ...prev, content: value }));
  }, []);

  const imageHandler = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      const formData = new FormData();
      formData.append("image", file);

      try {
        const res = await axios.post(`${IP}/api/v1/upload-image`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        const imageUrl = res.data.url;

        const editor = document.querySelector(".ql-editor");
        const range = window.getSelection().getRangeAt(0);
        const img = document.createElement("img");
        img.src = imageUrl;
        range.insertNode(img);
      } catch (err) {
        console.error("Image upload failed", err);
      }
    };
  }, []);

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, false] }],
          ["bold", "italic", "underline", "strike", "blockquote"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link", "image"],
          ["clean"],
        ],
        handlers: {
          image: imageHandler,
        },
      },
      clipboard: {
        matchVisual: false,
      },
    }),
    [imageHandler]
  );

  const formats = useMemo(
    () => [
      "header",
      "bold",
      "italic",
      "underline",
      "strike",
      "blockquote",
      "list",
      "bullet",
      "link",
      "image",
    ],
    []
  );

  const handleSubmit = async () => {
    if (!formData.title || !formData.content) {
      message.error("Title and content are required");
      return;
    }

    try {
      setLoading(true);
      if (isEditMode) {
        await axios.put(`${IP}/api/v1/blogs/${slug}`, formData);
        message.success("Blog updated successfully!");
      } else {
        await axios.post(`${IP}/api/v1/blogs`, formData);
        message.success("Blog created successfully!");
      }
      navigate("/blogs");
    } catch (err) {
      console.error(err);
      const errorMessage =
        err.response?.data?.message ||
        (isEditMode ? "Failed to update blog" : "Failed to create blog");
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white rounded-xl shadow-lg space-y-4">
      <h2 className="text-2xl font-semibold mb-4">
        {isEditMode ? "Edit Blog Post" : "Create Blog Post"}
      </h2>
      <div className="space-y-4">
        <Input
          placeholder="Title*"
          name="title"
          value={formData.title}
          onChange={handleChange}
        />
        <Input
          placeholder="Short Meta Description"
          name="shortMetaDescription"
          value={formData.shortMetaDescription}
          onChange={handleChange}
        />

        <div>
          <label className="block mb-2 font-medium">Blog Content*</label>
          <div className="h-[400px] mb-12">
            <ReactQuill
              value={formData.content}
              onChange={handleQuillChange}
              className="h-[300px]"
              theme="snow"
              modules={modules}
              formats={formats}
              placeholder="Write your content here..."
            />
          </div>
        </div>

        <Button
          type="primary"
          loading={loading}
          onClick={handleSubmit}
          className="w-full bg-blue-600 hover:bg-blue-700"
          disabled={!formData.title || !formData.content}
        >
          {isEditMode ? "Update Blog" : "Create Blog"}
        </Button>
      </div>
    </div>
  );
}
