import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useContests } from "../../hooks/useContests";
import { logout } from "../../db/auth";
import ContestJoin from "./ContestJoin";
import ContestView from "./ContestView";

export default function ContestList() {
  const { username } = useAuth();
  const contests = useContests();
  const [selectedId, setSelectedId] = useState(null);
  const [joined, setJoined] = useState(false);

  const selected = contests.find((c) => c.id === selectedId) || null;
  const joinable = contests.filter(
    (c) => c.status === "open" || c.status === "live"
  );

  const handleBack = () => {
    setSelectedId(null);
    setJoined(false);
  };

  return (
    <div className="screen player-home">
      <header className="player-header">
        <h1>Quiz Arena</h1>
        <div className="player-user">
          <span>
            Oyuncu: <strong>{username}</strong>
          </span>
          <button
            className="new-player-btn"
            onClick={logout}
            title="Bu oturumu kapat ve yeni oyuncu olarak giriş yap"
          >
            Yeni Oyuncu
          </button>
        </div>
      </header>

      {!selectedId && (
        <div className="contest-list wide">
          <h2>Aktif Yarışmalar</h2>
          {joinable.length === 0 && (
            <p className="muted">Şu anda aktif yarışma yok.</p>
          )}
          {joinable.map((c) => (
            <button
              key={c.id}
              className="contest-card"
              onClick={() => setSelectedId(c.id)}
            >
              <span className="contest-name">{c.name}</span>
              <span className={`status-badge ${c.status}`}>
                {c.status === "open" ? "Başlamadı" : "Devam Ediyor"}
              </span>
            </button>
          ))}
        </div>
      )}

      {selectedId && !joined && (
        <ContestJoin
          contestId={selectedId}
          onEnter={() => setJoined(true)}
          onBack={handleBack}
        />
      )}

      {selectedId && joined && selected && (
        <ContestView contestId={selected.id} onBack={handleBack} />
      )}
    </div>
  );
}
