import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Descriptions, Rate, Image, Button, Spin, message } from "antd";
import { EditOutlined } from "@ant-design/icons";
import axios from "axios";
import { IP } from "../../utils/Constent";
import Quill from "quill";
import "quill/dist/quill.snow.css";

const TeacherDetails = () => {
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  const quillRef = useRef(null);
  const editorRef = useRef(null);

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const res = await axios.get(`${IP}/api/v1/teacher/${id}`);
        setTeacher(res.data);
      } catch (err) {
        message.error("Failed to load teacher details");
      } finally {
        setLoading(false);
      }
    };

    fetchTeacher();
  }, [id]);

  useEffect(() => {
    if (teacher && editorRef.current && !quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        readOnly: true,
        modules: {
          toolbar: false,
        },
      });
      quillRef.current.root.innerHTML = teacher.blogContent || "";
    }
  }, [teacher]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (!teacher) {
    return <div>Teacher not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card
        title="Teacher Details"
        extra={
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => navigate(`/teachers/edit/${id}`)}
          >
            Edit
          </Button>
        }
      >
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Photo">
            <Image
              src={teacher.photo}
              width={150}
              style={{ borderRadius: "8px" }}
            />
          </Descriptions.Item>
          <Descriptions.Item label="Subject">
            {teacher.subject}
          </Descriptions.Item>
          <Descriptions.Item label="Rating">
            <Rate disabled defaultValue={teacher.star} />
          </Descriptions.Item>
          <Descriptions.Item label="Experience">
            {teacher.experience} years
          </Descriptions.Item>
          {teacher.blogTitle && (
            <>
              <Descriptions.Item label="Blog Title">
                {teacher.blogTitle}
              </Descriptions.Item>
              <Descriptions.Item label="Blog Description">
                {teacher.blogShortMetaDescription}
              </Descriptions.Item>
              <Descriptions.Item label="Blog Content">
                <div ref={editorRef} className="ql-container ql-snow" />
              </Descriptions.Item>
            </>
          )}
        </Descriptions>
      </Card>
    </div>
  );
};

export default TeacherDetails;
