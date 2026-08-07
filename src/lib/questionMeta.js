export const GRADE_OPTIONS = [
  "Genel",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
];

export const DIFFICULTY_OPTIONS = [
  { value: "kolay", label: "Kolay" },
  { value: "orta", label: "Orta" },
  { value: "zor", label: "Zor" },
];

export const DIFFICULTY_LABEL = {
  kolay: "Kolay",
  orta: "Orta",
  zor: "Zor",
};

export const BRANCH_SUGGESTIONS = [
  "Matematik",
  "Türkçe",
  "Fen Bilimleri",
  "Sosyal Bilgiler",
  "T.C. İnkılap Tarihi",
  "Din Kültürü ve Ahlak Bilgisi",
  "İngilizce",
  "Almanca",
  "Bilişim Teknolojileri",
  "Müzik",
  "Görsel Sanatlar",
  "Beden Eğitimi",
  "Tarih",
  "Coğrafya",
  "Fizik",
  "Kimya",
  "Biyoloji",
  "Türk Dili ve Edebiyatı",
];

const asOption = (o) => (typeof o === "string" ? { text: o } : o || {});

export const normalizeOptions = (options) => (options || []).map(asOption);

export const optionText = (o) => asOption(o).text || "";

export const gradeOf = (q) => q?.grade || "Genel";

export const difficultyLabel = (q) => DIFFICULTY_LABEL[q?.difficulty] || "Orta";

export const pointsOf = (q) =>
  typeof q?.points === "number" && q.points > 0 ? q.points : null;
