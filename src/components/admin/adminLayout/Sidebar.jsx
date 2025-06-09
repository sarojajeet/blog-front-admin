import React, { useState } from "react";
import { Menu, Drawer, Button } from "antd";
import { AppstoreOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import "./Sidebar.css";
import { BiCategory } from "react-icons/bi";

const Sidebar = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [openKeys, setOpenKeys] = useState([]);

  const showDrawer = () => setDrawerVisible(true);
  const onClose = () => setDrawerVisible(false);

  const handleSubMenuChange = (keys) => {
    const latestOpenKey = keys.find((key) => !openKeys.includes(key));
    setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
  };

  const menuItemsArray = [
    {
      key: "/admin/dashboard",
      icon: <AppstoreOutlined />,
      label: (
        <Link to="/admin/dashboard" onClick={onClose}>
          Dashboard
        </Link>
      ),
    },
    {
      key: "/admin/category",
      icon: <BiCategory />,
      label: (
        <Link to="/admin/category" onClick={onClose}>
          Category
        </Link>
      ),
    },
    {
      key: "/admin/category",
      icon: <BiCategory />,
      label: (
        <Link to="/admin/editor" onClick={onClose}>
          Editor
        </Link>
      ),
    },
  ];

  return (
    <>
      {/* Drawer Button for Mobile */}
      <Button
        className="sidebar-toggle text-xl relative top-0 h-10 w-10"
        onClick={showDrawer}
      >
        <AppstoreOutlined className="relative top-0 left-0 text-2xl" />
      </Button>

      {/* Drawer for Mobile */}
      <Drawer
        title="OZONE"
        placement="left"
        closable
        onClose={onClose}
        open={drawerVisible}
      >
        <Menu
          className="w-full"
          mode="inline"
          openKeys={openKeys}
          onOpenChange={handleSubMenuChange}
          items={menuItemsArray}
        />
      </Drawer>

      {/* Sidebar for Desktop */}
      <div className="sidebar-desktop overflow-x-scroll h-screen">
        <Menu
          className="w-full"
          mode="inline"
          openKeys={openKeys}
          onOpenChange={handleSubMenuChange}
          items={menuItemsArray}
        />
      </div>
    </>
  );
};

export default Sidebar;
