import { useEffect, useState } from "react";
import { login, register } from "../../db/auth";
import { SESSION_GUARD_KEY } from "../../hooks/useSessionGuard";

export default function AuthScreen() {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState(
    () => sessionStorage.getItem(SESSION_GUARD_KEY) || ""
  );

  useEffect(() => {
    if (notice) sessionStorage.removeItem(SESSION_GUARD_KEY);
  }, [notice]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || password.length < 6) return;
    setBusy(true);
    setError("");
    try {
      if (mode === "register") await register(username.trim(), password);
      else await login(username.trim(), password);
    } catch {
      setError(
        mode === "register"
          ? "Kayıt başarısız. Bu kullanıcı adı alınmış olabilir."
          : "Giriş başarısız. Kullanıcı adı veya şifre hatalı."
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="screen auth-screen">
      <div className="auth-card">
        <h1>{mode === "register" ? "Kayıt Ol" : "Giriş Yap"}</h1>
        <div className="auth-tabs">
          <button
            className={mode === "login" ? "active" : ""}
            onClick={() => setMode("login")}
          >
            Giriş
          </button>
          <button
            className={mode === "register" ? "active" : ""}
            onClick={() => setMode("register")}
          >
            Kayıt
          </button>
        </div>
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
            placeholder="Şifre (en az 6 karakter)"
          />
          {error && <p className="error-text">{error}</p>}
          {notice && <p className="notice-text">{notice}</p>}
          <button
            type="submit"
            disabled={!username.trim() || password.length < 6 || busy}
          >
            {busy
              ? "..."
              : mode === "register"
              ? "Kayıt Ol"
              : "Giriş Yap"}
          </button>
        </form>
      </div>
    </div>
  );
}
