import { useState } from "react";
import { useQuestions } from "../../hooks/useQuestions";
import { useQuestion } from "../../hooks/useQuestion";
import { useQuestionAnswers } from "../../hooks/useQuestionAnswers";
import { useCountdown } from "../../hooks/useCountdown";
import { usePlayers } from "../../hooks/usePlayers";
import {
  computeAndStoreScores,
  finishGame,
  publishQuestion,
  resetAll,
  revealAnswers,
  startWaiting,
} from "../../db/api";
import Leaderboard from "./Leaderboard";

const LETTERS = ["A", "B", "C", "D", "E"];

export default function ControlPanel({ game, onGoToPool }) {
  const questions = useQuestions();
  const players = usePlayers();
  const [selectedQuestionId, setSelectedQuestionId] = useState("");

  const currentQuestion = useQuestion(game?.currentQuestionId);
  const showAnswers =
    game?.status === "live" || game?.status === "reveal";
  const answers = useQuestionAnswers(showAnswers ? game.currentQuestionId : null);
  const remaining = useCountdown(
    currentQuestion?.timeLimit,
    game?.status === "live",
    game?.startedAt
  );

  const status = game?.status;

  const handlePublish = async () => {
    if (!selectedQuestionId) return;
    await publishQuestion(selectedQuestionId);
    setSelectedQuestionId("");
  };

  const handleReveal = async () => {
    if (!currentQuestion) return;
    await computeAndStoreScores(currentQuestion, answers);
    await revealAnswers();
  };

  const playerName = (id) =>
    players[id]?.name || id.slice(0, 8);

  if (!status || status === "waiting") {
    return (
      <div className="panel control-waiting">
        <h2>Yarışma Yönetimi</h2>

        {questions.length === 0 ? (
          <div className="empty-state">
            <p className="muted">Henüz soru eklenmedi.</p>
            <button onClick={onGoToPool}>Soru Havuzuna Git</button>
          </div>
        ) : (
          <div className="publish-box">
            <label>Sıradaki Soru</label>
            <select
              value={selectedQuestionId}
              onChange={(e) => setSelectedQuestionId(e.target.value)}
            >
              <option value="">Soru seçin...</option>
              {questions.map((q) => (
                <option key={q.id} value={q.id}>
                  {q.text.slice(0, 70)}
                </option>
              ))}
            </select>
            <button onClick={handlePublish} disabled={!selectedQuestionId}>
              Soruyu Gönder
            </button>
            <p className="hint">
              Butona basıldığında soru tüm bağlı cihazlarda aynı anda açılır.
            </p>
          </div>
        )}
      </div>
    );
  }

  if (status === "live") {
    return (
      <div className="panel control-live">
        <div className="live-head">
          <h2>Soru Canlı</h2>
          <div className={`timer ${remaining === 0 ? "time-up" : ""}`}>
            {remaining}s
          </div>
        </div>

        <div className="question-preview">
          {currentQuestion?.imageUrl && (
            <img src={currentQuestion.imageUrl} alt="Soru görseli" />
          )}
          <p>{currentQuestion?.text}</p>
        </div>

        <div className="answer-feed">
          <h3>
            Cevap Verenler ({answers.length} / {Object.keys(players).length})
          </h3>
          {answers.length === 0 ? (
            <p className="muted">Henüz cevap yok.</p>
          ) : (
            <ul>
              {answers.map((a) => (
                <li key={a.playerId}>
                  <span className="answer-name">{playerName(a.playerId)}</span>
                  <span className="answer-opt">
                    {LETTERS[a.selectedIndex]}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          className="primary"
          onClick={handleReveal}
          disabled={!currentQuestion}
        >
          Cevapları Aç ve Puanla
        </button>
      </div>
    );
  }

  if (status === "reveal") {
    return (
      <div className="panel control-reveal">
        <h2>Sonuçlar</h2>
        <div className="reveal-info">
          <p className="muted">Soru:</p>
          <p>{currentQuestion?.text}</p>
          <p className="correct-line">
            Doğru cevap:{" "}
            <strong>
              {LETTERS[currentQuestion?.correctIndex]} ·{" "}
              {currentQuestion?.options?.[currentQuestion?.correctIndex]}
            </strong>
          </p>
        </div>

        <Leaderboard compact />

        <div className="reveal-actions">
          <button onClick={startWaiting}>Sonraki Soru</button>
          <button className="danger" onClick={finishGame}>
            Yarışmayı Bitir
          </button>
        </div>
      </div>
    );
  }

  if (status === "finished") {
    return (
      <div className="panel control-finished">
        <h2>Yarışma Bitti</h2>
        <Leaderboard />
        <button className="danger" onClick={resetAll}>
          Yeni Yarışma Başlat (Tüm Verileri Sil)
        </button>
      </div>
    );
  }

  return null;
}
