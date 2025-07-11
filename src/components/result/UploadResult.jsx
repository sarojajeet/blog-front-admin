// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   Form,
//   Input,
//   InputNumber,
//   Button,
//   Select,
//   Upload,
//   message,
//   Card,
// } from "antd";
// import { UploadOutlined } from "@ant-design/icons";
// import { IP } from "../../utils/Constent";

// const { Option } = Select;

// const UploadResult = () => {
//   const [categories, setCategories] = useState([]);
//   const [fileList, setFileList] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const [form] = Form.useForm(); // ✅ AntD form instance

//   useEffect(() => {
//     // Fetch categories on mount
//     const fetchCategories = async () => {
//       try {
//         const res = await axios.get(`${IP}/api/v1/result-categories`);
//         setCategories(res.data);
//       } catch (err) {
//         console.error(err);
//         message.error("Failed to load categories.");
//       }
//     };

//     fetchCategories();
//   }, []);

//   const onFinish = async (values) => {
//     const data = new FormData();
//     Object.entries(values).forEach(([key, value]) => {
//       data.append(key, value);
//     });
//     if (fileList.length) {
//       data.append("image", fileList[0].originFileObj);
//     }

//     try {
//       setLoading(true);
//       await axios.post(`${IP}/api/v1/results`, data, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       message.success("✅ Result uploaded successfully!");

//       // ✅ Reset form fields
//       form.resetFields();
//       setFileList([]);
//     } catch (err) {
//       console.error(err);
//       message.error("❌ Failed to upload result.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-2xl mx-auto p-6">
//       <Card title="Upload Result" bordered>
//         <Form form={form} layout="vertical" onFinish={onFinish}>
//           <Form.Item
//             label="Year"
//             name="year"
//             rules={[{ required: true, message: "Please enter year" }]}
//           >
//             <InputNumber className="w-full" placeholder="e.g. 2024" />
//           </Form.Item>

//           <Form.Item
//             label="State"
//             name="state"
//             rules={[{ required: true, message: "Please enter state" }]}
//           >
//             <Input placeholder="State name" />
//           </Form.Item>

//           <Form.Item
//             label="Rank"
//             name="rank"
//             rules={[{ required: true, message: "Please enter rank" }]}
//           >
//             <InputNumber className="w-full" placeholder="Rank" />
//           </Form.Item>

//           <Form.Item
//             label="Roll No"
//             name="rollNo"
//             rules={[{ required: true, message: "Please enter roll number" }]}
//           >
//             <Input placeholder="Roll No" />
//           </Form.Item>

//           <Form.Item
//             label="Marks"
//             name="marks"
//             rules={[{ required: true, message: "Please enter marks" }]}
//           >
//             <InputNumber className="w-full" placeholder="Marks" />
//           </Form.Item>

//           <Form.Item
//             label="Roll Code"
//             name="rollCode"
//             rules={[{ required: true, message: "Please enter roll code" }]}
//           >
//             <Input placeholder="Roll Code" />
//           </Form.Item>

//           <Form.Item
//             label="District"
//             name="district"
//             rules={[{ required: true, message: "Please enter district" }]}
//           >
//             <Input placeholder="District" />
//           </Form.Item>

//           <Form.Item
//             label="Category"
//             name="category"
//             rules={[{ required: true, message: "Please select category" }]}
//           >
//             <Select placeholder="Select a category">
//               {categories.map((cat) => (
//                 <Option key={cat._id} value={cat._id}>
//                   {cat.name}
//                 </Option>
//               ))}
//             </Select>
//           </Form.Item>

//           <Form.Item
//             label="Image"
//             rules={[{ required: true, message: "Please upload an image" }]}
//           >
//             <Upload
//               beforeUpload={() => false}
//               fileList={fileList}
//               onChange={({ fileList }) => setFileList(fileList)}
//               accept="image/*"
//               maxCount={1}
//             >
//               <Button icon={<UploadOutlined />}>Select Image</Button>
//             </Upload>
//           </Form.Item>

//           <Form.Item>
//             <Button
//               type="primary"
//               htmlType="submit"
//               loading={loading}
//               className="w-full"
//             >
//               Upload Result
//             </Button>
//           </Form.Item>
//         </Form>
//       </Card>
//     </div>
//   );
// };

// export default UploadResult;
import React, { useEffect, useState, useRef } from "react";
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
  Divider,
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

const UploadResult = () => {
  const [categories, setCategories] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const quillRef = useRef(null);
  const editorRef = useRef(null);

  useEffect(() => {
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

  useEffect(() => {
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
    const data = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value) {
        data.append(key, value);
      }
    });

    if (fileList.length) {
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
      await axios.post(`${IP}/api/v1/results`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      message.success("✅ Result uploaded!");
      form.resetFields();
      setFileList([]);
      quillRef.current.root.innerHTML = "";
    } catch (err) {
      console.error(err);
      message.error("❌ Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card title="Upload Result" bordered>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          {/* Fields same as before */}
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
              Upload Result (and Blog)
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default UploadResult;
