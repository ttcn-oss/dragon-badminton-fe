import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { AuthProvider, homeByRole, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import RoleHome from "./pages/RoleHome";

function Home() {
  const { user, logout } = useAuth();
  return (
    <div style={{ padding: 24 }}>
      <h1>Dragon Badminton</h1>
      {user ? (
        <>
          <p>
            Xin chào {user.name} ({user.role})
          </p>
          <p>
            <Link to={homeByRole(user.role)}>Vào trang của tôi</Link>
          </p>
          <button type="button" onClick={logout}>
            Đăng xuất
          </button>
        </>
      ) : (
        <p>
          <Link to="/login">Đăng nhập</Link> | <Link to="/register">Đăng ký</Link>
        </p>
      )}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Khách hàng */}
          <Route element={<ProtectedRoute roles={["customer"]} />}>
            <Route path="/user" element={<RoleHome area="customer" />} />
          </Route>

          {/* Nhân viên và Admin (gộp chủ sân + admin) */}
          <Route element={<ProtectedRoute roles={["staff", "admin", "owner"]} />}>
            <Route path="/staff" element={<RoleHome area="staff" />} />
          </Route>

          {/* Admin (gộp chủ sân + admin) */}
          <Route element={<ProtectedRoute roles={["admin", "owner"]} />}>
            <Route path="/admin" element={<RoleHome area="admin" />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}