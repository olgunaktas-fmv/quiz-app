import { ref } from "firebase/database";
import { db } from "../firebase";

export const gameRef = ref(db, "game");
export const questionsRef = ref(db, "questions");
export const playersRef = ref(db, "players");
export const answersRef = ref(db, "answers");
export const scoresRef = ref(db, "scores");

export const questionRef = (id) => ref(db, `questions/${id}`);
export const playerRef = (id) => ref(db, `players/${id}`);
export const questionAnswersRef = (questionId) => ref(db, `answers/${questionId}`);
export const playerAnswerRef = (questionId, playerId) =>
  ref(db, `answers/${questionId}/${playerId}`);
export const scoreRef = (playerId) => ref(db, `scores/${playerId}`);
