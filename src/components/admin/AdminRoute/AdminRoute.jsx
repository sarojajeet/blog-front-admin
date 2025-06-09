import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Layout from "../adminLayout/Layout";
import Dashboard from "../../dashboard/Dashbord";

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
        </Route>
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
