import { useAuth } from "../../hooks/useAuth";
import { useContest } from "../../hooks/useContest";
import { useQuestion } from "../../hooks/useQuestion";
import { usePlayerContestAnswer } from "../../hooks/usePlayerContestAnswer";
import { useContestResults } from "../../hooks/useContestResults";
import { useCountdown } from "../../hooks/useCountdown";
import { submitAnswer } from "../../db/api";
import WaitingScreen from "./WaitingScreen";
import QuestionScreen from "./QuestionScreen";
import RevealScreen from "./RevealScreen";
import FinishedScreen from "./FinishedScreen";

export default function ContestView({ contestId, onBack }) {
  const { user } = useAuth();
  const contest = useContest(contestId);
  const question = useQuestion(contest?.currentQuestionId);
  const myAnswer = usePlayerContestAnswer(
    contestId,
    contest?.currentQuestionId,
    user?.uid
  );
  const results = useContestResults(contestId);

  const remaining = useCountdown(
    question?.timeLimit,
    contest?.status === "live" && contest?.phase === "question",
    contest?.questionStartedAt
  );

  if (!contest) {
    return (
      <div className="screen loading-screen">
        <div className="spinner" />
        <h2>Yarışmaya bağlanıyor...</h2>
      </div>
    );
  }

  const handleAnswer = async (index, timeTakenMs) => {
    await submitAnswer(
      contestId,
      contest.currentQuestionId,
      user.uid,
      index,
      timeTakenMs
    );
  };

  if (contest.status === "open") {
    return (
      <WaitingScreen
        text="Yarışma henüz başlamadı. Admin soru gönderiyor..."
        onBack={onBack}
      />
    );
  }

  if (contest.status === "live") {
    if (contest.phase === "waiting") {
      return <WaitingScreen text="Admin soru bekleniyor..." onBack={onBack} />;
    }

    if (contest.phase === "question") {
      if (myAnswer) {
        return (
          <WaitingScreen
            text="Cevabınız kaydedildi. Sonraki soru bekleniyor..."
            onBack={onBack}
          />
        );
      }
      if (remaining > 0) {
        return (
          <QuestionScreen
            key={contest.currentQuestionId}
            question={question}
            timeLimit={question?.timeLimit}
            startedAt={contest.questionStartedAt}
            onAnswer={handleAnswer}
          />
        );
      }
      return (
        <WaitingScreen
          text="Süre doldu. Sonuçlar bekleniyor..."
          onBack={onBack}
        />
      );
    }

    if (contest.phase === "reveal") {
      return (
        <RevealScreen
          key={contest.currentQuestionId}
          question={question}
          myAnswer={myAnswer}
        />
      );
    }
  }

  if (contest.status === "finished") {
    return (
      <FinishedScreen
        results={results}
        uid={user.uid}
        contestName={contest.name}
        onBack={onBack}
      />
    );
  }

  return <WaitingScreen text="Admin soru gönderiyor..." onBack={onBack} />;
}
