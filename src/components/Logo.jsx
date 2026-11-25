import { useState } from "react";

// Ảnh nằm ở public/images/logo.png. Chưa có ảnh thì hiện chữ thay thế.
export default function Logo() {
  const [failed, setFailed] = useState(false);

  return (
    <div className="auth-logo">
      {failed ? (
        <span className="auth-logo-text">Dragon Badminton</span>
      ) : (
        <img
          src="/images/logo.png"
          alt="Dragon Badminton"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}