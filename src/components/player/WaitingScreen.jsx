export default function WaitingScreen({ text = "Admin soru gönderiyor...", onBack }) {
  return (
    <div className="screen waiting-screen">
      {onBack && (
        <button className="icon-btn back-btn" onClick={onBack}>
          ← Geri
        </button>
      )}
      <div className="spinner" />
      <h1>{text}</h1>
      <p className="muted">Lütfen bekleyin</p>
    </div>
  );
}
