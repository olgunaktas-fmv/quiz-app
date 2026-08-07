import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useContests } from "../../hooks/useContests";
import { useContestPlayers } from "../../hooks/useContestPlayers";
import { createContest } from "../../db/api";
import ContestDetail from "./ContestDetail";

const STATUS_LABEL = { open: "Açık", live: "Canlı", finished: "Bitti" };

function PlayerCount({ contestId }) {
  const players = useContestPlayers(contestId);
  return <span className="player-count">{players.length} oyuncu</span>;
}

export default function ContestControl() {
  const { user } = useAuth();
  const contests = useContests();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [busy, setBusy] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim() || !password.trim()) return;
    setBusy(true);
    const contestRef = await createContest({
      name: name.trim(),
      password: password.trim(),
      createdBy: user.uid,
    });
    setSelectedId(contestRef.key);
    setName("");
    setPassword("");
    setBusy(false);
  };

  return (
    <div className="panel">
      <h2>Yarışma Aç</h2>
      <form className="contest-form" onSubmit={handleCreate}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Yarışma adı"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Yarışma şifresi"
        />
        <button
          type="submit"
          disabled={!name.trim() || !password.trim() || busy}
        >
          {busy ? "Açılıyor..." : "Yarışma Aç"}
        </button>
      </form>

      <div className="contest-list">
        <h3>Yarışmalar</h3>
        {contests.length === 0 && (
          <p className="muted">Henüz yarışma yok.</p>
        )}
        {contests.map((c) => (
          <button
            key={c.id}
            className={`contest-card ${selectedId === c.id ? "selected" : ""}`}
            onClick={() => setSelectedId(c.id)}
          >
            <span className="contest-name">{c.name}</span>
            <PlayerCount contestId={c.id} />
            <span className={`status-badge ${c.status}`}>
              {STATUS_LABEL[c.status] || c.status}
            </span>
          </button>
        ))}
      </div>

      {selectedId && <ContestDetail contestId={selectedId} />}
    </div>
  );
}
