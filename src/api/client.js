import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
  headers: { Accept: "application/json" },
});

// Tự gắn token vào mọi request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Lấy lỗi từ Laravel (422: { message, errors: { field: [..] } })
export function getErrors(err) {
  const data = err.response?.data;
  return {
    fields: data?.errors || {},
    message: data?.message || "Không kết nối được máy chủ, thử lại sau.",
  };
}

export default api;
