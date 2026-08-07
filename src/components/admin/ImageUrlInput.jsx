import { useState } from "react";

export default function ImageUrlInput({ value, onChange, placeholder }) {
  const [hint, setHint] = useState("");

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files?.length) {
      setHint(
        "Görsel dosyası desteklenmez. Görselin URL adresini yapıştırın veya adres olarak sürükleyin."
      );
      return;
    }
    const url =
      e.dataTransfer.getData("text/uri-list") ||
      e.dataTransfer.getData("text/plain");
    if (url) {
      onChange(url.trim());
      setHint("");
    }
  };

  return (
    <div
      className="img-url-input"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <input
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setHint("");
        }}
        placeholder={placeholder}
      />
      {hint && <p className="img-hint">{hint}</p>}
      {value && (
        <img
          className="img-preview"
          src={value}
          alt="Görsel önizleme"
          onLoad={(e) => {
            e.currentTarget.style.display = "block";
          }}
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      )}
    </div>
  );
}
