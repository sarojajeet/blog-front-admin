import React, { useEffect, useState } from "react";
import { Table, Button, Popconfirm, message, Tag } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { IP } from "../../utils/Constent";

const BlogManagement = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${IP}/api/v1/blogs`);

      setBlogs(response.data);
    } catch (error) {
      message.error("Failed to fetch blogs");
    } finally {
      setLoading(false);
    }
  };

  const deleteBlog = async (id) => {
    try {
      await axios.delete(`${IP}/api/v1/delete-blog/${id}`);
      message.success("Blog deleted");
      fetchBlogs();
    } catch (error) {
      message.error("Delete failed");
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text, record) => (
        <a onClick={() => navigate(`/admin/blogs/${record.slug}`)}>{text}</a>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Tags",
      dataIndex: "tags",
      key: "tags",
      render: (tags) => (
        <>
          {tags.map((tag) => (
            <Tag color="blue" key={tag}>
              {tag}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: "Status",
      dataIndex: "isDraft",
      key: "isDraft",
      render: (isDraft) =>
        isDraft ? (
          <Tag color="orange">Draft</Tag>
        ) : (
          <Tag color="green">Published</Tag>
        ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button
            type="link"
            onClick={() => navigate(`/admin/edit-blog/${record._id}`)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this blog?"
            onConfirm={() => deleteBlog(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-xl shadow-md mt-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Blog Management</h2>
        <Button type="primary" onClick={() => navigate("/create-blog")}>
          New Blog
        </Button>
      </div>
      <Table
        dataSource={blogs}
        columns={columns}
        rowKey="_id"
        loading={loading}
      />
    </div>
  );
};

export default BlogManagement;
