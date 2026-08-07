export default function FinishedScreen({ results, uid, contestName, onBack }) {
  const my = results.find((r) => r.id === uid);

  return (
    <div className="screen finished-screen">
      {onBack && (
        <button className="icon-btn back-btn" onClick={onBack}>
          ← Yarışmalar
        </button>
      )}
      <h1>Yarışma bitti!</h1>
      <p className="muted">
        "{contestName}" yarışmasına katılımınız için teşekkürler.
      </p>
      {my ? (
        <div className="final-score">
          <div>
            <span>Puan</span>
            <strong>{my.total ?? 0}</strong>
          </div>
          <div>
            <span>Doğru</span>
            <strong>{my.correctCount ?? 0}</strong>
          </div>
          <div>
            <span>Yanlış</span>
            <strong>{my.wrongCount ?? 0}</strong>
          </div>
          <div>
            <span>Cevap</span>
            <strong>{my.answeredCount ?? 0}</strong>
          </div>
        </div>
      ) : (
        <p className="muted">Bu yarışmada kaydınız bulunamadı.</p>
      )}
    </div>
  );
}
