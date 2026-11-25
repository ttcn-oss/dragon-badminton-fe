// Ví dụ nối route. Đổi tên thành App.jsx (hoặc copy phần Routes vào App hiện có).
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

function Home() {
  const { user, logout } = useAuth();
  return (
    <div style={{ padding: 24 }}>
      <h1>Dragon Badminton</h1>
      {user ? (
        <>
          <p>Xin chào {user.name} ({user.role})</p>
          <button onClick={logout}>Đăng xuất</button>
        </>
      ) : (
        <a href="/login">Đăng nhập</a>
      )}
    </div>
  );
}

const Placeholder = ({ text }) => <div style={{ padding: 24 }}>{text}</div>;

export default function CourtsPage()  {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Chỉ khách */}
          <Route element={<ProtectedRoute roles={["customer"]} />}>
            <Route path="/my-bookings" element={<Placeholder text="Đơn của tôi" />} />
          </Route>

          {/* Nhân viên và chủ sân */}
          <Route element={<ProtectedRoute roles={["staff", "owner"]} />}>
            <Route path="/staff" element={<Placeholder text="Trang nhân viên" />} />
          </Route>

          <Route element={<ProtectedRoute roles={["owner"]} />}>
            <Route path="/owner" element={<Placeholder text="Trang chủ sân" />} />
          </Route>

          <Route element={<ProtectedRoute roles={["admin"]} />}>
            <Route path="/admin" element={<Placeholder text="Trang admin" />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
