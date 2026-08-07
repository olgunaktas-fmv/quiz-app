import { useState } from "react";

export default function JoinScreen({ onJoin }) {
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) onJoin(name.trim());
  };

  return (
    <div className="screen join-screen">
      <div className="join-card">
        <h1>Yarışmaya Katıl</h1>
        <p className="muted">Lütfen görünecek adınızı yazın</p>
        <form onSubmit={handleSubmit}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Adınız"
            maxLength={20}
            autoFocus
          />
          <button type="submit" disabled={!name.trim()}>
            Katıl
          </button>
        </form>
      </div>
    </div>
  );
}
