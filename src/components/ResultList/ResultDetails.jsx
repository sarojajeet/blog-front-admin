import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Descriptions, Image, Button, Card, Tag, message } from "antd";
import { IP } from "../../utils/Constent";

const ResultDetails = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await axios.get(`${IP}/api/v1/result/${id}`);
        setResult(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        message.error("Failed to fetch result details.");
        setLoading(false);
      }
    };

    fetchResult();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!result) {
    return <div>Result not found</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <Card
        title="Result Details"
        extra={
          <Button type="primary" onClick={() => navigate(-1)}>
            Back to Results
          </Button>
        }
      >
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Year">{result.year}</Descriptions.Item>
          <Descriptions.Item label="State">{result.state}</Descriptions.Item>
          <Descriptions.Item label="Rank">{result.rank}</Descriptions.Item>
          <Descriptions.Item label="Roll No">{result.rollNo}</Descriptions.Item>
          <Descriptions.Item label="Marks">{result.marks}</Descriptions.Item>
          <Descriptions.Item label="Roll Code">
            {result.rollCode}
          </Descriptions.Item>
          <Descriptions.Item label="District">
            {result.district}
          </Descriptions.Item>
          <Descriptions.Item label="Category">
            <Tag color="blue">{result.category?.name}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Blog Title">
            {result.blogTitle}
          </Descriptions.Item>
          <Descriptions.Item label="Blog Description">
            {result.blogShortMetaDescription}
          </Descriptions.Item>
          <Descriptions.Item label="Blog Content">
            <div dangerouslySetInnerHTML={{ __html: result.blogContent }} />
          </Descriptions.Item>
          <Descriptions.Item label="Image">
            <Image width={200} src={result.image} alt="Result" />
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default ResultDetails;
