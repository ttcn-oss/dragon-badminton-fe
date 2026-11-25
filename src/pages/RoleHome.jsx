import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { AREAS } from "../config/menus";
import Logo from "../components/Logo";
import "../auth.css";
import "../dashboard.css";

export default function RoleHome({ area }) {
  const { user, logout } = useAuth();
  const { title, menu } = AREAS[area] || AREAS.customer;
  const [selectedMenu, setSelectedMenu] = useState(menu[0]);

  return (
    <div className="dash">
      <aside className="dash-side">
        <div className="dash-logo">
          <Logo />
        </div>
        <nav>
          {menu.map((item) => (
            <div
              className={`dash-item ${selectedMenu === item ? "dash-item--active" : ""}`}
              key={item}
              onClick={() => setSelectedMenu(item)}
            >
              {item}
            </div>
          ))}
        </nav>
      </aside>

      <main className="dash-main">
        <header className="dash-header">
          <span>
            {user?.name} · <b>{title}</b>
          </span>
          <button type="button" onClick={logout}>
            Đăng xuất
          </button>
        </header>
        <div className="dash-body">
          <h1>{selectedMenu}</h1>
          <p>
            Vai trò: <b>{title}</b> ({user?.role}) — Màn hình đang xây dựng.
          </p>
        </div>
      </main>
    </div>
  );
}