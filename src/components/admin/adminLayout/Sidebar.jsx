import React, { useState } from "react";
import { Menu, Drawer, Button } from "antd";
import { AppstoreOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import "./Sidebar.css";
import { BiCategory } from "react-icons/bi";
import { FaRegFileAlt } from "react-icons/fa";

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
      key: "/admin/subcategories",
      icon: <BiCategory />,
      label: (
        <Link to="/admin/subcategories" onClick={onClose}>
          Sub-Category
        </Link>
      ),
    },
    {
      key: "/admin/banner",
      icon: <BiCategory />,
      label: (
        <Link to="/admin/banner" onClick={onClose}>
          Banner
        </Link>
      ),
    },
    {
      key: "/admin/editor",
      icon: <BiCategory />,
      label: (
        <Link to="/admin/editor" onClick={onClose}>
          Editor
        </Link>
      ),
    },
    {
      key: "/admin/blogs",
      icon: <BiCategory />,
      label: (
        <Link to="/admin/blogs" onClick={onClose}>
          Blog List
        </Link>
      ),
    },
    {
      key: "/admin/blog-category",
      icon: <BiCategory />,
      label: (
        <Link to="/admin/blog-category" onClick={onClose}>
          Blog Category
        </Link>
      ),
    },

    {
      key: "studymaterials",
      icon: <FaRegFileAlt />,
      label: "Study Materials",
      children: [
        {
          key: "/admin/study-material",
          icon: <BiCategory />,
          label: (
            <Link to="/admin/study-material" onClick={onClose}>
              Add Study material
            </Link>
          ),
        },
        {
          key: "/admin/study-material-list",
          icon: <BiCategory />,
          label: (
            <Link to="/admin/study-material-list" onClick={onClose}>
              Study material List
            </Link>
          ),
        },
      ],
    },

    // {
    //   key: "/admin/material-list",
    //   icon: <BiCategory />,
    //   label: (
    //     <Link to="/admin/material-list" onClick={onClose}>
    //       List Material
    //     </Link>
    //   ),
    // },
    // {
    //   key: "/admin/create-list",
    //   icon: <BiCategory />,
    //   label: (
    //     <Link to="/admin/create-list" onClick={onClose}>
    //       Create list Material
    //     </Link>
    //   ),
    // },

    {
      key: "results",
      icon: <FaRegFileAlt />,
      label: "Result",
      children: [
        {
          key: "/admin/upload-result",
          label: (
            <Link to="/admin/upload-result" onClick={onClose}>
              Add Result
            </Link>
          ),
        },
        {
          key: "/admin/result-list",
          label: (
            <Link to="/admin/result-list" onClick={onClose}>
              Result List
            </Link>
          ),
        },
        {
          key: "/admin/result-category",

          label: (
            <Link to="/admin/result-category" onClick={onClose}>
              Result Category
            </Link>
          ),
        },
      ],
    },

    {
      key: "teachers",
      icon: <FaRegFileAlt />,
      label: "Teacher",
      children: [
        {
          key: "/admin/teacher-upload",
          label: (
            <Link to="/admin/teacher-upload" onClick={onClose}>
              Add Teacher
            </Link>
          ),
        },
        {
          key: "/admin/teachers/list",
          label: (
            <Link to="/admin/teachers/list" onClick={onClose}>
              Teachers List
            </Link>
          ),
        },
      ],
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
