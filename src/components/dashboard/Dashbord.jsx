import React from "react";
import {
  FaRegNewspaper,
  FaEdit,
  FaCheck,
  FaTags,
  FaUsers,
  FaComments,
  FaFolderOpen,
} from "react-icons/fa";

const Dashboard = () => {
  const stats = [
    {
      title: "Total Posts",
      count: 128,
      icon: <FaRegNewspaper className="text-blue-500 text-4xl" />,
    },
    {
      title: "Drafts",
      count: 24,
      icon: <FaEdit className="text-gray-500 text-4xl" />,
    },
    {
      title: "Published",
      count: 96,
      icon: <FaCheck className="text-green-500 text-4xl" />,
    },
    {
      title: "Categories",
      count: 12,
      icon: <FaFolderOpen className="text-orange-500 text-4xl" />,
    },
    {
      title: "Tags",
      count: 34,
      icon: <FaTags className="text-purple-500 text-4xl" />,
    },
    {
      title: "Authors",
      count: 5,
      icon: <FaUsers className="text-indigo-500 text-4xl" />,
    },
    {
      title: "Comments",
      count: 203,
      icon: <FaComments className="text-red-500 text-4xl" />,
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Blog Dashboard Overview</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white shadow-md border rounded-xl p-6 flex items-center space-x-4"
          >
            {stat.icon}
            <div>
              <h2 className="text-lg font-semibold">{stat.title}</h2>
              <p className="text-2xl font-bold">{stat.count}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
