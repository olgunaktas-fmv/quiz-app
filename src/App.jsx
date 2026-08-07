import { useMemo } from "react";
import AdminScreen from "./components/admin/AdminScreen";
import PlayerScreen from "./components/player/PlayerScreen";

export default function App() {
  const isAdmin = useMemo(() => window.location.hash.startsWith("#/admin"), []);

  return isAdmin ? <AdminScreen /> : <PlayerScreen />;
}
