import { usePlayerScore } from "../../hooks/usePlayerScore";

export default function FinishedScreen({ playerId }) {
  const score = usePlayerScore(playerId);

  return (
    <div className="screen finished-screen">
      <h1>Yarışma bitti!</h1>
      <p className="muted">Katılımınız için teşekkürler.</p>
      {score && (
        <div className="final-score">
          <div>
            <span>Puan</span>
            <strong>{score.total ?? 0}</strong>
          </div>
          <div>
            <span>Doğru Cevap</span>
            <strong>{score.correctCount ?? 0}</strong>
          </div>
        </div>
      )}
    </div>
  );
}
