import { useState } from "react";
import { useCountdown } from "../../hooks/useCountdown";
import { useFitScale } from "../../hooks/useFitScale";
import { normalizeOptions, optionText } from "../../lib/questionMeta";

const LETTERS = ["A", "B", "C", "D", "E"];

export default function QuestionScreen({
  question,
  timeLimit,
  startedAt,
  onAnswer,
}) {
  const [selected, setSelected] = useState(null);
  const [start] = useState(() => Date.now());
  const { outerRef, innerRef, scale } = useFitScale();

  const remaining = useCountdown(timeLimit, selected === null, startedAt);
  const timeUp = remaining === 0;

  if (!question) {
    return (
      <div className="screen loading-screen">
        <div className="spinner" />
        <h2>Soru yükleniyor...</h2>
      </div>
    );
  }

  const handleSelect = async (index) => {
    if (selected !== null || timeUp) return;
    setSelected(index);
    await onAnswer(index, Date.now() - start);
  };

  const options = normalizeOptions(question.options);

  return (
    <div ref={outerRef} className="fit-outer">
      <div
        ref={innerRef}
        className="fit-inner"
        style={{ transform: `scale(${scale})` }}
      >
        <div className="screen question-screen">
          <div className={`timer ${timeUp ? "time-up" : ""}`}>{remaining}s</div>

          {question.imageUrl && (
            <div className="question-image">
              <img src={question.imageUrl} alt="Soru görseli" />
            </div>
          )}

          <h2 className="question-text">{question.text}</h2>

          <div className="options">
            {options.map((opt, i) => (
              <button
                key={i}
                className={`option ${opt.imageUrl ? "has-image" : ""} ${
                  selected === i ? "selected" : ""
                }`}
                disabled={selected !== null || timeUp}
                onClick={() => handleSelect(i)}
              >
                <span className="option-letter">{LETTERS[i]}</span>
                {opt.imageUrl && (
                  <span className="option-img-wrap">
                    <img className="option-img" src={opt.imageUrl} alt="" />
                  </span>
                )}
                <span className="option-text">{optionText(opt)}</span>
              </button>
            ))}
          </div>

          {selected !== null && (
            <p className="answered-note">
              Cevabınız kaydedildi. Sonraki soru bekleniyor...
            </p>
          )}
          {selected === null && timeUp && (
            <p className="answered-note">Süre doldu, cevaplama kapandı.</p>
          )}
        </div>
      </div>
    </div>
  );
}
