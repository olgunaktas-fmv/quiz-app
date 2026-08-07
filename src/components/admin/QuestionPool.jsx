import { useState } from "react";
import { useQuestions } from "../../hooks/useQuestions";
import { addQuestion, removeQuestion } from "../../db/api";

const LETTERS = ["A", "B", "C", "D", "E"];
const EMPTY_OPTIONS = ["", "", "", "", ""];

export default function QuestionPool() {
  const questions = useQuestions();
  const [text, setText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [options, setOptions] = useState(EMPTY_OPTIONS);
  const [correctIndex, setCorrectIndex] = useState(0);
  const [timeLimit, setTimeLimit] = useState(20);

  const handleAdd = async (e) => {
    e.preventDefault();
    const filled = options.map((o) => o.trim());
    if (!text.trim() || filled.some((o) => !o)) return;
    await addQuestion({
      text: text.trim(),
      imageUrl: imageUrl.trim(),
      options: filled,
      correctIndex,
      timeLimit: Number(timeLimit),
    });
    setText("");
    setImageUrl("");
    setOptions(EMPTY_OPTIONS);
    setCorrectIndex(0);
  };

  return (
    <div className="panel question-pool">
      <h2>Soru Havuzu ({questions.length})</h2>

      <form className="question-form" onSubmit={handleAdd}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Soru metni"
        />
        <input
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="Görsel URL (opsiyonel)"
        />

        <div className="option-list">
          {options.map((o, i) => (
            <div key={i} className="option-row">
              <label className="radio-label">
                <input
                  type="radio"
                  name="correct"
                  checked={correctIndex === i}
                  onChange={() => setCorrectIndex(i)}
                />
                Doğru
              </label>
              <span className="option-letter">{LETTERS[i]}</span>
              <input
                value={o}
                onChange={(e) =>
                  setOptions((prev) =>
                    prev.map((v, j) => (j === i ? e.target.value : v))
                  )
                }
                placeholder={`Şık ${LETTERS[i]}`}
              />
            </div>
          ))}
        </div>

        <div className="form-footer">
          <label className="time-limit">
            Süre (sn)
            <input
              type="number"
              min={5}
              max={120}
              value={timeLimit}
              onChange={(e) => setTimeLimit(e.target.value)}
            />
          </label>
          <button
            type="submit"
            disabled={
              !text.trim() || options.some((o) => !o.trim())
            }
          >
            Soruyu Ekle
          </button>
        </div>
      </form>

      <div className="question-list">
        {questions.length === 0 && (
          <p className="muted">Soru havuzu boş. Üstteki formdan soru ekleyin.</p>
        )}
        {questions.map((q) => (
          <div key={q.id} className="question-card">
            <div className="question-card-head">
              <p>{q.text}</p>
              <button className="icon-btn" onClick={() => removeQuestion(q.id)}>
                Sil
              </button>
            </div>
            {q.imageUrl && (
              <img className="card-thumb" src={q.imageUrl} alt="Soru görseli" />
            )}
            <div className="q-meta">
              Doğru: {LETTERS[q.correctIndex]} · Süre: {q.timeLimit}s
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
