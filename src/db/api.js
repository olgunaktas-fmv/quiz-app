import {
  get,
  increment,
  push,
  ref,
  remove,
  serverTimestamp,
  set,
  update,
} from "firebase/database";
import { db } from "../firebase";
import {
  answersRef,
  gameRef,
  playerRef,
  playersRef,
  questionAnswersRef,
  questionRef,
  questionsRef,
  scoresRef,
} from "./schema";

export const initializeGame = () =>
  set(gameRef, { status: "waiting", roundNumber: 0 });

export const addQuestion = (data) =>
  push(questionsRef, { ...data, createdAt: serverTimestamp() });

export const updateQuestion = (id, data) => update(questionRef(id), data);

export const removeQuestion = (id) => remove(questionRef(id));

export const publishQuestion = (questionId) =>
  update(gameRef, {
    status: "live",
    currentQuestionId: questionId,
    startedAt: serverTimestamp(),
    roundNumber: increment(1),
  });

export const revealAnswers = () => update(gameRef, { status: "reveal" });

export const startWaiting = () => update(gameRef, { status: "waiting" });

export const finishGame = () => update(gameRef, { status: "finished" });

export const resetAll = async () => {
  await initializeGame();
  await set(playersRef, null);
  await set(answersRef, null);
  await set(scoresRef, null);
};

export const joinGame = (playerId, name) =>
  set(playerRef(playerId), { name, joinedAt: serverTimestamp() });

export const submitAnswer = (questionId, playerId, selectedIndex, timeTakenMs) =>
  set(playerAnswerRef(questionId, playerId), {
    selectedIndex,
    timeTakenMs,
    answeredAt: serverTimestamp(),
  });

export function calculatePoints(timeLimitSec, timeTakenMs) {
  const max = Math.max(1, timeLimitSec * 1000);
  const ratio = Math.max(0, Math.min(1, 1 - timeTakenMs / max));
  return Math.round(100 * (0.5 + 0.5 * ratio));
}

export async function computeAndStoreScores(question, answers) {
  const updates = {};
  for (const a of answers) {
    const correct = a.selectedIndex === question.correctIndex;
    const points = correct
      ? calculatePoints(question.timeLimit, a.timeTakenMs)
      : 0;
    updates[`scores/${a.playerId}/total`] = increment(points);
    updates[`scores/${a.playerId}/correctCount`] = increment(correct ? 1 : 0);
  }
  if (Object.keys(updates).length) {
    await update(ref(db), updates);
  }
}

export async function hasAnswers(questionId) {
  const snap = await get(questionAnswersRef(questionId));
  return snap.exists();
}
