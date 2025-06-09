import React, { useState } from "react";
import {
  FaBox,
  FaList,
  FaShoppingCart,
  FaUser,
  FaImage,
  FaHeart,
} from "react-icons/fa";

const Dashboard = () => {
  const [data] = useState({
    categories: 12,
    products: 50,
    orders: 30,
    banners: 18,
    lowerBanners: 5,
    users: 20,
    orderStatuses: {
      pending: 4,
      confirmed: 6,
      shipped: 3,
      delivered: 10,
      cancelled: 1,
    },
  });

  const cards = [
    {
      title: "Categories",
      count: data.categories,
      icon: <FaList className="text-blue-500 text-4xl" />,
    },
    {
      title: "Templates",
      count: data.products,
      icon: <FaBox className="text-green-500 text-4xl" />,
    },
    {
      title: "Elemets/Shapes",
      count: data.banners,
      icon: <FaImage className="text-red-500 text-4xl" />,
    },
    {
      title: "Stickers",
      count: data.lowerBanners,
      icon: <FaHeart className="text-purple-500 text-4xl" />,
    },
    {
      title: "Fonts",
      count: data.users,
      icon: <FaUser className="text-indigo-500 text-4xl" />,
    },
    {
      title: "Images",
      count: data.orders,
      icon: <FaShoppingCart className="text-yellow-500 text-4xl" />,
    },
    {
      title: "Users",
      count: data.orderStatuses.pending,
      icon: <FaShoppingCart className="text-orange-400 text-4xl" />,
    },
    {
      title: "Projects",
      count: data.orderStatuses.confirmed,
      icon: <FaShoppingCart className="text-blue-400 text-4xl" />,
    },
  ];

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <div
            key={index}
            className="bg-white shadow-lg border rounded-xl p-6 flex items-center space-x-4"
          >
            {card.icon}
            <div>
              <h2 className="text-lg font-semibold capitalize ">
                {card.title}
              </h2>
              <p className="text-2xl font-bold">{card.count}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
