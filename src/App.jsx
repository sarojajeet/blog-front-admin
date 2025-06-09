import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/landing/landingPage/Login";
import AdminRoutes from "./components/admin/AdminRoute/AdminRoute";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/admin/*" element={<AdminRoutes />} />
      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
    </Routes>
  );
}

export default App;
