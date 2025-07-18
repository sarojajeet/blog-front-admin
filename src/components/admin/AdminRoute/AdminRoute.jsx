import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Layout from "../adminLayout/Layout";
import Dashboard from "../../dashboard/Dashbord";
import CategoryManager from "../../category/CategoryManager";
// import BlogEditor from "../../BlogEditor/BlogEditor";
import SubcategoryPage from "../../subcategory/SubcategoryPage";
import BannerManager from "../../banner/BannerManager";
import TextEditor from "../../BlogEditor/TextEditor";
import CategoryManagement from "../../blogCategory/CategoryManagement";
import BlogManagement from "../../BlogEditor/BlogManagement";
import BlogDetail from "../../BlogEditor/BlogDetail";
import EditBlog from "../../BlogEditor/EditBlog";
import CreateStudyMaterialForm from "../../studyMaterial/CreateStudyMaterialForm";
import StudyMaterialListPage from "../../studyMaterial/StudyMaterialListPage";
import CreateCarousel from "../../crousel/CreateCarousel";
import UploadResult from "../../result/UploadResult";
import ResultCategoryManager from "../../resultCategoryManager/ResultCategoryManager";
import ResultList from "../../ResultList/ResultList";
import Header from "../../studyMaterial/StudyMaterialist/Header";
import CreateStudyMaterial from "../../studyMaterial/createStudyMaterial/CreateStudyMaterial";
import ResultDetails from "../../ResultList/ResultDetails";
import UpdateResult from "../../ResultList/UpdateResult";
import UploadTeacher from "../../teacherProfile/UploadTeacher";
import TeacherList from "../../teacherProfile/TeacherList";
import TeacherDetails from "../../teacherProfile/TeacherDetails";
import UpdateTeacher from "../../teacherProfile/UpdateTeacher";

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
          <Route path="blogs" element={<BlogManagement />} />
          <Route path="banner" element={<BannerManager />} />
          <Route path="blog-category" element={<CategoryManagement />} />
          <Route path="blogs/:slug" element={<BlogDetail />} />
          <Route path="/edit-blog/:id" element={<EditBlog />} />
          <Route path="/study-material" element={<CreateStudyMaterialForm />} />
          <Route path="/create-Carousel" element={<CreateCarousel />} />
          <Route path="/result-category" element={<ResultCategoryManager />} />
          <Route path="/upload-result" element={<UploadResult />} />
          <Route path="/result-list" element={<ResultList />} />
          <Route path="/material-list" element={<Header />} />
          <Route path="/create-list" element={<CreateStudyMaterial />} />
          <Route path="/results/:id" element={<ResultDetails />} />
          <Route path="/results/update/:id" element={<UpdateResult />} />
          <Route path="/teacher-upload" element={<UploadTeacher />} />
          <Route path="/teachers/list" element={<TeacherList />} />
          <Route path="/teachers/:id" element={<TeacherDetails />} />
          <Route path="/teachers/edit/:id" element={<UpdateTeacher />} />

          <Route
            path="/study-material-list"
            element={<StudyMaterialListPage />}
          />
        </Route>
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
