import React, { useState, useEffect } from "react";
import {
  Table,
  Card,
  Rate,
  Image,
  Button,
  Space,
  Select,
  Spin,
  message,
} from "antd";
import { EyeOutlined, EditOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { IP } from "../../utils/Constent";

const { Option } = Select;

const TeacherList = () => {
  const [teachers, setTeachers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterCategory, setFilterCategory] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
    fetchTeachers();
  }, [filterCategory]);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${IP}/api/v1/teacher-categories`);
      setCategories(res.data);
    } catch (err) {
      message.error("Failed to load categories");
    }
  };

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const url = `${IP}/api/v1/get-teachers${
        filterCategory ? `?category=${filterCategory}` : ""
      }`;
      const res = await axios.get(url);
      setTeachers(res.data);
    } catch (err) {
      message.error("Failed to load teachers");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Photo",
      dataIndex: "photo",
      key: "photo",
      render: (photo) => (
        <Image
          src={photo}
          width={50}
          height={50}
          style={{ borderRadius: "50%", objectFit: "cover" }}
          preview={false}
        />
      ),
    },
    {
      title: "Subject",
      dataIndex: "subject",
      key: "subject",
      sorter: (a, b) => a.subject.localeCompare(b.subject),
    },
    {
      title: "Rating",
      dataIndex: "star",
      key: "star",
      render: (star) => <Rate disabled defaultValue={star} />,
      sorter: (a, b) => a.star - b.star,
    },
    {
      title: "Experience (years)",
      dataIndex: "experience",
      key: "experience",
      sorter: (a, b) => a.experience - b.experience,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/admin/teachers/${record._id}`)}
          >
            View
          </Button>
          <Button
            type="default"
            icon={<EditOutlined />}
            onClick={() => navigate(`/admin/teachers/edit/${record._id}`)}
          >
            Edit
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title="Teachers List"
      extra={
        <Select
          placeholder="Filter by category"
          style={{ width: 200 }}
          onChange={setFilterCategory}
          allowClear
        >
          {categories.map((cat) => (
            <Option key={cat._id} value={cat._id}>
              {cat.name}
            </Option>
          ))}
        </Select>
      }
    >
      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={teachers}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
        />
      </Spin>
    </Card>
  );
};

export default TeacherList;
