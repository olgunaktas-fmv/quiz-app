export default function WaitingScreen() {
  return (
    <div className="screen waiting-screen">
      <div className="spinner" />
      <h1>Admin soru gönderiyor...</h1>
      <p className="muted">Lütfen bekleyin, soru herkeste aynı anda açılacak</p>
    </div>
  );
}
