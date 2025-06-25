// import React, { useEffect, useRef, useState } from "react";
// import Quill from "quill";
// import "quill/dist/quill.snow.css";
// import ImageResize from "quill-image-resize-module-react";
// import { useNavigate, useParams } from "react-router-dom";

// import axios from "axios";
// import {
//   Input,
//   Select,
//   Checkbox,
//   Upload,
//   Button,
//   Form,
//   message,
//   Spin,
// } from "antd";
// import { UploadOutlined } from "@ant-design/icons";
// import { IP } from "../../utils/Constent";

// const { TextArea } = Input;

// // Add this right after your imports
// const escapeRegExp = (string) => {
//   return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
// };

// // Quill configuration
// const Font = Quill.import("formats/font");
// Font.whitelist = ["sans-serif", "serif", "monospace"];
// Quill.register(Font, true);

// const Size = Quill.import("attributors/style/size");
// Size.whitelist = ["small", "normal", "large", "huge"];
// Quill.register(Size, true);
// Quill.register("modules/imageResize", ImageResize);

// const toolbarOptions = [
//   [{ font: [] }, { size: [] }],
//   ["bold", "italic", "underline", "strike", "blockquote", "code-block"],
//   [{ script: "sub" }, { script: "super" }],
//   [{ header: [1, 2, 3, 4, 5, 6, false] }],
//   [{ color: [] }, { background: [] }],
//   [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
//   [{ align: [] }, { direction: "rtl" }],
//   ["link", "image", "video"],
//   ["clean"],
// ];

// const EditBlog = () => {
//   const { id } = useParams();
//   const editorRef = useRef(null);
//   const quillRef = useRef(null);
//   const navigate = useNavigate();
//   const [categories, setCategories] = useState([]);

//   const [formData, setFormData] = useState({
//     title: "",
//     category: "Uncategorized",
//     tags: [],
//     metaDescription: "",
//     isDraft: false,
//     previewImage: null,
//     existingPreviewImage: null,
//   });

//   const [localImages, setLocalImages] = useState([]);
//   const [existingImages, setExistingImages] = useState([]);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [loading, setLoading] = useState(true);

//   // Fetch blog data when component mounts
//   useEffect(() => {
//     const fetchBlog = async () => {
//       try {
//         const response = await axios.get(`${IP}/api/v1/blogs/${id}`);
//         const blog = response.data;

//         console.log(blog);
//         setFormData({
//           title: blog.title,
//           category: blog.category || "Uncategorized",
//           tags: blog.tags || [],
//           metaDescription: blog.metaDescription || "",
//           isDraft: blog.isDraft || false,
//           existingPreviewImage: blog.previewImage || null,
//         });

//         // Wait until quillRef is initialized before setting content
//         const interval = setInterval(() => {
//           if (quillRef.current) {
//             clearInterval(interval);
//             if (blog.content) {
//               quillRef.current.root.innerHTML = blog.content;

//               const tempElement = document.createElement("div");
//               tempElement.innerHTML = blog.content;
//               const imgElements = tempElement.getElementsByTagName("img");
//               const images = Array.from(imgElements).map((img) => img.src);
//               setExistingImages(images);
//             }
//           }
//         }, 100); // poll every 100ms until quillRef is available
//       } catch (error) {
//         console.error("Error fetching blog:", error);
//         message.error("Failed to load blog post");
//         navigate("/blogs");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBlog();
//   }, [id, navigate]);

//   useEffect(() => {
//     if (editorRef.current && !quillRef.current) {
//       quillRef.current = new Quill(editorRef.current, {
//         theme: "snow",
//         modules: {
//           toolbar: {
//             container: toolbarOptions,
//             handlers: {
//               image: imageHandler,
//             },
//           },
//           imageResize: {
//             displaySize: true,
//           },
//         },
//       });
//     }
//   }, [editorRef.current]);

//   const imageHandler = () => {
//     const input = document.createElement("input");
//     input.setAttribute("type", "file");
//     input.setAttribute("accept", "image/*");
//     input.click();

//     input.onchange = async () => {
//       const file = input.files[0];
//       if (!file) return;

//       if (file.size > 5 * 1024 * 1024) {
//         message.error("Image size must be under 5MB");
//         return;
//       }

//       const reader = new FileReader();
//       reader.onload = (e) => {
//         const blobUrl = e.target.result;
//         const range = quillRef.current.getSelection(true);
//         quillRef.current.insertEmbed(range.index, "image", blobUrl);
//         quillRef.current.setSelection(range.index + 1);
//         setLocalImages((prev) => [...prev, { blobUrl, file }]);
//       };
//       reader.readAsDataURL(file);
//     };
//   };

//   const handleChange = (changedValues) => {
//     setFormData((prev) => ({ ...prev, ...changedValues }));
//   };

//   const handleTagsChange = (value) => {
//     setFormData({ ...formData, tags: value });
//   };

//   const fetchCategories = async () => {
//     try {
//       const res = await axios.get(`${IP}/api/v1/categories`);
//       setCategories(res.data);
//     } catch (err) {
//       message.error("Failed to load categories");
//     }
//   };

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   const uploadImage = async (file) => {
//     const form = new FormData();
//     form.append("image", file);

//     const response = await axios.post(`${IP}/api/v1/blogs/upload-image`, form, {
//       headers: { "Content-Type": "multipart/form-data" },
//     });

//     return response.data.imageUrl;
//   };

//   const handleSubmit = async () => {
//     if (!formData.title || !quillRef.current) {
//       message.error("Title and content are required");
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       const formDataToSend = new FormData();

//       // Append all regular fields with proper formatting
//       formDataToSend.append("title", formData.title);
//       formDataToSend.append("category", formData.category);
//       formDataToSend.append("tags", JSON.stringify(formData.tags || []));
//       formDataToSend.append("metaDescription", formData.metaDescription || "");
//       formDataToSend.append("isDraft", formData.isDraft ? "true" : "false");

//       // Append preview image if exists
//       if (formData.previewImage?.file) {
//         formDataToSend.append("previewImage", formData.previewImage.file);
//       } else if (formData.existingPreviewImage === null) {
//         // Explicitly send empty string to remove image
//         formDataToSend.append("previewImageUrl", "");
//       } else if (formData.existingPreviewImage) {
//         // Keep existing image
//         formDataToSend.append("previewImageUrl", formData.existingPreviewImage);
//       }

//       // Handle content images
//       let contentHTML = quillRef.current.root.innerHTML;

//       // Upload new images and replace blob URLs
//       const imageUploadPromises = localImages.map(async (img) => {
//         try {
//           const imageUrl = await uploadImage(img.file);
//           const escapedBlobUrl = escapeRegExp(img.blobUrl);
//           contentHTML = contentHTML.replace(
//             new RegExp(escapedBlobUrl, "g"),
//             imageUrl
//           );
//         } catch (error) {
//           console.error("Failed to upload image:", error);
//           // Keep the blob URL if upload fails
//         }
//       });

//       await Promise.all(imageUploadPromises);
//       formDataToSend.append("content", contentHTML);

//       // Send update request
//       const response = await axios.put(
//         `${IP}/api/v1/blogs/${id}`,
//         formDataToSend,
//         {
//           headers: { "Content-Type": "multipart/form-data" },
//         }
//       );

//       message.success(
//         formData.isDraft
//           ? "Draft updated successfully!"
//           : "Blog updated successfully!"
//       );
//       navigate(`/blogs/${response.data.slug}`);
//     } catch (error) {
//       console.error("Update error:", error);
//       if (error.response) {
//         if (error.response.status === 400) {
//           message.error(error.response.data.message || "Validation failed");
//         } else if (error.response.status === 500) {
//           message.error("Server error. Please try again later.");
//         }
//       } else {
//         message.error("Network error. Please check your connection.");
//       }
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleRemovePreviewImage = () => {
//     setFormData((prev) => ({
//       ...prev,
//       previewImage: null,
//       existingPreviewImage: null,
//     }));
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <Spin size="large" />
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-md mt-10">
//       <h1 className="text-3xl font-semibold mb-6">Edit Blog Post</h1>

//       <Form
//         layout="vertical"
//         initialValues={formData}
//         onFinish={handleSubmit}
//         onValuesChange={(_, allValues) => handleChange(allValues)}
//       >
//         <Form.Item label="Title" name="title" rules={[{ required: true }]}>
//           <Input placeholder="Enter your blog title" />
//         </Form.Item>

//         <Form.Item label="Preview Image">
//           {formData.existingPreviewImage && !formData.previewImage ? (
//             <div className="mb-4">
//               <img
//                 src={formData.existingPreviewImage}
//                 alt="Current preview"
//                 className="max-h-48 mb-2"
//               />
//               <Button
//                 danger
//                 onClick={handleRemovePreviewImage}
//                 className="mr-2"
//               >
//                 Remove Image
//               </Button>
//             </div>
//           ) : null}
//           <Upload
//             beforeUpload={(file) => {
//               handleChange({ previewImage: { file } });
//               return false;
//             }}
//             maxCount={1}
//             accept="image/*"
//             showUploadList={{ showRemoveIcon: true }}
//           >
//             <Button icon={<UploadOutlined />}>
//               {formData.existingPreviewImage
//                 ? "Change Image"
//                 : "Upload Preview"}
//             </Button>
//           </Upload>
//         </Form.Item>

//         <Form.Item label="Category" name="category">
//           <Select placeholder="Select a category">
//             {categories.map((cat) => (
//               <Select.Option key={cat._id} value={cat._id}>
//                 {cat.name}
//               </Select.Option>
//             ))}
//           </Select>
//         </Form.Item>

//         <Form.Item label="Tags" name="tags">
//           <Select
//             mode="tags"
//             style={{ width: "100%" }}
//             placeholder="e.g. react, javascript"
//             onChange={handleTagsChange}
//           />
//         </Form.Item>

//         <Form.Item label="Meta Description" name="metaDescription">
//           <TextArea rows={3} maxLength={160} placeholder="For SEO..." />
//         </Form.Item>

//         <Form.Item name="isDraft" valuePropName="checked">
//           <Checkbox>Save as Draft</Checkbox>
//         </Form.Item>

//         <Form.Item label="Content">
//           <div
//             ref={editorRef}
//             className="quill-editor bg-white min-h-[300px] border rounded-md"
//           />
//         </Form.Item>

//         <Form.Item>
//           <Button
//             type="primary"
//             htmlType="submit"
//             loading={isSubmitting}
//             className="mt-4 mr-4"
//           >
//             {formData.isDraft ? "Update Draft" : "Update Blog"}
//           </Button>
//           <Button onClick={() => navigate(-1)} className="mt-4">
//             Cancel
//           </Button>
//         </Form.Item>
//       </Form>
//     </div>
//   );
// };

// export default EditBlog;

import React, { useEffect, useRef, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import QuillBetterTable from "quill-better-table";
import "quill-better-table/dist/quill-better-table.css";
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

// Utility to escape special characters in RegExp
const escapeRegExp = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

// Register custom Quill modules
const Font = Quill.import("formats/font");
Font.whitelist = ["sans-serif", "serif", "monospace"];
Quill.register(Font, true);

const Size = Quill.import("attributors/style/size");
Size.whitelist = ["small", "normal", "large", "huge"];
Quill.register(Size, true);

Quill.register("modules/imageResize", ImageResize);
Quill.register({ "modules/better-table": QuillBetterTable }, true);

const toolbarOptions = [
  [{ font: [] }, { size: [] }],
  ["bold", "italic", "underline", "strike", "blockquote", "code-block"],
  [{ script: "sub" }, { script: "super" }],
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ color: [] }, { background: [] }],
  [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
  [{ align: [] }, { direction: "rtl" }],
  ["link", "image", "video", "table"],
  ["clean"],
  [
    {
      table: [
        "insert-table",
        "insert-row-above",
        "insert-row-below",
        "insert-column-left",
        "insert-column-right",
        "delete-row",
        "delete-column",
        "delete-table",
        "merge-cells",
        "split-cell",
      ],
    },
  ],
];

const EditBlog = () => {
  const { id } = useParams();
  const editorRef = useRef(null);
  const quillRef = useRef(null);
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  console.log(categories);

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

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${IP}/api/v1/blog-category`);
      console.log(res);
      setCategories(res.data.data);
    } catch {
      message.error("Failed to load categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch blog data
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`${IP}/api/v1/blogs/${id}`);
        const blog = res.data;
        setFormData({
          title: blog.title,
          category: blog.category._id, // ✅ Use the ID
          tags: blog.tags || [],
          metaDescription: blog.metaDescription || "",
          isDraft: blog.isDraft || false,
          existingPreviewImage: blog.previewImage || null,
        });

        const interval = setInterval(() => {
          if (quillRef.current) {
            clearInterval(interval);
            if (blog.content) {
              quillRef.current.root.innerHTML = blog.content;

              const tempEl = document.createElement("div");
              tempEl.innerHTML = blog.content;
              const imgElements = tempEl.getElementsByTagName("img");
              const imgs = Array.from(imgElements).map((img) => img.src);
              setExistingImages(imgs);
            }
          }
        }, 100);
      } catch (err) {
        console.error(err);
        message.error("Failed to load blog post");
        navigate("/blogs");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id, navigate]);

  // Initialize Quill
  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        modules: {
          toolbar: {
            container: toolbarOptions,
            handlers: {
              image: imageHandler,
              table: function () {
                // Show a dialog to get table dimensions
                const rows = prompt("Enter number of rows:", "3");
                const cols = prompt("Enter number of columns:", "3");

                if (rows && cols) {
                  this.quill
                    .getModule("better-table")
                    .insertTable(parseInt(rows), parseInt(cols));
                }
              },
            },
          },
          imageResize: {
            displaySize: true,
          },
          "better-table": {
            operationMenu: {
              items: {
                insertRowAbove: { text: "Insert Row Above" },
                insertRowBelow: { text: "Insert Row Below" },
                insertColumnLeft: { text: "Insert Column Left" },
                insertColumnRight: { text: "Insert Column Right" },
                mergeCells: { text: "Merge cells" },
                splitCell: { text: "Split cell" },
                deleteRow: { text: "Delete Row" },
                deleteColumn: { text: "Delete Column" },
                deleteTable: { text: "Delete Table" },
              },
              color: {
                colors: [
                  "#000000",
                  "#e60000",
                  "#ff9900",
                  "#ffff00",
                  "#008a00",
                  "#0066cc",
                  "#9933ff",
                  "#ffffff",
                  "#facccc",
                  "#ffebcc",
                  "#ffffcc",
                  "#cce8cc",
                  "#cce0f5",
                  "#ebd6ff",
                  "#bbbbbb",
                  "#f06666",
                  "#ffc266",
                  "#ffff66",
                  "#66b966",
                  "#66a3e0",
                  "#c285ff",
                  "#888888",
                  "#a10000",
                  "#b26b00",
                  "#b2b200",
                  "#006100",
                  "#0047b2",
                  "#6b24b2",
                  "#444444",
                  "#5c0000",
                  "#663d00",
                  "#666600",
                  "#003700",
                  "#002966",
                  "#3d1466",
                ],
                text: "Background Color",
              },
            },
          },
        },
      });
      quillRef.current.keyboard.addBinding({
        key: "Tab",
        shiftKey: false,
        handler: function (range, context) {
          const tableModule = quillRef.current.getModule("better-table");
          if (tableModule) {
            tableModule.keyboardNavigation("next");
            return false;
          }
          return true;
        },
      });

      quillRef.current.keyboard.addBinding({
        key: "Tab",
        shiftKey: true,
        handler: function (range, context) {
          const tableModule = quillRef.current.getModule("better-table");
          if (tableModule) {
            tableModule.keyboardNavigation("previous");
            return false;
          }
          return true;
        },
      });
    }
  }, [editorRef.current]);

  // Add these utility functions to your component
  const exportTableData = () => {
    const tableModule = quillRef.current.getModule("better-table");
    if (tableModule) {
      const tableData = tableModule.exportTableData();
      console.log(tableData); // Or process it further
      message.info("Table data exported to console");
    }
  };

  const importTableData = (data) => {
    const tableModule = quillRef.current.getModule("better-table");
    if (tableModule) {
      tableModule.importTableData(data);
    }
  };

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
    setFormData({
      ...formData,
      tags: value,
    });
  };

  const uploadImage = async (file) => {
    const form = new FormData();
    form.append("image", file);

    const res = await axios.post(`${IP}/api/v1/blogs/upload-image`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data.imageUrl;
  };

  const handleSubmit = async () => {
    if (!formData.title || !quillRef.current) {
      message.error("Title and content are required");
      return;
    }

    setIsSubmitting(true);
    try {
      const data = new FormData();

      data.append("title", formData.title);
      data.append("category", formData.category);
      data.append("tags", JSON.stringify(formData.tags || []));
      data.append("metaDescription", formData.metaDescription || "");
      data.append("isDraft", formData.isDraft ? "true" : "false");

      if (formData.previewImage?.file) {
        data.append("previewImage", formData.previewImage.file);
      } else if (formData.existingPreviewImage === null) {
        data.append("previewImageUrl", "");
      } else if (formData.existingPreviewImage) {
        data.append("previewImageUrl", formData.existingPreviewImage);
      }

      let contentHTML = quillRef.current.root.innerHTML;

      const imageUploadPromises = localImages.map(async (img) => {
        try {
          const imageUrl = await uploadImage(img.file);
          const escapedBlobUrl = escapeRegExp(img.blobUrl);
          contentHTML = contentHTML.replace(
            new RegExp(escapedBlobUrl, "g"),
            imageUrl
          );
        } catch (err) {
          console.error("Image upload error:", err);
        }
      });

      await Promise.all(imageUploadPromises);
      data.append("content", contentHTML);

      const res = await axios.put(`${IP}/api/v1/blogs/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      message.success(
        formData.isDraft
          ? "Draft updated successfully!"
          : "Blog updated successfully!"
      );
      navigate(`/blogs/${res.data.slug}`);
    } catch (err) {
      console.error("Submit error:", err);
      message.error(
        err?.response?.data?.message ||
          "Something went wrong. Please try again later."
      );
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
          {formData.existingPreviewImage && !formData.previewImage && (
            <div className="mb-4">
              <img
                src={formData.existingPreviewImage}
                alt="Preview"
                className="max-h-48 mb-2"
              />
              <Button danger onClick={handleRemovePreviewImage}>
                Remove Image
              </Button>
            </div>
          )}
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
          <Select placeholder="Select a category">
            {categories.map((cat) => (
              <Select.Option key={cat._id} value={cat._id}>
                {cat.name}
              </Select.Option>
            ))}
          </Select>
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
