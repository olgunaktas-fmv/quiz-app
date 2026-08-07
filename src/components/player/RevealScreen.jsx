import { useFitScale } from "../../hooks/useFitScale";
import { normalizeOptions, optionText } from "../../lib/questionMeta";

const LETTERS = ["A", "B", "C", "D", "E"];

export default function RevealScreen({ question, myAnswer }) {
  const { outerRef, innerRef, scale } = useFitScale();

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
  const options = normalizeOptions(question.options);

  return (
    <div ref={outerRef} className="fit-outer">
      <div
        ref={innerRef}
        className="fit-inner"
        style={{ transform: `scale(${scale})` }}
      >
        <div className="screen reveal-screen">
          <h1 className={isCorrect ? "verdict-correct" : "verdict-wrong"}>
            {!answered
              ? "Cevap vermediniz"
              : isCorrect
              ? "Doğru! 🎉"
              : "Yanlış"}
          </h1>

          {question.imageUrl && (
            <div className="question-image">
              <img src={question.imageUrl} alt="Soru görseli" />
            </div>
          )}

          <h3 className="reveal-question">{question.text}</h3>

          <div className="options options-static">
            {options.map((opt, i) => {
              const isCorrectOpt = i === question.correctIndex;
              const isPlayerOpt = answered && i === myAnswer.selectedIndex;
              const cls = [
                "option",
                opt.imageUrl ? "has-image" : "",
                isCorrectOpt ? "correct" : "",
                isPlayerOpt && !isCorrectOpt ? "wrong" : "",
              ]
                .filter(Boolean)
                .join(" ");
              return (
                <div key={i} className={cls}>
                  <span className="option-letter">{LETTERS[i]}</span>
                  {opt.imageUrl && (
                    <span className="option-img-wrap">
                      <img className="option-img" src={opt.imageUrl} alt="" />
                    </span>
                  )}
                  <span className="option-text">{optionText(opt)}</span>
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
      </div>
    </div>
  );
}
