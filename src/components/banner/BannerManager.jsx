// // src/components/BannerManager.jsx

// import React, { useEffect, useState } from "react";
// import { Table, Button, Modal, Upload, Input, message, Popconfirm } from "antd";
// import {
//   UploadOutlined,
//   PlusOutlined,
//   DeleteOutlined,
// } from "@ant-design/icons";
// import axios from "axios";
// import { IP } from "../../utils/Constent";

// const BannerManager = () => {
//   const [banners, setBanners] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [uploadModalVisible, setUploadModalVisible] = useState(false);
//   const [file, setFile] = useState(null);
//   const [title, setTitle] = useState("");

//   const fetchBanners = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get(`${IP}/api/v1/banners`);
//       setBanners(res.data);
//     } catch (err) {
//       message.error("Failed to fetch banners");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleUpload = async () => {
//     if (!file) {
//       message.warning("Please select a banner image");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("banner", file);
//     formData.append("title", title);

//     try {
//       await axios.post(`${IP}/api/v1/banners`, formData);
//       message.success("Banner uploaded");
//       fetchBanners();
//       setUploadModalVisible(false);
//       setFile(null);
//       setTitle("");
//     } catch (err) {
//       message.error("Upload failed");
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       await axios.delete(`${IP}/api/v1/banners/${id}`);
//       message.success("Banner deleted");
//       fetchBanners();
//     } catch (err) {
//       message.error("Delete failed");
//     }
//   };

//   useEffect(() => {
//     fetchBanners();
//   }, []);

//   const columns = [
//     {
//       title: "Preview",
//       dataIndex: "imageUrl",
//       render: (url) => (
//         <img
//           src={url}
//           alt="banner"
//           className="w-40 h-20 object-cover rounded"
//         />
//       ),
//     },
//     {
//       title: "Title",
//       dataIndex: "title",
//       render: (text) => text || <i className="text-gray-400">No title</i>,
//     },
//     {
//       title: "Actions",
//       render: (_, record) => (
//         <Popconfirm
//           title="Delete banner?"
//           onConfirm={() => handleDelete(record._id)}
//           okText="Yes"
//           cancelText="No"
//         >
//           <Button danger icon={<DeleteOutlined />} />
//         </Popconfirm>
//       ),
//     },
//   ];

//   return (
//     <div className="p-6 bg-white rounded shadow">
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-xl font-semibold">Banner Management</h1>
//         <Button
//           icon={<PlusOutlined />}
//           type="primary"
//           onClick={() => setUploadModalVisible(true)}
//         >
//           Upload Banner
//         </Button>
//       </div>

//       <Table
//         rowKey="_id"
//         columns={columns}
//         dataSource={banners}
//         loading={loading}
//         pagination={false}
//       />

//       <Modal
//         open={uploadModalVisible}
//         title="Upload New Banner"
//         onCancel={() => setUploadModalVisible(false)}
//         onOk={handleUpload}
//         okText="Upload"
//         destroyOnClose
//       >
//         <div className="space-y-4">
//           <Input
//             placeholder="Title (optional)"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//           />

//           <Upload
//             beforeUpload={(file) => {
//               setFile(file);
//               return false;
//             }}
//             maxCount={1}
//           >
//             <Button icon={<UploadOutlined />}>Select Image</Button>
//           </Upload>

//           {file && (
//             <div className="text-sm text-gray-600">
//               Selected: <strong>{file.name}</strong>
//             </div>
//           )}
//         </div>
//       </Modal>
//     </div>
//   );
// };

// export default BannerManager;
import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Upload, Input, message, Popconfirm } from "antd";
import {
  UploadOutlined,
  PlusOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { IP } from "../../utils/Constent";

const BannerManager = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [editingBanner, setEditingBanner] = useState(null);

  // Fetch banners on component mount
  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${IP}/api/v1/banners`);
      setBanners(res.data);
    } catch (err) {
      message.error("Failed to fetch banners");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setTitle("");
    setDescription("");
    setUrl("");
    setEditingBanner(null);
  };

  const handleUpload = async () => {
    if (!file && !editingBanner) {
      message.warning("Please select a banner image");
      return;
    }

    const formData = new FormData();
    if (file) formData.append("banner", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("url", url);

    try {
      if (editingBanner) {
        await axios.put(`${IP}/api/v1/banners/${editingBanner._id}`, formData);
        message.success("Banner updated");
      } else {
        await axios.post(`${IP}/api/v1/banners`, formData);
        message.success("Banner uploaded");
      }
      fetchBanners();
      setUploadModalVisible(false);
      resetForm();
    } catch (err) {
      console.error(err);
      message.error("Upload failed");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${IP}/api/v1/banners/${id}`);
      message.success("Banner deleted");
      fetchBanners();
    } catch (err) {
      message.error("Delete failed");
    }
  };

  const startEditing = (banner) => {
    setEditingBanner(banner);
    setTitle(banner.title || "");
    setDescription(banner.description || "");
    setUrl(banner.url || "");
    setFile(null);
    setUploadModalVisible(true);
  };

  const columns = [
    {
      title: "Preview",
      dataIndex: "imageUrl",
      render: (url) => (
        <img
          src={url}
          alt="banner"
          className="w-40 h-20 object-cover rounded"
        />
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      render: (text) => text || <i className="text-gray-400">No title</i>,
    },
    {
      title: "Description",
      dataIndex: "description",
      render: (text) => text || <i className="text-gray-400">No description</i>,
    },
    {
      title: "URL",
      dataIndex: "url",
      render: (text) =>
        text ? (
          <a href={text} target="_blank" rel="noopener noreferrer">
            {text}
          </a>
        ) : (
          <i className="text-gray-400">No URL</i>
        ),
    },
    {
      title: "Actions",
      render: (_, record) => (
        <div className="flex gap-2">
          <Button type="primary" onClick={() => startEditing(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Delete banner?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 bg-white rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Banner Management</h1>
        <Button
          icon={<PlusOutlined />}
          type="primary"
          onClick={() => {
            resetForm();
            setUploadModalVisible(true);
          }}
        >
          Upload Banner
        </Button>
      </div>

      <Table
        rowKey="_id"
        columns={columns}
        dataSource={banners}
        loading={loading}
        pagination={false}
      />

      <Modal
        open={uploadModalVisible}
        title={editingBanner ? "Edit Banner" : "Upload New Banner"}
        onCancel={() => {
          setUploadModalVisible(false);
          resetForm();
        }}
        onOk={handleUpload}
        okText={editingBanner ? "Update" : "Upload"}
        destroyOnClose
      >
        <div className="space-y-4">
          <Input
            placeholder="Title (optional)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Input.TextArea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
          <Input
            placeholder="URL (optional)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <Upload
            beforeUpload={(file) => {
              setFile(file);
              return false;
            }}
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>
              {file || editingBanner ? "Change Image" : "Select Image"}
            </Button>
          </Upload>
          {(file || editingBanner?.imageUrl) && (
            <div className="text-sm text-gray-600">
              Preview:{" "}
              <img
                src={file ? URL.createObjectURL(file) : editingBanner.imageUrl}
                alt="preview"
                className="w-full max-w-xs h-24 object-cover mt-2 rounded"
              />
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default BannerManager;
