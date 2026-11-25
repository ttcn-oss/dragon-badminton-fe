import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mở lại trang: nếu còn token thì hỏi server "tôi là ai"
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get("/me")
      .then((res) => setUser(res.data.user ?? res.data))
      .catch(() => localStorage.removeItem("token"))
      .finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    const { data } = await api.post("/login", { email, password });
    localStorage.setItem("token", data.token);
    setUser(data.user);
    return data.user;
  }

  // Nếu backend bắt xác thực email trước thì có thể không trả token
  async function register(form) {
    const { data } = await api.post("/register", form);
    if (data.token) {
      localStorage.setItem("token", data.token);
      setUser(data.user);
      return data.user;
    }
    return null;
  }

  async function logout() {
    try {
      await api.post("/logout");
    } catch {
      // bỏ qua, vẫn đăng xuất phía FE
    }
    localStorage.removeItem("token");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

// Mỗi vai trò vào trang nào sau khi đăng nhập
export function homeByRole(role) {
  switch (role) {
    case "admin":
    case "owner":
      return "/admin";
    case "staff":
      return "/staff";
    default:
      return "/user";
  }
}
