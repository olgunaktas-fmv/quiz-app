const LETTERS = ["A", "B", "C", "D", "E"];

export default function RevealScreen({ question, myAnswer }) {
  if (!question) {
    return (
      <div className="screen loading-screen">
        <div className="spinner" />
        <h2>Sonuç yükleniyor...</h2>
      </div>
    );
  }

  const answered = !!myAnswer;
  const isCorrect =
    answered && myAnswer.selectedIndex === question.correctIndex;

  return (
    <div className="screen reveal-screen">
      <h1 className={isCorrect ? "verdict-correct" : "verdict-wrong"}>
        {!answered
          ? "Cevap vermediniz"
          : isCorrect
          ? "Doğru! 🎉"
          : "Yanlış"}
      </h1>

      <h3 className="reveal-question">{question.text}</h3>

      <div className="options options-static">
        {question.options.map((opt, i) => {
          const isCorrectOpt = i === question.correctIndex;
          const isPlayerOpt = answered && i === myAnswer.selectedIndex;
          const cls = [
            "option",
            isCorrectOpt ? "correct" : "",
            isPlayerOpt && !isCorrectOpt ? "wrong" : "",
          ].join(" ");
          return (
            <div key={i} className={cls}>
              <span className="option-letter">{LETTERS[i]}</span>
              <span className="option-text">{opt}</span>
              {isCorrectOpt && <span className="option-mark">✓</span>}
              {isPlayerOpt && !isCorrectOpt && (
                <span className="option-mark">✗</span>
              )}
            </div>
          );
        })}
      </div>

      <p className="waiting-note">
        Yarışma devam ediyor, sıradaki soru bekleniyor...
      </p>
    </div>
  );
}
