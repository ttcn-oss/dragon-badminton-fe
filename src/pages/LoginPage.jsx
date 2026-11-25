import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { homeByRole, useAuth } from "../context/AuthContext";
import { getErrors } from "../api/client";
import Logo from "../components/Logo";
import "../auth.css";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setFieldErrors({});
    setSubmitting(true);
    try {
      const user = await login(email, password);
      const from = location.state?.from?.pathname;
      navigate(from || homeByRole(user.role), { replace: true });
    } catch (err) {
      const { fields, message } = getErrors(err);
      setFieldErrors(fields);
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <Logo />
        <h1>Đăng nhập</h1>

        {error && <div className="auth-error">{error}</div>}

        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ban@example.com"
            required
            autoComplete="email"
          />
          {fieldErrors.email && <span className="field-error">{fieldErrors.email[0]}</span>}
        </label>

        <label>
          Mật khẩu
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Nhập mật khẩu"
            required
            autoComplete="current-password"
          />
          {fieldErrors.password && (
            <span className="field-error">{fieldErrors.password[0]}</span>
          )}
        </label>

        <button type="submit" disabled={submitting}>
          {submitting ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>

        <div className="auth-links">
          <Link to="/forgot-password">Quên mật khẩu?</Link>
          <span>
            Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
          </span>
        </div>
      </form>
    </div>
  );
}