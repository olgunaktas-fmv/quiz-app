import { useState } from "react";
import { useContests } from "../../hooks/useContests";
import { useContestResults } from "../../hooks/useContestResults";
import { useContestPlayers } from "../../hooks/useContestPlayers";
import ResultsTable from "./ResultsTable";

export default function Results() {
  const contests = useContests();
  const finished = contests.filter((c) => c.status === "finished");
  const [selectedId, setSelectedId] = useState(null);
  const results = useContestResults(selectedId);
  const players = useContestPlayers(selectedId);

  const playerName = (uid) =>
    players.find((p) => p.uid === uid)?.username || uid.slice(0, 8);

  return (
    <div className="panel">
      <h2>Bitmiş Yarışmalar</h2>
      {finished.length === 0 && (
        <p className="muted">Henüz bitmiş yarışma yok.</p>
      )}
      <div className="contest-list">
        {finished.map((c) => (
          <button
            key={c.id}
            className={`contest-card ${selectedId === c.id ? "selected" : ""}`}
            onClick={() => setSelectedId(c.id)}
          >
            <span className="contest-name">{c.name}</span>
            <span className="muted">
              {c.finishedAt
                ? new Date(c.finishedAt).toLocaleString("tr-TR")
                : ""}
            </span>
          </button>
        ))}
      </div>
      {selectedId && (
        <div className="detail-block">
          <h3>Sonuçlar</h3>
          <ResultsTable results={results} playerName={playerName} />
        </div>
      )}
    </div>
  );
}
