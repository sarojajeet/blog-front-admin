import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Tag, Image, message, Card } from "antd";
import { IP } from "../../utils/Constent";

const ResultList = () => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await axios.get(`${IP}/api/v1/results`);
        setResults(res.data);
        console.log(res.data);
      } catch (err) {
        console.error(err);
        message.error("Failed to fetch results.");
      }
    };

    fetchResults();
  }, []);

  const columns = [
    {
      title: "Year",
      dataIndex: "year",
      key: "year",
    },
    {
      title: "State",
      dataIndex: "state",
      key: "state",
    },
    {
      title: "Rank",
      dataIndex: "rank",
      key: "rank",
    },
    {
      title: "Roll No",
      dataIndex: "rollNo",
      key: "rollNo",
    },
    {
      title: "Marks",
      dataIndex: "marks",
      key: "marks",
    },
    {
      title: "Roll Code",
      dataIndex: "rollCode",
      key: "rollCode",
    },
    {
      title: "District",
      dataIndex: "district",
      key: "district",
    },
    {
      title: "Category",
      dataIndex: ["category", "name"], // nested because of populate
      key: "category",
      render: (name) => <Tag color="blue">{name}</Tag>,
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (url) => (
        <Image width={60} src={url} alt="Result" placeholder={true} />
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      <Card title="All Results">
        <Table
          dataSource={results.map((r) => ({ ...r, key: r._id }))}
          columns={columns}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};

export default ResultList;
