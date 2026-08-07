import { useState } from "react";
import { useQuestions } from "../../hooks/useQuestions";
import { addQuestion, removeQuestion } from "../../db/api";
import ImageUrlInput from "./ImageUrlInput";
import {
  BRANCH_SUGGESTIONS,
  DIFFICULTY_LABEL,
  DIFFICULTY_OPTIONS,
  GRADE_OPTIONS,
  gradeOf,
  normalizeOptions,
  optionText,
  pointsOf,
} from "../../lib/questionMeta";

const LETTERS = ["A", "B", "C", "D", "E"];
const EMPTY_OPTIONS = ["", "", "", "", ""].map((t) => ({
  text: t,
  imageUrl: "",
}));

const gradeLabel = (q) => {
  const g = gradeOf(q);
  return g === "Genel" ? "Genel" : `${g}. Sınıf`;
};

export default function QuestionPool() {
  const questions = useQuestions();
  const [text, setText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [grade, setGrade] = useState("Genel");
  const [branch, setBranch] = useState("");
  const [difficulty, setDifficulty] = useState("orta");
  const [points, setPoints] = useState("");
  const [options, setOptions] = useState(EMPTY_OPTIONS);
  const [correctIndex, setCorrectIndex] = useState(0);
  const [timeLimit, setTimeLimit] = useState(20);

  const setOptionText = (i) => (e) =>
    setOptions((prev) =>
      prev.map((v, j) => (j === i ? { ...v, text: e.target.value } : v))
    );

  const setOptionImage = (i) => (val) =>
    setOptions((prev) =>
      prev.map((v, j) => (j === i ? { ...v, imageUrl: val } : v))
    );

  const handleAdd = async (e) => {
    e.preventDefault();
    const filled = options.map((o) => ({
      text: o.text.trim(),
      imageUrl: o.imageUrl.trim(),
    }));
    if (!text.trim() || filled.some((o) => !o.text)) return;

    await addQuestion({
      text: text.trim(),
      imageUrl: imageUrl.trim() || undefined,
      grade,
      branch: branch.trim() || undefined,
      difficulty,
      points: points ? Number(points) : undefined,
      options: filled.map((o) => (o.imageUrl ? o : o.text)),
      correctIndex,
      timeLimit: Number(timeLimit),
    });

    setText("");
    setImageUrl("");
    setGrade("Genel");
    setBranch("");
    setDifficulty("orta");
    setPoints("");
    setOptions(EMPTY_OPTIONS);
    setCorrectIndex(0);
  };

  return (
    <div className="panel question-pool">
      <h2>Soru Havuzu ({questions.length})</h2>

      <form className="question-form" onSubmit={handleAdd}>
        <div className="q-meta-grid">
          <label className="field">
            <span>Sınıf</span>
            <select value={grade} onChange={(e) => setGrade(e.target.value)}>
              {GRADE_OPTIONS.map((g) => (
                <option key={g} value={g}>
                  {g === "Genel" ? "Genel" : `${g}. Sınıf`}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Branş</span>
            <input
              list="branch-list"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              placeholder="örn. Matematik"
            />
            <datalist id="branch-list">
              {BRANCH_SUGGESTIONS.map((b) => (
                <option key={b} value={b} />
              ))}
            </datalist>
          </label>
          <label className="field">
            <span>Zorluk</span>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              {DIFFICULTY_OPTIONS.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Puan (opsiyonel)</span>
            <input
              type="number"
              min={1}
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              placeholder="Boş bırakılabilir"
            />
          </label>
        </div>

        <ImageUrlInput
          value={imageUrl}
          onChange={setImageUrl}
          placeholder="Soru görseli URL (opsiyonel) — yapıştırın veya sürükleyin"
        />

        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Soru metni"
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
              <div className="option-inputs">
                <input
                  value={o.text}
                  onChange={setOptionText(i)}
                  placeholder={`Şık ${LETTERS[i]}`}
                />
                <ImageUrlInput
                  value={o.imageUrl}
                  onChange={setOptionImage(i)}
                  placeholder={`${LETTERS[i]} şıkkı görseli URL (opsiyonel)`}
                />
              </div>
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
              !text.trim() || options.some((o) => !o.text.trim())
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
              <div className="question-card-title">
                <p>{q.text}</p>
                <div className="q-badges">
                  <span className="badge">{gradeLabel(q)}</span>
                  {q.branch && <span className="badge">{q.branch}</span>}
                  <span className="badge diff">{difficultyLabel(q)}</span>
                  {pointsOf(q) != null && (
                    <span className="badge points">🏆 {pointsOf(q)} Puan</span>
                  )}
                </div>
              </div>
              <button className="icon-btn" onClick={() => removeQuestion(q.id)}>
                Sil
              </button>
            </div>
            {q.imageUrl && (
              <img className="card-thumb" src={q.imageUrl} alt="Soru görseli" />
            )}
            <div className="q-options-preview">
              {normalizeOptions(q.options).map((o, i) => (
                <span key={i} className="q-opt-preview">
                  <b>{LETTERS[i]}</b>
                  {o.imageUrl && (
                    <img src={o.imageUrl} alt="" className="q-opt-thumb" />
                  )}
                  {optionText(o)}
                </span>
              ))}
            </div>
            <div className="q-meta">
              Doğru: {LETTERS[q.correctIndex]} · Süre: {q.timeLimit}s
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
