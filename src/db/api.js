import {
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
  contestPlayerAnswerRef,
  contestPlayerRef,
  contestRef,
  contestsRef,
  questionRef,
  questionsRef,
} from "./schema";

export const addQuestion = (data) =>
  push(questionsRef, { ...data, createdAt: serverTimestamp() });

export const removeQuestion = (id) => remove(questionRef(id));

export const createContest = ({ name, password, createdBy }) =>
  push(contestsRef, {
    name,
    password,
    createdBy,
    status: "open",
    phase: "waiting",
    roundNumber: 0,
    createdAt: serverTimestamp(),
  });

export const startContest = (contestId) =>
  update(contestRef(contestId), {
    status: "live",
    phase: "waiting",
    startedAt: serverTimestamp(),
  });

export const sendQuestion = (contestId, questionId) =>
  update(contestRef(contestId), {
    status: "live",
    phase: "question",
    currentQuestionId: questionId,
    questionStartedAt: serverTimestamp(),
    roundNumber: increment(1),
  });

export const revealQuestion = (contestId) =>
  update(contestRef(contestId), { phase: "reveal" });

export const nextQuestion = (contestId) =>
  update(contestRef(contestId), {
    phase: "waiting",
    currentQuestionId: null,
    questionStartedAt: null,
  });

export const finishContest = (contestId) =>
  update(contestRef(contestId), {
    status: "finished",
    phase: "finished",
    finishedAt: serverTimestamp(),
  });

export const joinContest = (contestId, uid, username) =>
  set(contestPlayerRef(contestId, uid), {
    username,
    joinedAt: serverTimestamp(),
  });

export const submitAnswer = (
  contestId,
  questionId,
  uid,
  selectedIndex,
  timeTakenMs
) =>
  set(contestPlayerAnswerRef(contestId, questionId, uid), {
    selectedIndex,
    timeTakenMs,
    answeredAt: serverTimestamp(),
  });

export function calculatePoints(timeLimitSec, timeTakenMs) {
  const max = Math.max(1, timeLimitSec * 1000);
  const ratio = Math.max(0, Math.min(1, 1 - timeTakenMs / max));
  return Math.round(100 * (0.5 + 0.5 * ratio));
}

export async function computeAndStoreResults(contestId, question, answers) {
  const updates = {};
  for (const a of answers) {
    const correct = a.selectedIndex === question.correctIndex;
    const points = correct
      ? calculatePoints(question.timeLimit, a.timeTakenMs)
      : 0;
    const base = `results/${contestId}/${a.uid}`;
    updates[`${base}/answeredCount`] = increment(1);
    updates[`${base}/correctCount`] = increment(correct ? 1 : 0);
    updates[`${base}/wrongCount`] = increment(correct ? 0 : 1);
    updates[`${base}/total`] = increment(points);
  }
  if (Object.keys(updates).length) {
    await update(ref(db), updates);
  }
}
