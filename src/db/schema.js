import { ref } from "firebase/database";
import { db } from "../firebase";

export const usersRef = ref(db, "users");
export const adminsRef = ref(db, "admins");
export const contestsRef = ref(db, "contests");
export const questionsRef = ref(db, "questions");

export const userRef = (uid) => ref(db, `users/${uid}`);
export const adminRef = (username) => ref(db, `admins/${username}`);
export const contestRef = (contestId) => ref(db, `contests/${contestId}`);
export const questionRef = (questionId) => ref(db, `questions/${questionId}`);
export const contestPlayersForRef = (contestId) =>
  ref(db, `contestPlayers/${contestId}`);
export const contestPlayerRef = (contestId, uid) =>
  ref(db, `contestPlayers/${contestId}/${uid}`);
export const contestAnswersForQuestionRef = (contestId, questionId) =>
  ref(db, `answers/${contestId}/${questionId}`);
export const contestPlayerAnswerRef = (contestId, questionId, uid) =>
  ref(db, `answers/${contestId}/${questionId}/${uid}`);
export const resultsForContestRef = (contestId) => ref(db, `results/${contestId}`);
