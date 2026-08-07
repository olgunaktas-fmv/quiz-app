export default function ResultsTable({ results, playerName }) {
  if (results.length === 0) {
    return <p className="muted">Henüz veri yok.</p>;
  }

  return (
    <table className="leaderboard-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Oyuncu</th>
          <th>Cevap</th>
          <th>Doğru</th>
          <th>Yanlış</th>
          <th>Puan</th>
        </tr>
      </thead>
      <tbody>
        {results.map((r, i) => (
          <tr key={r.id} className={i === 0 ? "leader" : ""}>
            <td>{i + 1}</td>
            <td>{playerName(r.id)}</td>
            <td>{r.answeredCount ?? 0}</td>
            <td>{r.correctCount ?? 0}</td>
            <td>{r.wrongCount ?? 0}</td>
            <td className="score-cell">{r.total ?? 0}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
