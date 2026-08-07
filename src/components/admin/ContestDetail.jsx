import { useState } from "react";
import { useContest } from "../../hooks/useContest";
import { useContestPlayers } from "../../hooks/useContestPlayers";
import { useContestAnswers } from "../../hooks/useContestAnswers";
import { useContestResults } from "../../hooks/useContestResults";
import { useQuestions } from "../../hooks/useQuestions";
import { useQuestion } from "../../hooks/useQuestion";
import { useCountdown } from "../../hooks/useCountdown";
import {
  computeAndStoreResults,
  finishContest,
  nextQuestion,
  revealQuestion,
  sendQuestion,
  startContest,
} from "../../db/api";
import ResultsTable from "./ResultsTable";

const LETTERS = ["A", "B", "C", "D", "E"];
const STATUS_LABEL = { open: "Açık", live: "Canlı", finished: "Bitti" };

export default function ContestDetail({ contestId }) {
  const contest = useContest(contestId);
  const players = useContestPlayers(contestId);
  const questions = useQuestions();
  const currentQuestion = useQuestion(contest?.currentQuestionId);
  const answers = useContestAnswers(contestId, contest?.currentQuestionId);
  const results = useContestResults(contestId);
  const [selectedQuestionId, setSelectedQuestionId] = useState("");

  const remaining = useCountdown(
    currentQuestion?.timeLimit,
    contest?.status === "live" && contest?.phase === "question",
    contest?.questionStartedAt
  );

  if (!contest) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <h2>Yarışma yükleniyor...</h2>
      </div>
    );
  }

  const playerName = (uid) =>
    players.find((p) => p.uid === uid)?.username || uid.slice(0, 8);

  const handleSend = async () => {
    if (!selectedQuestionId) return;
    await sendQuestion(contestId, selectedQuestionId);
    setSelectedQuestionId("");
  };

  const handleReveal = async () => {
    if (!currentQuestion) return;
    await computeAndStoreResults(contestId, currentQuestion, answers);
    await revealQuestion(contestId);
  };

  return (
    <div className="contest-detail panel">
      <div className="contest-head">
        <h2>{contest.name}</h2>
        <span className={`status-badge ${contest.status}`}>
          {STATUS_LABEL[contest.status] || contest.status}
        </span>
      </div>

      {contest.status === "open" && (
        <div className="detail-block">
          <h3>Katılan Oyuncular ({players.length})</h3>
          {players.length === 0 ? (
            <p className="muted">Henüz oyuncu katılmadı.</p>
          ) : (
            <ul className="player-list">
              {players.map((p) => (
                <li key={p.uid}>{p.username}</li>
              ))}
            </ul>
          )}
          <button className="primary" onClick={() => startContest(contestId)}>
            Yarışmayı Başlat
          </button>
          <p className="hint">
            Başlatınca tüm yarışmacılar "soru bekleniyor" ekranını görür.
          </p>
        </div>
      )}

      {contest.status === "live" && (
        <div className="detail-block">
          {contest.phase === "waiting" && (
            <div className="send-box">
              <h3>Soru Gönder</h3>
              {questions.length === 0 ? (
                <p className="muted">Soru havuzu boş.</p>
              ) : (
                <>
                  <select
                    value={selectedQuestionId}
                    onChange={(e) => setSelectedQuestionId(e.target.value)}
                  >
                    <option value="">Soru seçin...</option>
                    {questions.map((q) => (
                      <option key={q.id} value={q.id}>
                        {q.text.slice(0, 60)}
                      </option>
                    ))}
                  </select>
                  <button onClick={handleSend} disabled={!selectedQuestionId}>
                    Soruyu Gönder
                  </button>
                </>
              )}
            </div>
          )}

          {contest.phase === "question" && (
            <div className="detail-block">
              <div className="live-head">
                <h3>Soru Canlı</h3>
                <div className={`timer ${remaining === 0 ? "time-up" : ""}`}>
                  {remaining}s
                </div>
              </div>
              <div className="question-preview">
                <p>{currentQuestion?.text}</p>
              </div>
              <div className="answer-feed">
                <h3>
                  Cevap Verenler ({answers.length}/{players.length})
                </h3>
                {answers.length === 0 ? (
                  <p className="muted">Henüz cevap yok.</p>
                ) : (
                  <ul>
                    {answers.map((a) => (
                      <li key={a.uid}>
                        <span>{playerName(a.uid)}</span>
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
          )}

          {contest.phase === "reveal" && (
            <div className="detail-block">
              <h3>Sonuçlar Açıklandı</h3>
              <p className="correct-line">
                Doğru cevap:{" "}
                <strong>
                  {LETTERS[currentQuestion?.correctIndex]} ·{" "}
                  {currentQuestion?.options?.[currentQuestion?.correctIndex]}
                </strong>
              </p>
              <ResultsTable results={results} playerName={playerName} />
              <div className="reveal-actions">
                <button onClick={() => nextQuestion(contestId)}>
                  Sonraki Soru
                </button>
                <button
                  className="danger"
                  onClick={() => finishContest(contestId)}
                >
                  Yarışmayı Bitir
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {contest.status === "finished" && (
        <div className="detail-block">
          <h3>Yarışma Sonuçları</h3>
          <ResultsTable results={results} playerName={playerName} />
        </div>
      )}
    </div>
  );
}
