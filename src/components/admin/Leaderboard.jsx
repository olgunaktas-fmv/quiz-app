import { useScores } from "../../hooks/useScores";
import { usePlayers } from "../../hooks/usePlayers";

export default function Leaderboard({ compact = false }) {
  const scores = useScores();
  const players = usePlayers();

  if (scores.length === 0) {
    return (
      <div className="leaderboard">
        <h3>Skor Tablosu</h3>
        <p className="muted">Henüz puan yok.</p>
      </div>
    );
  }

  return (
    <div className={`leaderboard ${compact ? "compact" : ""}`}>
      <h3>Skor Tablosu</h3>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Oyuncu</th>
            <th>Doğru</th>
            <th>Puan</th>
          </tr>
        </thead>
        <tbody>
          {scores.map((s, i) => (
            <tr key={s.id} className={i === 0 ? "leader" : ""}>
              <td>{i + 1}</td>
              <td>{players[s.id]?.name || s.id.slice(0, 8)}</td>
              <td>{s.correctCount ?? 0}</td>
              <td className="score-cell">{s.total ?? 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
