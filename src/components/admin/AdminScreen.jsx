import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { logout } from "../../db/auth";
import AdminLogin from "./AdminLogin";
import ContestControl from "./ContestControl";
import QuestionPool from "./QuestionPool";
import Results from "./Results";

const TABS = [
  { id: "contests", label: "Yarışmalar" },
  { id: "pool", label: "Soru Havuzu" },
  { id: "reports", label: "Raporlar" },
];

export default function AdminScreen() {
  const { user, username, isAdmin, loading } = useAuth();
  const [tab, setTab] = useState("contests");

  if (loading) {
    return (
      <div className="screen loading-screen">
        <div className="spinner" />
        <h2>Yükleniyor...</h2>
      </div>
    );
  }

  if (!user) return <AdminLogin />;

  if (!isAdmin) {
    return (
      <div className="screen">
        <h2>Bu alana erişiminiz yok</h2>
        <p className="muted">
          "{username}" hesabı admin yetkisine sahip değil.
        </p>
        <button onClick={logout}>Çıkış Yap</button>
      </div>
    );
  }

  return (
    <div className="admin-screen">
      <header className="admin-header">
        <div className="admin-title-row">
          <h1>Quiz Yönetimi</h1>
          <span className="admin-user">
            {username}
            <button className="icon-btn" onClick={logout}>
              Çıkış
            </button>
          </span>
        </div>
        <nav className="admin-nav">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={tab === t.id ? "active" : ""}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="admin-main">
        {tab === "contests" && <ContestControl />}
        {tab === "pool" && <QuestionPool />}
        {tab === "reports" && <Results />}
      </main>
    </div>
  );
}
