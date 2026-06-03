import { Navigate, Route, Routes } from "react-router-dom";
import AdminRoute from "./components/AdminRoute";
import AdminPage from "./pages/AdminPage";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import SessionsPage from "./pages/SessionsPage";
import { useEffect } from "react";
import useAuthStore from "./store/useAuthStore";

function App() {

  const checkAuth = useAuthStore((state) => state.checkAuth);

useEffect(() => {
  checkAuth();
}, [checkAuth]);

  return (
    <div className="bg-fit-bg text-fit-text font-fit">
      <div className="mx-auto w-full max-w-6xl px-5 py-10">
        <Navbar />

        <Routes>
          <Route path="/" element={<SessionsPage />} />
          <Route path="/sessions" element={<SessionsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
          </Route>

         <Route element={<AdminRoute />}>
  <Route path="/admin" element={<AdminPage />} />
</Route>

          <Route path="*" element={<Navigate to="/sessions" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
