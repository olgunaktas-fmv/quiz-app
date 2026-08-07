import { useState } from "react";
import { login } from "../../db/auth";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await login(username, password);
    } catch {
      setError("Giriş başarısız. Kullanıcı adı veya şifre hatalı.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="screen auth-screen">
      <div className="auth-card">
        <h1>Admin Girişi</h1>
        <p className="muted">Yönetici hesabınızla giriş yapın</p>
        <form onSubmit={handleSubmit}>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Kullanıcı adı"
            autoFocus
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Şifre"
          />
          {error && <p className="error-text">{error}</p>}
          <button
            type="submit"
            disabled={!username.trim() || !password || busy}
          >
            {busy ? "Giriş yapılıyor..." : "Giriş Yap"}
          </button>
        </form>
        <p className="hint">
          Admin hesabı Firebase Console'da admin@quiz-app.local olarak
          oluşturulmuş olmalı.
        </p>
      </div>
    </div>
  );
}
