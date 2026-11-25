import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { homeByRole, useAuth } from "../context/AuthContext";
import { getErrors } from "../api/client";
import Logo from "../components/Logo";
import "../auth.css";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [needVerify, setNeedVerify] = useState(false);

  function update(field) {
    return (e) => setForm({ ...form, [field]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    // Kiểm tra nhanh phía FE (server vẫn phải kiểm tra lại)
    if (form.password.length < 8) {
      setFieldErrors({ password: ["Mật khẩu tối thiểu 8 ký tự."] });
      return;
    }
    if (form.password !== form.password_confirmation) {
      setFieldErrors({ password_confirmation: ["Mật khẩu nhập lại không khớp."] });
      return;
    }

    setSubmitting(true);
    try {
      const user = await register(form);
      if (user) navigate(homeByRole(user.role), { replace: true });
      else setNeedVerify(true); // backend yêu cầu xác thực email
    } catch (err) {
      const { fields, message } = getErrors(err);
      setFieldErrors(fields);
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  if (needVerify) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <Logo />
          <h1>Kiểm tra email của bạn</h1>
          <p className="auth-note">
            Mình đã gửi link xác thực tới <b>{form.email}</b>. Bấm vào link đó rồi quay lại{" "}
            <Link to="/login">đăng nhập</Link>.
          </p>
        </div>
      </div>
    );
  }

  const fieldError = (name) =>
    fieldErrors[name] && <span className="field-error">{fieldErrors[name][0]}</span>;

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <Logo />
        <h1>Đăng ký</h1>

        {error && <div className="auth-error">{error}</div>}

        <label>
          Họ và tên
          <input
            value={form.name}
            onChange={update("name")}
            placeholder="Nguyễn Văn A"
            required
            autoComplete="name"
          />
          {fieldError("name")}
        </label>

        <label>
          Email
          <input
            type="email"
            value={form.email}
            onChange={update("email")}
            placeholder="ban@example.com"
            required
            autoComplete="email"
          />
          {fieldError("email")}
        </label>

        <label>
          Mật khẩu
          <input
            type="password"
            value={form.password}
            onChange={update("password")}
            placeholder="Tối thiểu 8 ký tự"
            required
            autoComplete="new-password"
          />
          {fieldError("password")}
        </label>

        <label>
          Nhập lại mật khẩu
          <input
            type="password"
            value={form.password_confirmation}
            onChange={update("password_confirmation")}
            placeholder="Nhập lại mật khẩu"
            required
            autoComplete="new-password"
          />
          {fieldError("password_confirmation")}
        </label>

        <button type="submit" disabled={submitting}>
          {submitting ? "Đang tạo tài khoản..." : "Đăng ký"}
        </button>

        <div className="auth-links center">
          <span>
            Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
          </span>
        </div>
      </form>
    </div>
  );
}