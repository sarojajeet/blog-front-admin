import React, { useEffect, useRef, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import ImageResize from "quill-image-resize-module-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  Input,
  Select,
  Checkbox,
  Upload,
  Button,
  Form,
  message,
  Spin,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { IP } from "../../utils/Constent";

const { TextArea } = Input;

// Add this right after your imports
const escapeRegExp = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

// Quill configuration
const Font = Quill.import("formats/font");
Font.whitelist = ["sans-serif", "serif", "monospace"];
Quill.register(Font, true);

const Size = Quill.import("attributors/style/size");
Size.whitelist = ["small", "normal", "large", "huge"];
Quill.register(Size, true);
Quill.register("modules/imageResize", ImageResize);

const toolbarOptions = [
  [{ font: [] }, { size: [] }],
  ["bold", "italic", "underline", "strike", "blockquote", "code-block"],
  [{ script: "sub" }, { script: "super" }],
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ color: [] }, { background: [] }],
  [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
  [{ align: [] }, { direction: "rtl" }],
  ["link", "image", "video"],
  ["clean"],
];

const EditBlog = () => {
  const { id } = useParams();
  const editorRef = useRef(null);
  const quillRef = useRef(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    category: "Uncategorized",
    tags: [],
    metaDescription: "",
    isDraft: false,
    previewImage: null,
    existingPreviewImage: null,
  });

  const [localImages, setLocalImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch blog data when component mounts
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`${IP}/api/v1/blogs/${id}`);
        const blog = response.data;

        console.log(blog);
        setFormData({
          title: blog.title,
          category: blog.category || "Uncategorized",
          tags: blog.tags || [],
          metaDescription: blog.metaDescription || "",
          isDraft: blog.isDraft || false,
          existingPreviewImage: blog.previewImage || null,
        });

        // Wait until quillRef is initialized before setting content
        const interval = setInterval(() => {
          if (quillRef.current) {
            clearInterval(interval);
            if (blog.content) {
              quillRef.current.root.innerHTML = blog.content;

              const tempElement = document.createElement("div");
              tempElement.innerHTML = blog.content;
              const imgElements = tempElement.getElementsByTagName("img");
              const images = Array.from(imgElements).map((img) => img.src);
              setExistingImages(images);
            }
          }
        }, 100); // poll every 100ms until quillRef is available
      } catch (error) {
        console.error("Error fetching blog:", error);
        message.error("Failed to load blog post");
        navigate("/blogs");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id, navigate]);

  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        modules: {
          toolbar: {
            container: toolbarOptions,
            handlers: {
              image: imageHandler,
            },
          },
          imageResize: {
            displaySize: true,
          },
        },
      });
    }
  }, [editorRef.current]);

  const imageHandler = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;

      if (file.size > 5 * 1024 * 1024) {
        message.error("Image size must be under 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const blobUrl = e.target.result;
        const range = quillRef.current.getSelection(true);
        quillRef.current.insertEmbed(range.index, "image", blobUrl);
        quillRef.current.setSelection(range.index + 1);
        setLocalImages((prev) => [...prev, { blobUrl, file }]);
      };
      reader.readAsDataURL(file);
    };
  };

  const handleChange = (changedValues) => {
    setFormData((prev) => ({ ...prev, ...changedValues }));
  };

  const handleTagsChange = (value) => {
    setFormData({ ...formData, tags: value });
  };

  const uploadImage = async (file) => {
    const form = new FormData();
    form.append("image", file);

    const response = await axios.post(`${IP}/api/v1/blogs/upload-image`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data.imageUrl;
  };

  const handleSubmit = async () => {
    if (!formData.title || !quillRef.current) {
      message.error("Title and content are required");
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();

      // Append all regular fields with proper formatting
      formDataToSend.append("title", formData.title);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("tags", JSON.stringify(formData.tags || []));
      formDataToSend.append("metaDescription", formData.metaDescription || "");
      formDataToSend.append("isDraft", formData.isDraft ? "true" : "false");

      // Append preview image if exists
      if (formData.previewImage?.file) {
        formDataToSend.append("previewImage", formData.previewImage.file);
      } else if (formData.existingPreviewImage === null) {
        // Explicitly send empty string to remove image
        formDataToSend.append("previewImageUrl", "");
      } else if (formData.existingPreviewImage) {
        // Keep existing image
        formDataToSend.append("previewImageUrl", formData.existingPreviewImage);
      }

      // Handle content images
      let contentHTML = quillRef.current.root.innerHTML;

      // Upload new images and replace blob URLs
      const imageUploadPromises = localImages.map(async (img) => {
        try {
          const imageUrl = await uploadImage(img.file);
          const escapedBlobUrl = escapeRegExp(img.blobUrl);
          contentHTML = contentHTML.replace(
            new RegExp(escapedBlobUrl, "g"),
            imageUrl
          );
        } catch (error) {
          console.error("Failed to upload image:", error);
          // Keep the blob URL if upload fails
        }
      });

      await Promise.all(imageUploadPromises);
      formDataToSend.append("content", contentHTML);

      // Send update request
      const response = await axios.put(
        `${IP}/api/v1/blogs/${id}`,
        formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      message.success(
        formData.isDraft
          ? "Draft updated successfully!"
          : "Blog updated successfully!"
      );
      navigate(`/blogs/${response.data.slug}`);
    } catch (error) {
      console.error("Update error:", error);
      if (error.response) {
        if (error.response.status === 400) {
          message.error(error.response.data.message || "Validation failed");
        } else if (error.response.status === 500) {
          message.error("Server error. Please try again later.");
        }
      } else {
        message.error("Network error. Please check your connection.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemovePreviewImage = () => {
    setFormData((prev) => ({
      ...prev,
      previewImage: null,
      existingPreviewImage: null,
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-md mt-10">
      <h1 className="text-3xl font-semibold mb-6">Edit Blog Post</h1>

      <Form
        layout="vertical"
        initialValues={formData}
        onFinish={handleSubmit}
        onValuesChange={(_, allValues) => handleChange(allValues)}
      >
        <Form.Item label="Title" name="title" rules={[{ required: true }]}>
          <Input placeholder="Enter your blog title" />
        </Form.Item>

        <Form.Item label="Preview Image">
          {formData.existingPreviewImage && !formData.previewImage ? (
            <div className="mb-4">
              <img
                src={formData.existingPreviewImage}
                alt="Current preview"
                className="max-h-48 mb-2"
              />
              <Button
                danger
                onClick={handleRemovePreviewImage}
                className="mr-2"
              >
                Remove Image
              </Button>
            </div>
          ) : null}
          <Upload
            beforeUpload={(file) => {
              handleChange({ previewImage: { file } });
              return false;
            }}
            maxCount={1}
            accept="image/*"
            showUploadList={{ showRemoveIcon: true }}
          >
            <Button icon={<UploadOutlined />}>
              {formData.existingPreviewImage
                ? "Change Image"
                : "Upload Preview"}
            </Button>
          </Upload>
        </Form.Item>

        <Form.Item label="Category" name="category">
          <Select
            options={[
              { label: "Technology", value: "Technology" },
              { label: "Lifestyle", value: "Lifestyle" },
              { label: "Business", value: "Business" },
              { label: "Uncategorized", value: "Uncategorized" },
            ]}
          />
        </Form.Item>

        <Form.Item label="Tags" name="tags">
          <Select
            mode="tags"
            style={{ width: "100%" }}
            placeholder="e.g. react, javascript"
            onChange={handleTagsChange}
          />
        </Form.Item>

        <Form.Item label="Meta Description" name="metaDescription">
          <TextArea rows={3} maxLength={160} placeholder="For SEO..." />
        </Form.Item>

        <Form.Item name="isDraft" valuePropName="checked">
          <Checkbox>Save as Draft</Checkbox>
        </Form.Item>

        <Form.Item label="Content">
          <div
            ref={editorRef}
            className="quill-editor bg-white min-h-[300px] border rounded-md"
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={isSubmitting}
            className="mt-4 mr-4"
          >
            {formData.isDraft ? "Update Draft" : "Update Blog"}
          </Button>
          <Button onClick={() => navigate(-1)} className="mt-4">
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditBlog;
