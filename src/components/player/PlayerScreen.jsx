import { useEffect, useState } from "react";
import { useGameState } from "../../hooks/useGameState";
import { useQuestion } from "../../hooks/useQuestion";
import { joinGame, submitAnswer } from "../../db/api";
import JoinScreen from "./JoinScreen";
import WaitingScreen from "./WaitingScreen";
import QuestionScreen from "./QuestionScreen";
import RevealScreen from "./RevealScreen";
import FinishedScreen from "./FinishedScreen";

const PLAYER_ID_KEY = "quiz_player_id";
const PLAYER_NAME_KEY = "quiz_player_name";

export default function PlayerScreen() {
  const [playerId, setPlayerId] = useState(
    () => localStorage.getItem(PLAYER_ID_KEY)
  );
  const [name, setName] = useState(() => localStorage.getItem(PLAYER_NAME_KEY));
  const [questionStart, setQuestionStart] = useState(0);

  const game = useGameState();
  const question = useQuestion(game?.currentQuestionId);

  useEffect(() => {
    if (playerId && name) joinGame(playerId, name);
  }, [playerId, name]);

  useEffect(() => {
    if (game?.status === "live") setQuestionStart(Date.now());
  }, [game?.status, game?.currentQuestionId]);

  const handleJoin = async (playerName) => {
    const id = crypto.randomUUID();
    localStorage.setItem(PLAYER_ID_KEY, id);
    localStorage.setItem(PLAYER_NAME_KEY, playerName);
    setPlayerId(id);
    setName(playerName);
    await joinGame(id, playerName);
  };

  const handleAnswer = async (index, timeTakenMs) => {
    await submitAnswer(game.currentQuestionId, playerId, index, timeTakenMs);
  };

  if (!playerId || !name) {
    return <JoinScreen onJoin={handleJoin} />;
  }

  if (!game) {
    return (
      <div className="screen loading-screen">
        <div className="spinner" />
        <h2>Yarışmaya bağlanıyor...</h2>
      </div>
    );
  }

  if (game.status === "live") {
    return (
      <QuestionScreen
        key={game.currentQuestionId}
        question={question}
        timeLimit={question?.timeLimit}
        startedAt={game.startedAt}
        onAnswer={handleAnswer}
      />
    );
  }

  if (game.status === "reveal") {
    return <RevealScreen key={game.currentQuestionId} question={question} playerId={playerId} />;
  }

  if (game.status === "finished") {
    return <FinishedScreen playerId={playerId} />;
  }

  return <WaitingScreen />;
}
