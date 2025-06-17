import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Layout from "../adminLayout/Layout";
import Dashboard from "../../dashboard/Dashbord";
import CategoryManager from "../../category/CategoryManager";
import BlogEditor from "../../BlogEditor/BlogEditor";
import SubcategoryPage from "../../subcategory/SubcategoryPage";
import BannerManager from "../../banner/BannerManager";
import TextEditor from "../../BlogEditor/TextEditor";
import CategoryManagement from "../../blogCategory/CategoryManagement";

const isAuthenticated = () => {
  const userID = localStorage.getItem("userID");

  const token = localStorage.getItem("token");
  return userID && token;
};

// Protected Route wrapper
const ProtectedRoute = ({ redirectPath = "/login" }) => {
  if (!isAuthenticated()) {
    return <Navigate to={redirectPath} replace />;
  }
  return <Outlet />;
};

const AdminRoutes = () => {
  return (
    <Routes>
      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="category" element={<CategoryManager />} />
          <Route path="subcategories" element={<SubcategoryPage />} />
          <Route path="editor" element={<TextEditor />} />
          <Route path="banner" element={<BannerManager />} />
          <Route path="blog-category" element={<CategoryManagement />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
