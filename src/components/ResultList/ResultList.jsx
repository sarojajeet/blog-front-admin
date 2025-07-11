// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Table, Tag, Image, message, Card } from "antd";
// import { IP } from "../../utils/Constent";

// const ResultList = () => {
//   const [results, setResults] = useState([]);

//   useEffect(() => {
//     const fetchResults = async () => {
//       try {
//         const res = await axios.get(`${IP}/api/v1/results`);
//         setResults(res.data);
//         console.log(res.data);
//       } catch (err) {
//         console.error(err);
//         message.error("Failed to fetch results.");
//       }
//     };

//     fetchResults();
//   }, []);

//   const columns = [
//     {
//       title: "Year",
//       dataIndex: "year",
//       key: "year",
//     },
//     {
//       title: "State",
//       dataIndex: "state",
//       key: "state",
//     },
//     {
//       title: "Rank",
//       dataIndex: "rank",
//       key: "rank",
//     },
//     {
//       title: "Roll No",
//       dataIndex: "rollNo",
//       key: "rollNo",
//     },
//     {
//       title: "Marks",
//       dataIndex: "marks",
//       key: "marks",
//     },
//     {
//       title: "Roll Code",
//       dataIndex: "rollCode",
//       key: "rollCode",
//     },
//     {
//       title: "District",
//       dataIndex: "district",
//       key: "district",
//     },
//     {
//       title: "Category",
//       dataIndex: ["category", "name"], // nested because of populate
//       key: "category",
//       render: (name) => <Tag color="blue">{name}</Tag>,
//     },
//     {
//       title: "Image",
//       dataIndex: "image",
//       key: "image",
//       render: (url) => (
//         <Image width={60} src={url} alt="Result" placeholder={true} />
//       ),
//     },
//   ];

//   return (
//     <div className="max-w-7xl mx-auto p-6">
//       <Card title="All Results">
//         <Table
//           dataSource={results.map((r) => ({ ...r, key: r._id }))}
//           columns={columns}
//           pagination={{ pageSize: 10 }}
//         />
//       </Card>
//     </div>
//   );
// };

// export default ResultList;
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Tag, Image, message, Card, Button, Popconfirm } from "antd";
import { IP } from "../../utils/Constent";
import { useNavigate } from "react-router-dom";
import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

const ResultList = () => {
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

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

  const deleteResult = () => {
    console.log("delete call");
  };
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
      dataIndex: ["category", "name"],
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
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/admin/results/${record._id}`)}
          >
            View
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => navigate(`/admin/results/update/${record._id}`)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this result?"
            onConfirm={() => deleteResult(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" icon={<DeleteOutlined />} danger>
              Delete
            </Button>
          </Popconfirm>
        </>
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
