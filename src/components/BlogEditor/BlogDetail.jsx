import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { IP } from "../../utils/Constent";
import { Button, Spin, Tag, Divider, Typography, Image } from "antd";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const { Title, Paragraph, Text } = Typography;

const BlogDetail = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`${IP}/api/v1/blogs-byslug/${slug}`);
        setBlog(response.data);
      } catch (err) {
        setError("Failed to fetch blog post");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-red-500">{error}</div>
        <Button type="primary" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Title level={3}>Blog post not found</Title>
        <Button type="primary" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md mt-6 mb-10">
      <Button type="link" onClick={() => navigate(-1)}>
        ← Back to Blogs
      </Button>

      <div className="mt-4">
        <Tag color={blog.isDraft ? "orange" : "green"}>
          {blog.isDraft ? "Draft" : "Published"}
        </Tag>
        <Text type="secondary" className="ml-2">
          {moment(blog.createdAt).format("MMMM Do, YYYY")}
        </Text>
      </div>

      <Title level={1} className="mt-4">
        {blog.title}
      </Title>

      {blog.featuredImage && (
        <Image
          src={blog.featuredImage}
          alt={blog.title}
          className="rounded-lg mb-6"
          style={{ maxHeight: "400px", objectFit: "cover" }}
        />
      )}

      <div className="mb-6">
        <Tag color="blue">{blog.category.name}</Tag>
        {blog.tags.map((tag) => (
          <Tag key={tag}>{tag}</Tag>
        ))}
      </div>

      <Divider />

      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />

      <Divider />

      <div className="flex justify-between mt-6">
        <Button onClick={() => navigate(-1)}>Back to Blogs</Button>
        <Button
          type="primary"
          onClick={() => navigate(`/edit-blog/${blog._id}`)}
        >
          Edit Blog
        </Button>
      </div>
    </div>
  );
};

export default BlogDetail;
