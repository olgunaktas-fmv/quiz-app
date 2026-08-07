import { useEffect, useState } from "react";
import { useGameState } from "../../hooks/useGameState";
import { initializeGame } from "../../db/api";
import ControlPanel from "./ControlPanel";
import QuestionPool from "./QuestionPool";
import Leaderboard from "./Leaderboard";

const TABS = [
  { id: "control", label: "Kontrol" },
  { id: "pool", label: "Soru Havuzu" },
  { id: "leaderboard", label: "Sıralama" },
];

export default function AdminScreen() {
  const [tab, setTab] = useState("control");
  const game = useGameState();

  useEffect(() => {
    if (game === null) initializeGame();
  }, [game]);

  return (
    <div className="admin-screen">
      <header className="admin-header">
        <h1>Quiz Yönetimi</h1>
        <nav className="admin-nav">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={tab === t.id ? "active" : ""}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="admin-main">
        {tab === "control" && (
          <ControlPanel game={game} onGoToPool={() => setTab("pool")} />
        )}
        {tab === "pool" && <QuestionPool />}
        {tab === "leaderboard" && <Leaderboard />}
      </main>
    </div>
  );
}
