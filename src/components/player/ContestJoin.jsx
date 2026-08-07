import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useContest } from "../../hooks/useContest";
import { useContestPlayers } from "../../hooks/useContestPlayers";
import { joinContest } from "../../db/api";

export default function ContestJoin({ contestId, onEnter, onBack }) {
  const { user, username } = useAuth();
  const contest = useContest(contestId);
  const players = useContestPlayers(contestId);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (!contest) {
    return (
      <div className="join-contest">
        <div className="spinner" />
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== contest.password) {
      setError("Yarışma şifresi hatalı.");
      return;
    }
    const alreadyJoined = players.some((p) => p.uid === user.uid);
    if (contest.status === "live" && !alreadyJoined) {
      setError(
        "Yarışma başladı. Daha önce giriş yapmadığınız için giremezsiniz."
      );
      return;
    }
    setBusy(true);
    if (!alreadyJoined) await joinContest(contestId, user.uid, username);
    setBusy(false);
    onEnter();
  };

  return (
    <div className="join-contest panel">
      <button className="icon-btn" onClick={onBack}>
        ← Geri
      </button>
      <h2>{contest.name}</h2>
      <p className="muted">Bu yarışmaya girmek için şifreyi girin</p>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Yarışma şifresi"
          autoFocus
        />
        {error && <p className="error-text">{error}</p>}
        <button type="submit" disabled={!password || busy}>
          {busy ? "Giriliyor..." : "Giriş Yap"}
        </button>
      </form>
    </div>
  );
}
